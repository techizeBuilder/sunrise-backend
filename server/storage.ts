import {
  type User,
  type UserSession,
  type UserRole,
  type Product,
  type ProductCategory,
  type PriceList,
  type Discount,
  type CustomerGroup,
  type Order,
  type ProductionBatch,
  type InventoryMovement,
  type FinancialRecord,
  type Distributor,
  type InsertUser,
  type InsertProduct,
  type InsertCategory,
  type InsertPriceList,
  type InsertDiscount,
  type InsertCustomerGroup,
  type InsertOrder,
} from "@shared/schema";
import { connectToDatabase } from "./db";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IStorage {
  // User operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  updateUserPassword(id: string, hashedPassword: string): Promise<boolean>;
  setResetToken(email: string, token: string, expiry: Date): Promise<boolean>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearResetToken(id: string): Promise<boolean>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  updateProductStock(id: string, quantity: number): Promise<boolean>;
  getLowStockProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;

  // Category operations
  getCategories(): Promise<ProductCategory[]>;
  getCategory(id: string): Promise<ProductCategory | undefined>;
  createCategory(category: InsertCategory): Promise<ProductCategory>;
  updateCategory(id: string, category: Partial<ProductCategory>): Promise<ProductCategory | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  getCategoriesTree(): Promise<ProductCategory[]>;

  // Price List operations
  getPriceLists(): Promise<PriceList[]>;
  getPriceList(id: string): Promise<PriceList | undefined>;
  createPriceList(priceList: InsertPriceList): Promise<PriceList>;
  updatePriceList(id: string, priceList: Partial<PriceList>): Promise<PriceList | undefined>;
  deletePriceList(id: string): Promise<boolean>;
  getActivePriceLists(): Promise<PriceList[]>;
  getProductPrice(productId: string, priceListId?: string, quantity?: number): Promise<number>;

  // Discount operations
  getDiscounts(): Promise<Discount[]>;
  getDiscount(id: string): Promise<Discount | undefined>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;
  updateDiscount(id: string, discount: Partial<Discount>): Promise<Discount | undefined>;
  deleteDiscount(id: string): Promise<boolean>;
  getActiveDiscounts(): Promise<Discount[]>;
  calculateDiscount(productId: string, quantity: number, customerGroupId?: string): Promise<number>;

  // Customer Group operations
  getCustomerGroups(): Promise<CustomerGroup[]>;
  getCustomerGroup(id: string): Promise<CustomerGroup | undefined>;
  createCustomerGroup(group: InsertCustomerGroup): Promise<CustomerGroup>;
  updateCustomerGroup(id: string, group: Partial<CustomerGroup>): Promise<CustomerGroup | undefined>;
  deleteCustomerGroup(id: string): Promise<boolean>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder, userId: string): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<boolean>;
  getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;

  // Production operations
  getProductionBatches(): Promise<ProductionBatch[]>;
  getProductionBatch(id: string): Promise<ProductionBatch | undefined>;
  createProductionBatch(batch: Partial<ProductionBatch>): Promise<ProductionBatch>;
  updateProductionBatchStatus(id: string, status: string): Promise<boolean>;
  getProductionBatchesByStatus(status: string): Promise<ProductionBatch[]>;

  // Inventory operations
  getInventoryMovements(): Promise<InventoryMovement[]>;
  createInventoryMovement(movement: Partial<InventoryMovement>): Promise<InventoryMovement>;
  getInventoryMovementsByProduct(productId: string): Promise<InventoryMovement[]>;
  getInventoryMovementsByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovement[]>;

  // Financial operations
  getFinancialRecords(): Promise<FinancialRecord[]>;
  createFinancialRecord(record: Partial<FinancialRecord>): Promise<FinancialRecord>;
  updateFinancialRecordApproval(id: string, approved: boolean, approvedBy: string): Promise<boolean>;
  getFinancialRecordsByDateRange(startDate: Date, endDate: Date): Promise<FinancialRecord[]>;
  getFinancialSummary(startDate: Date, endDate: Date): Promise<{income: number, expense: number}>;

  // Distributor operations
  getDistributors(): Promise<Distributor[]>;
  getDistributor(id: string): Promise<Distributor | undefined>;
  createDistributor(distributor: Partial<Distributor>): Promise<Distributor>;
  updateDistributor(id: string, updates: Partial<Distributor>): Promise<Distributor | undefined>;
  getDistributorByUserId(userId: string): Promise<Distributor | undefined>;
}

export class MongoStorage implements IStorage {
  private db: any;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      this.db = await connectToDatabase();
      await this.createSampleData();
    } catch (error) {
      console.error("Failed to initialize MongoDB:", error);
    }
  }

  private async createSampleData() {
    // Check if admin user already exists
    const existingAdmin = await this.db.collection('users').findOne({ email: 'admin@sunrisefoods.in' });
    if (existingAdmin) return;

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await this.createUser({
      email: 'admin@sunrisefoods.in',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    });

    // Create sample users for different roles
    const sampleUsers = [
      { email: 'sales@sunrisefoods.in', role: 'sales', firstName: 'Sales', lastName: 'Manager' },
      { email: 'production@sunrisefoods.in', role: 'production', firstName: 'Production', lastName: 'Head' },
      { email: 'inventory@sunrisefoods.in', role: 'inventory', firstName: 'Inventory', lastName: 'Manager' },
      { email: 'accounts@sunrisefoods.in', role: 'accounts', firstName: 'Accounts', lastName: 'Manager' },
      { email: 'distributor@sunrisefoods.in', role: 'distributor', firstName: 'Distributor', lastName: 'Partner' },
    ];

    for (const userData of sampleUsers) {
      await this.createUser({
        ...userData,
        password: hashedPassword,
        isActive: true,
      } as InsertUser);
    }

    // Create sample categories first
    const sampleCategories = [
      { name: "Breads", description: "Fresh baked breads and artisan loaves", sortOrder: 1, isActive: true },
      { name: "Cakes", description: "Celebration cakes and desserts", sortOrder: 2, isActive: true },
      { name: "Pastries", description: "Flaky pastries and sweet treats", sortOrder: 3, isActive: true },
      { name: "Cookies", description: "Crispy and soft baked cookies", sortOrder: 4, isActive: true },
    ];

    const categoryIds = {};
    for (const categoryData of sampleCategories) {
      const category = await this.createCategory(categoryData);
      categoryIds[categoryData.name.toLowerCase()] = category.id;
    }

    // Create sample products with updated schema
    const sampleProducts = [
      {
        name: "Classic Sourdough",
        description: "Traditional sourdough with perfect crust and tangy flavor",
        basePrice: 85,
        categoryId: categoryIds.breads,
        sku: "BR001",
        unit: "piece" as const,
        stock: 50,
        minStock: 10,
        imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [],
        specifications: { weight: "500g", ingredients: "Flour, Water, Salt, Sourdough Starter" },
        tags: ["artisan", "traditional", "organic"],
        isActive: true,
      },
      {
        name: "Multigrain Harvest",
        description: "Hearty blend of whole grains, seeds, and nuts",
        basePrice: 92,
        categoryId: categoryIds.breads,
        sku: "BR002",
        unit: "piece" as const,
        stock: 30,
        minStock: 8,
        imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [],
        specifications: { weight: "600g", ingredients: "Mixed grains, Seeds, Nuts, Flour" },
        tags: ["healthy", "multigrain", "nutritious"],
        isActive: true,
      },
      {
        name: "Chocolate Layer Cake",
        description: "Rich chocolate cake with layers of buttercream frosting",
        basePrice: 450,
        categoryId: categoryIds.cakes,
        sku: "CK001",
        unit: "piece" as const,
        stock: 15,
        minStock: 5,
        imageUrl: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [],
        specifications: { size: "8 inch", serves: "8-10 people", layers: "3" },
        tags: ["celebration", "chocolate", "premium"],
        isActive: true,
      },
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }

    // Create sample price lists
    const retailPriceList = await this.createPriceList({
      name: "Retail Prices",
      description: "Standard retail pricing for walk-in customers",
      type: "retail",
      isDefault: true,
      minimumQuantity: 1,
      validFrom: new Date(),
      customerGroups: [],
      products: [],
      isActive: true,
    });

    const wholesalePriceList = await this.createPriceList({
      name: "Wholesale Prices",
      description: "Bulk pricing for wholesale customers",
      type: "wholesale",
      isDefault: false,
      minimumQuantity: 50,
      validFrom: new Date(),
      customerGroups: [],
      products: [],
      isActive: true,
    });
  }

  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ id });
    return user ? this.transformMongoDoc(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ email });
    return user ? this.transformMongoDoc(user) : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = new ObjectId().toString();
    const user = {
      id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await this.db.collection('users').insertOne(user);
    return this.transformMongoDoc(user);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db.collection('users').findOneAndUpdate(
      { id },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ? this.transformMongoDoc(result) : undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.collection('users').deleteOne({ id });
    return result.deletedCount > 0;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.db.collection('users').find({}).toArray();
    return users.map(user => this.transformMongoDoc(user));
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<boolean> {
    const result = await this.db.collection('users').updateOne(
      { id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async setResetToken(email: string, token: string, expiry: Date): Promise<boolean> {
    const result = await this.db.collection('users').updateOne(
      { email },
      { $set: { resetToken: token, resetTokenExpiry: expiry, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });
    return user ? this.transformMongoDoc(user) : undefined;
  }

  async clearResetToken(id: string): Promise<boolean> {
    const result = await this.db.collection('users').updateOne(
      { id },
      { $unset: { resetToken: "", resetTokenExpiry: "" }, $set: { updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    const products = await this.db.collection('products').find({}).toArray();
    return products.map(product => this.transformMongoDoc(product));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const product = await this.db.collection('products').findOne({ id });
    return product ? this.transformMongoDoc(product) : undefined;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = new ObjectId().toString();
    const product = {
      id,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await this.db.collection('products').insertOne(product);
    return this.transformMongoDoc(product);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | undefined> {
    const result = await this.db.collection('products').findOneAndUpdate(
      { id },
      { $set: { ...productData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ? this.transformMongoDoc(result) : undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.db.collection('products').deleteOne({ id });
    return result.deletedCount > 0;
  }

  async updateProductStock(id: string, quantity: number): Promise<boolean> {
    const result = await this.db.collection('products').updateOne(
      { id },
      { $inc: { stock: quantity }, $set: { updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const products = await this.db.collection('products').find({
      $expr: { $lte: ["$stock", "$minStock"] }
    }).toArray();
    return products.map(product => this.transformMongoDoc(product));
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    const orders = await this.db.collection('orders').find({}).sort({ orderDate: -1 }).toArray();
    return orders.map(order => this.transformMongoDoc(order));
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.db.collection('orders').find({ userId }).sort({ orderDate: -1 }).toArray();
    return orders.map(order => this.transformMongoDoc(order));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const order = await this.db.collection('orders').findOne({ id });
    return order ? this.transformMongoDoc(order) : undefined;
  }

  async createOrder(orderData: InsertOrder, userId: string): Promise<Order> {
    const id = new ObjectId().toString();
    const orderNumber = `ORD-${Date.now()}`;
    
    // Calculate total amount
    let totalAmount = 0;
    const items = [];
    for (const item of orderData.items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        const unitPrice = parseFloat(product.price.replace('₹', ''));
        const totalPrice = unitPrice * item.quantity;
        totalAmount += totalPrice;
        items.push({
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      }
    }

    const order = {
      id,
      orderNumber,
      customerId: userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      items,
      totalAmount,
      status: 'pending',
      orderDate: new Date(),
      distributorId: orderData.distributorId,
      notes: orderData.notes,
    };
    
    await this.db.collection('orders').insertOne(order);
    return this.transformMongoDoc(order);
  }

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    const result = await this.db.collection('orders').updateOne(
      { id },
      { $set: { status } }
    );
    return result.modifiedCount > 0;
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const orders = await this.db.collection('orders').find({
      orderDate: { $gte: startDate, $lte: endDate }
    }).sort({ orderDate: -1 }).toArray();
    return orders.map(order => this.transformMongoDoc(order));
  }

  // Production operations
  async getProductionBatches(): Promise<ProductionBatch[]> {
    const batches = await this.db.collection('productionBatches').find({}).sort({ startDate: -1 }).toArray();
    return batches.map(batch => this.transformMongoDoc(batch));
  }

  async getProductionBatch(id: string): Promise<ProductionBatch | undefined> {
    const batch = await this.db.collection('productionBatches').findOne({ id });
    return batch ? this.transformMongoDoc(batch) : undefined;
  }

  async createProductionBatch(batchData: Partial<ProductionBatch>): Promise<ProductionBatch> {
    const id = new ObjectId().toString();
    const batchNumber = `BATCH-${Date.now()}`;
    const batch = {
      id,
      batchNumber,
      ...batchData,
    };
    
    await this.db.collection('productionBatches').insertOne(batch);
    return this.transformMongoDoc(batch);
  }

  async updateProductionBatchStatus(id: string, status: string): Promise<boolean> {
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.actualEndDate = new Date();
    }

    const result = await this.db.collection('productionBatches').updateOne(
      { id },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  async getProductionBatchesByStatus(status: string): Promise<ProductionBatch[]> {
    const batches = await this.db.collection('productionBatches').find({ status }).toArray();
    return batches.map(batch => this.transformMongoDoc(batch));
  }

  // Inventory operations
  async getInventoryMovements(): Promise<InventoryMovement[]> {
    const movements = await this.db.collection('inventoryMovements').find({}).sort({ date: -1 }).toArray();
    return movements.map(movement => this.transformMongoDoc(movement));
  }

  async createInventoryMovement(movementData: Partial<InventoryMovement>): Promise<InventoryMovement> {
    const id = new ObjectId().toString();
    const movement = {
      id,
      ...movementData,
      date: new Date(),
    };
    
    await this.db.collection('inventoryMovements').insertOne(movement);
    
    // Update product stock
    if (movement.productId && movement.quantity) {
      const stockChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
      await this.updateProductStock(movement.productId, stockChange);
    }
    
    return this.transformMongoDoc(movement);
  }

  async getInventoryMovementsByProduct(productId: string): Promise<InventoryMovement[]> {
    const movements = await this.db.collection('inventoryMovements').find({ productId }).sort({ date: -1 }).toArray();
    return movements.map(movement => this.transformMongoDoc(movement));
  }

  async getInventoryMovementsByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovement[]> {
    const movements = await this.db.collection('inventoryMovements').find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 }).toArray();
    return movements.map(movement => this.transformMongoDoc(movement));
  }

  // Financial operations
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    const records = await this.db.collection('financialRecords').find({}).sort({ date: -1 }).toArray();
    return records.map(record => this.transformMongoDoc(record));
  }

  async createFinancialRecord(recordData: Partial<FinancialRecord>): Promise<FinancialRecord> {
    const id = new ObjectId().toString();
    const record = {
      id,
      ...recordData,
      date: new Date(),
      approved: false,
    };
    
    await this.db.collection('financialRecords').insertOne(record);
    return this.transformMongoDoc(record);
  }

  async updateFinancialRecordApproval(id: string, approved: boolean, approvedBy: string): Promise<boolean> {
    const result = await this.db.collection('financialRecords').updateOne(
      { id },
      { $set: { approved, approvedBy } }
    );
    return result.modifiedCount > 0;
  }

  async getFinancialRecordsByDateRange(startDate: Date, endDate: Date): Promise<FinancialRecord[]> {
    const records = await this.db.collection('financialRecords').find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 }).toArray();
    return records.map(record => this.transformMongoDoc(record));
  }

  async getFinancialSummary(startDate: Date, endDate: Date): Promise<{income: number, expense: number}> {
    const pipeline = [
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          approved: true
        }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ];

    const results = await this.db.collection('financialRecords').aggregate(pipeline).toArray();
    
    let income = 0;
    let expense = 0;
    
    results.forEach(result => {
      if (result._id === 'income') income = result.total;
      if (result._id === 'expense') expense = result.total;
    });

    return { income, expense };
  }

  // Distributor operations
  async getDistributors(): Promise<Distributor[]> {
    const distributors = await this.db.collection('distributors').find({}).toArray();
    return distributors.map(distributor => this.transformMongoDoc(distributor));
  }

  async getDistributor(id: string): Promise<Distributor | undefined> {
    const distributor = await this.db.collection('distributors').findOne({ id });
    return distributor ? this.transformMongoDoc(distributor) : undefined;
  }

  async createDistributor(distributorData: Partial<Distributor>): Promise<Distributor> {
    const id = new ObjectId().toString();
    const distributor = {
      id,
      ...distributorData,
      createdAt: new Date(),
    };
    
    await this.db.collection('distributors').insertOne(distributor);
    return this.transformMongoDoc(distributor);
  }

  async updateDistributor(id: string, updates: Partial<Distributor>): Promise<Distributor | undefined> {
    const result = await this.db.collection('distributors').findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result ? this.transformMongoDoc(result) : undefined;
  }

  async getDistributorByUserId(userId: string): Promise<Distributor | undefined> {
    const distributor = await this.db.collection('distributors').findOne({ userId });
    return distributor ? this.transformMongoDoc(distributor) : undefined;
  }

  private transformMongoDoc(doc: any): any {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return rest;
  }
}

export const storage = new MongoStorage();