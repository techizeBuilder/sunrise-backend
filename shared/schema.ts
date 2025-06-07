import { z } from "zod";

// User Roles
export type UserRole = "admin" | "sales" | "production" | "inventory" | "accounts" | "distributor";

// User Management
export interface User {
  _id?: string;
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  userId: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
}

// Products
export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  sku: string;
  unit: "piece" | "kg" | "liter" | "gram" | "pack" | "box";
  stock: number;
  minStock: number;
  imageUrl: string;
  images: string[]; // Multiple product images
  specifications: Record<string, string>; // Key-value pairs for product specs
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  _id?: string;
  id: string;
  name: string;
  description: string;
  parentId?: string; // For hierarchical categories
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceList {
  _id?: string;
  id: string;
  name: string;
  description: string;
  type: "retail" | "wholesale" | "b2b" | "special";
  isDefault: boolean;
  minimumQuantity: number;
  validFrom: Date;
  validTo?: Date;
  customerGroups: string[]; // Customer segments this applies to
  products: PriceListProduct[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceListProduct {
  productId: string;
  price: number;
  discountPercentage?: number;
  minimumQuantity: number;
}

export interface Discount {
  _id?: string;
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount";
  value: number; // Percentage or fixed amount
  applicationType: "product" | "category" | "order" | "customer";
  targetIds: string[]; // Product IDs, Category IDs, or Customer IDs
  conditions: DiscountConditions;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountConditions {
  minimumOrderValue?: number;
  minimumQuantity?: number;
  customerGroups?: string[];
  dayOfWeek?: number[]; // 0-6 for Sunday-Saturday
  timeSlots?: { start: string; end: string }[]; // HH:MM format
}

export interface CustomerGroup {
  _id?: string;
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  priceListIds: string[];
  isActive: boolean;
  createdAt: Date;
}

// Orders
export interface Order {
  _id?: string;
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: Date;
  deliveryDate?: Date;
  distributorId?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Production
export interface ProductionBatch {
  _id?: string;
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  status: "planned" | "in-progress" | "completed" | "cancelled";
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  supervisorId: string;
  notes?: string;
}

// Inventory
export interface InventoryMovement {
  _id?: string;
  id: string;
  productId: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  userId: string;
  date: Date;
  batchNumber?: string;
}

// Financial Records
export interface FinancialRecord {
  _id?: string;
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: Date;
  userId: string;
  orderId?: string;
  approved: boolean;
  approvedBy?: string;
}

// Distributors
export interface Distributor {
  _id?: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  userId?: string;
  createdAt: Date;
}

// Zod Schemas for validation
export const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "sales", "production", "inventory", "accounts", "distributor"]),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const updatePasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().min(0, "Base price cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  sku: z.string().min(1, "SKU is required"),
  unit: z.enum(["piece", "kg", "liter", "gram", "pack", "box"]),
  stock: z.number().min(0, "Stock cannot be negative"),
  minStock: z.number().min(0, "Minimum stock cannot be negative"),
  imageUrl: z.string().url("Invalid image URL"),
  images: z.array(z.string().url()).default([]),
  specifications: z.record(z.string()).default({}),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  parentId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const priceListSchema = z.object({
  name: z.string().min(1, "Price list name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["retail", "wholesale", "b2b", "special"]),
  isDefault: z.boolean().default(false),
  minimumQuantity: z.number().min(1, "Minimum quantity must be at least 1"),
  validFrom: z.date(),
  validTo: z.date().optional(),
  customerGroups: z.array(z.string()).default([]),
  products: z.array(z.object({
    productId: z.string(),
    price: z.number().min(0),
    discountPercentage: z.number().min(0).max(100).optional(),
    minimumQuantity: z.number().min(1),
  })).default([]),
  isActive: z.boolean().default(true),
});

export const discountSchema = z.object({
  name: z.string().min(1, "Discount name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.number().min(0, "Discount value cannot be negative"),
  applicationType: z.enum(["product", "category", "order", "customer"]),
  targetIds: z.array(z.string()).default([]),
  conditions: z.object({
    minimumOrderValue: z.number().min(0).optional(),
    minimumQuantity: z.number().min(1).optional(),
    customerGroups: z.array(z.string()).optional(),
    dayOfWeek: z.array(z.number().min(0).max(6)).optional(),
    timeSlots: z.array(z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    })).optional(),
  }).default({}),
  validFrom: z.date(),
  validTo: z.date(),
  usageLimit: z.number().min(1).optional(),
  usedCount: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const customerGroupSchema = z.object({
  name: z.string().min(1, "Customer group name is required"),
  description: z.string().min(1, "Description is required"),
  discountPercentage: z.number().min(0).max(100),
  priceListIds: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email format"),
  items: z.array(z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  })).min(1, "At least one item is required"),
  distributorId: z.string().optional(),
  notes: z.string().optional(),
});

// Types for components
export type InsertUser = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type InsertProduct = z.infer<typeof productSchema>;
export type InsertCategory = z.infer<typeof categorySchema>;
export type InsertPriceList = z.infer<typeof priceListSchema>;
export type InsertDiscount = z.infer<typeof discountSchema>;
export type InsertCustomerGroup = z.infer<typeof customerGroupSchema>;
export type InsertOrder = z.infer<typeof orderSchema>;
