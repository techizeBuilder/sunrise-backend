import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  userSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema,
  productSchema,
  orderSchema,
  type UserSession,
  type UserRole,
} from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import session from "express-session";
import { Request, Response, NextFunction } from "express";

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
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

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