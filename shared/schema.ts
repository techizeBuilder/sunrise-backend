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
  price: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  minStock: z.number().min(0, "Minimum stock cannot be negative"),
  imageUrl: z.string().url("Invalid image URL"),
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
export type InsertOrder = z.infer<typeof orderSchema>;
