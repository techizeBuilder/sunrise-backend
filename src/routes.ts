import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  userSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
  productSchema,
  categorySchema,
  priceListSchema,
  discountSchema,
  customerGroupSchema,
  orderSchema,
  type UserSession,
  type UserRole,
} from "./shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Extend session type
declare module 'express-session' {
  interface SessionData {
    user?: UserSession;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' as const
  }
};

// Multer configuration for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = req.path.includes('/products') ? './uploads/products' :
                        req.path.includes('/categories') ? './uploads/categories' :
                        req.path.includes('/discounts') ? './uploads/discounts' :
                        './uploads';
      
      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Extended Request interface for session
interface AuthenticatedRequest extends Request {
  user?: UserSession;
}

// Authentication middleware
const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  req.user = req.session.user;
  next();
};

// Role-based authorization middleware
const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));
  
  // Session middleware
  app.use(session(sessionConfig));

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // Create session
      const userSession: UserSession = {
        userId: user.id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      req.session.user = userSession;

      res.json({
        success: true,
        user: userSession,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitive } = user;
      res.json(userWithoutSensitive);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Self profile update route (any authenticated user can update their own profile)
  app.put("/api/auth/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const userId = req.user!.userId;
      
      // Remove sensitive fields that users shouldn't be able to update
      const { password, role, isActive, resetToken, resetTokenExpiry, ...allowedUpdates } = updates;
      
      const user = await storage.updateUser(userId, allowedUpdates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update session data
      if (req.session.user) {
        req.session.user.firstName = user.firstName;
        req.session.user.lastName = user.lastName;
        req.session.user.email = user.email;
      }

      const { password: pwd, resetToken: token, resetTokenExpiry: expiry, ...userWithoutSensitive } = user;
      res.json(userWithoutSensitive);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = resetPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return res.json({ success: true, message: "If the email exists, a reset link has been sent" });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000); // 1 hour

      await storage.setResetToken(email, resetToken, expiry);

      // In a real app, send email here
      console.log(`Reset token for ${email}: ${resetToken}`);

      res.json({ success: true, message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = updatePasswordSchema.parse(req.body);
      
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.clearResetToken(user.id);

      res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // User management routes (Admin only)
  app.get("/api/users", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(user => {
        const { password, resetToken, resetTokenExpiry, ...userWithoutSensitive } = user;
        return userWithoutSensitive;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const userData = userSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitive } = user;
      res.status(201).json(userWithoutSensitive);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.put("/api/users/:id", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateProfileSchema.parse(req.body);
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, resetToken, resetTokenExpiry, ...userWithoutSensitive } = user;
      res.json(userWithoutSensitive);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Specific routes must come before parameterized routes
  app.get("/api/products/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const products = await storage.searchProducts(q);
      res.json(products);
    } catch (error) {
      console.error("Search products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/low-stock", requireAuth, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Get low stock products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/products", requireAuth, requireRole(['admin', 'inventory']), async (req, res) => {
    try {
      const productData = productSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.put("/api/products/:id", requireAuth, requireRole(['admin', 'inventory']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = productSchema.partial().parse(req.body);
      
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/products/:id", requireAuth, requireRole(['admin', 'inventory']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/products/:id/stock", requireAuth, requireRole(['admin', 'inventory']), async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number') {
        return res.status(400).json({ message: "Quantity must be a number" });
      }
      
      const success = await storage.updateProductStock(id, quantity);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
      console.error("Update stock error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Image upload routes
  app.post("/api/upload/product", requireAuth, requireRole(['admin', 'inventory']), upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const imageUrl = `/uploads/products/${req.file.filename}`;
      res.json({ imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Product image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/upload/category", requireAuth, requireRole(['admin']), upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const imageUrl = `/uploads/categories/${req.file.filename}`;
      res.json({ imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Category image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/upload/discount", requireAuth, requireRole(['admin', 'sales']), upload.single('image'), (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const imageUrl = `/uploads/discounts/${req.file.filename}`;
      res.json({ imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Discount image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Get category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/categories", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const categoryData = categorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.put("/api/categories/:id", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = categorySchema.partial().parse(req.body);
      
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/categories/:id", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Price List routes
  app.get("/api/price-lists", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const priceLists = await storage.getPriceLists();
      res.json(priceLists);
    } catch (error) {
      console.error("Get price lists error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/price-lists/active", async (req, res) => {
    try {
      const priceLists = await storage.getActivePriceLists();
      res.json(priceLists);
    } catch (error) {
      console.error("Get active price lists error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/price-lists", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const priceListData = priceListSchema.parse(req.body);
      const priceList = await storage.createPriceList(priceListData);
      res.status(201).json(priceList);
    } catch (error) {
      console.error("Create price list error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Discount routes
  app.get("/api/discounts", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const discounts = await storage.getDiscounts();
      res.json(discounts);
    } catch (error) {
      console.error("Get discounts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/discounts/active", async (req, res) => {
    try {
      const discounts = await storage.getActiveDiscounts();
      res.json(discounts);
    } catch (error) {
      console.error("Get active discounts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/discounts", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      // Convert date strings to Date objects
      const requestBody = {
        ...req.body,
        validFrom: req.body.validFrom ? new Date(req.body.validFrom) : undefined,
        validTo: req.body.validTo ? new Date(req.body.validTo) : undefined,
      };
      
      const discountData = discountSchema.parse(requestBody);
      const discount = await storage.createDiscount(discountData);
      res.status(201).json(discount);
    } catch (error) {
      console.error("Create discount error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.patch("/api/discounts/:id", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Convert date strings to Date objects
      const requestBody = {
        ...req.body,
        validFrom: req.body.validFrom ? new Date(req.body.validFrom) : undefined,
        validTo: req.body.validTo ? new Date(req.body.validTo) : undefined,
      };
      
      const updatedDiscount = await storage.updateDiscount(id, requestBody);
      
      if (!updatedDiscount) {
        return res.status(404).json({ message: "Discount not found" });
      }

      res.json(updatedDiscount);
    } catch (error) {
      console.error("Update discount error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/discounts/:id", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const { id } = req.params;
      
      const success = await storage.deleteDiscount(id);
      
      if (!success) {
        return res.status(404).json({ message: "Discount not found" });
      }

      res.json({ success: true, message: "Discount deleted successfully" });
    } catch (error) {
      console.error("Delete discount error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Customer Group routes
  app.get("/api/customer-groups", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const groups = await storage.getCustomerGroups();
      res.json(groups);
    } catch (error) {
      console.error("Get customer groups error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/customer-groups", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const groupData = customerGroupSchema.parse(req.body);
      const group = await storage.createCustomerGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      console.error("Create customer group error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete("/api/products/:id", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Orders routes
  app.get("/api/orders", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/orders", requireAuth, requireRole(['admin', 'sales']), async (req: AuthenticatedRequest, res) => {
    try {
      const orderData = orderSchema.parse(req.body);
      const order = await storage.createOrder(orderData, req.user!.userId);
      res.status(201).json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.put("/api/orders/:id/status", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const success = await storage.updateOrderStatus(id, status);
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ success: true, message: "Order status updated" });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Production routes
  app.get("/api/production/batches", requireAuth, requireRole(['admin', 'production']), async (req, res) => {
    try {
      const batches = await storage.getProductionBatches();
      res.json(batches);
    } catch (error) {
      console.error("Get production batches error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/production/batches", requireAuth, requireRole(['admin', 'production']), async (req: AuthenticatedRequest, res) => {
    try {
      const batchData = req.body;
      batchData.supervisorId = req.user!.userId;
      
      const batch = await storage.createProductionBatch(batchData);
      res.status(201).json(batch);
    } catch (error) {
      console.error("Create production batch error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Inventory routes
  app.get("/api/inventory/movements", requireAuth, requireRole(['admin', 'inventory']), async (req, res) => {
    try {
      const movements = await storage.getInventoryMovements();
      res.json(movements);
    } catch (error) {
      console.error("Get inventory movements error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/inventory/movements", requireAuth, requireRole(['admin', 'inventory']), async (req: AuthenticatedRequest, res) => {
    try {
      const movementData = req.body;
      movementData.userId = req.user!.userId;
      
      const movement = await storage.createInventoryMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      console.error("Create inventory movement error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/inventory/low-stock", requireAuth, requireRole(['admin', 'inventory']), async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Get low stock products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Financial routes
  app.get("/api/financial/records", requireAuth, requireRole(['admin', 'accounts']), async (req, res) => {
    try {
      const records = await storage.getFinancialRecords();
      res.json(records);
    } catch (error) {
      console.error("Get financial records error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/financial/records", requireAuth, requireRole(['admin', 'accounts']), async (req: AuthenticatedRequest, res) => {
    try {
      const recordData = req.body;
      recordData.userId = req.user!.userId;
      
      const record = await storage.createFinancialRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Create financial record error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/financial/summary", requireAuth, requireRole(['admin', 'accounts']), async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const summary = await storage.getFinancialSummary(start, end);
      res.json(summary);
    } catch (error) {
      console.error("Get financial summary error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Distributor routes
  app.get("/api/distributors", requireAuth, requireRole(['admin', 'sales']), async (req, res) => {
    try {
      const distributors = await storage.getDistributors();
      res.json(distributors);
    } catch (error) {
      console.error("Get distributors error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/distributors", requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const distributorData = req.body;
      const distributor = await storage.createDistributor(distributorData);
      res.status(201).json(distributor);
    } catch (error) {
      console.error("Create distributor error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Dashboard stats routes
  app.get("/api/dashboard/stats", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userRole = req.user!.role;
      const stats: any = {};

      // Common stats
      const products = await storage.getProducts();
      stats.totalProducts = products.length;

      if (userRole === 'admin' || userRole === 'sales') {
        const orders = await storage.getOrders();
        stats.totalOrders = orders.length;
        stats.pendingOrders = orders.filter(o => o.status === 'pending').length;
      }

      if (userRole === 'admin' || userRole === 'inventory') {
        const lowStockProducts = await storage.getLowStockProducts();
        stats.lowStockProducts = lowStockProducts.length;
      }

      if (userRole === 'admin' || userRole === 'production') {
        const batches = await storage.getProductionBatches();
        stats.activeBatches = batches.filter(b => b.status === 'in-progress').length;
      }

      if (userRole === 'admin' || userRole === 'accounts') {
        const endDate = new Date();
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const financial = await storage.getFinancialSummary(startDate, endDate);
        stats.monthlyIncome = financial.income;
        stats.monthlyExpense = financial.expense;
      }

      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}