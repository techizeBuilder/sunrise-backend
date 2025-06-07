import {
  products,
  galleryImages,
  contactMessages,
  adminUsers,
  type Product,
  type InsertProduct,
  type GalleryImage,
  type InsertGalleryImage,
  type ContactMessage,
  type InsertContactMessage,
  type AdminUser,
  type InsertAdminUser,
} from "@shared/schema";
import { connectToDatabase } from "./db";
import { ObjectId } from "mongodb";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Gallery operations
  getGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<boolean>;

  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Admin operations
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private galleryImages: Map<number, GalleryImage>;
  private contactMessages: Map<number, ContactMessage>;
  private adminUsers: Map<number, AdminUser>;
  private currentProductId: number;
  private currentGalleryId: number;
  private currentMessageId: number;
  private currentAdminId: number;

  constructor() {
    this.products = new Map();
    this.galleryImages = new Map();
    this.contactMessages = new Map();
    this.adminUsers = new Map();
    this.currentProductId = 1;
    this.currentGalleryId = 1;
    this.currentMessageId = 1;
    this.currentAdminId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Classic Sourdough",
        description: "Traditional sourdough with perfect crust and tangy flavor",
        price: "₹85",
        category: "breads",
        imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "Multigrain Harvest",
        description: "Hearty blend of whole grains, seeds, and nuts",
        price: "₹92",
        category: "breads",
        imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "Butter Croissant",
        description: "Flaky, buttery layers of perfection",
        price: "₹38",
        category: "pastries",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab794f27d96e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "Pain au Chocolat",
        description: "Buttery, flaky pastry filled with premium Belgian dark chocolate",
        price: "₹48",
        category: "pastries",
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "French Macarons",
        description: "Delicate almond cookies with ganache filling in various flavors",
        price: "₹32 each",
        category: "desserts",
        imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "Chocolate Éclair",
        description: "Classic choux pastry filled with vanilla cream and chocolate glaze",
        price: "₹42",
        category: "desserts",
        imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "Chocolate Layer Cake",
        description: "Rich chocolate cake with layers of buttercream frosting",
        price: "₹450",
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
      {
        name: "Red Velvet Cake",
        description: "Classic red velvet with cream cheese frosting",
        price: "₹480",
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
      },
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });

    // Sample gallery images
    const sampleGalleryImages: InsertGalleryImage[] = [
      {
        title: "Baker at Work",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Baker kneading dough in traditional kitchen",
      },
      {
        title: "Fresh Bread Display",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Fresh bread display in bakery window",
      },
      {
        title: "Artisan Pastries",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Artisanal pastries on wooden boards",
      },
      {
        title: "Traditional Oven",
        imageUrl: "https://images.unsplash.com/photo-1586985564150-0bf4e4d8b84a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Traditional brick oven with flames",
      },
      {
        title: "Wedding Cake",
        imageUrl: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Wedding cake decorating process",
      },
      {
        title: "Macaron Collection",
        imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Colorful macaron tower",
      },
    ];

    sampleGalleryImages.forEach(image => {
      this.createGalleryImage(image);
    });

    // Create default admin user
    this.createAdmin({
      email: "admin@goldencrust.com",
      password: "admin123", // In production, this should be hashed
    });
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category && p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      imageUrl: productData.imageUrl,
      isActive: productData.isActive ?? true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;

    const updatedProduct: Product = {
      ...existingProduct,
      ...productData,
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Gallery operations
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(imageData: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.currentGalleryId++;
    const image: GalleryImage = {
      ...imageData,
      id,
      createdAt: new Date(),
    };
    this.galleryImages.set(id, image);
    return image;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = {
      ...messageData,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;

    const updatedMessage = { ...message, isRead: true };
    this.contactMessages.set(id, updatedMessage);
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Admin operations
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(admin => admin.email === email);
  }

  async createAdmin(adminData: InsertAdminUser): Promise<AdminUser> {
    const id = this.currentAdminId++;
    const admin: AdminUser = {
      ...adminData,
      id,
      createdAt: new Date(),
    };
    this.adminUsers.set(id, admin);
    return admin;
  }
}

// MongoDB Storage Implementation
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
    // Check if data already exists
    const existingProducts = await this.db.collection('products').countDocuments();
    if (existingProducts > 0) return;

    // Sample products
    const sampleProducts = [
      {
        name: "Classic Sourdough",
        description: "Traditional sourdough with perfect crust and tangy flavor",
        price: "$8.50",
        category: "breads",
        imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Multigrain Harvest",
        description: "Hearty blend of whole grains, seeds, and nuts",
        price: "$9.25",
        category: "breads",
        imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Butter Croissant",
        description: "Flaky, buttery layers of perfection",
        price: "$3.75",
        category: "pastries",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab794f27d96e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Pain au Chocolat",
        description: "Buttery, flaky pastry filled with premium Belgian dark chocolate",
        price: "$4.75",
        category: "pastries",
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "French Macarons",
        description: "Delicate almond cookies with ganache filling in various flavors",
        price: "$3.25 each",
        category: "desserts",
        imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Chocolate Éclair",
        description: "Classic choux pastry filled with vanilla cream and chocolate glaze",
        price: "$4.25",
        category: "desserts",
        imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Chocolate Layer Cake",
        description: "Rich chocolate cake with layers of buttercream frosting",
        price: "$45.00",
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Red Velvet Cake",
        description: "Classic red velvet with cream cheese frosting",
        price: "$48.00",
        category: "cakes",
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // Sample gallery images
    const sampleGalleryImages = [
      {
        title: "Baker at Work",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Baker kneading dough in traditional kitchen",
        createdAt: new Date(),
      },
      {
        title: "Fresh Bread Display",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Fresh bread display in bakery window",
        createdAt: new Date(),
      },
      {
        title: "Artisan Pastries",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Artisanal pastries on wooden boards",
        createdAt: new Date(),
      },
      {
        title: "Traditional Oven",
        imageUrl: "https://images.unsplash.com/photo-1586985564150-0bf4e4d8b84a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Traditional brick oven with flames",
        createdAt: new Date(),
      },
      {
        title: "Wedding Cake",
        imageUrl: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Wedding cake decorating process",
        createdAt: new Date(),
      },
      {
        title: "Macaron Collection",
        imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        altText: "Colorful macaron tower",
        createdAt: new Date(),
      },
    ];

    // Insert sample data
    await this.db.collection('products').insertMany(sampleProducts);
    await this.db.collection('gallery_images').insertMany(sampleGalleryImages);
    
    // Create default admin user
    await this.db.collection('admin_users').insertOne({
      email: "admin@goldencrust.com",
      password: "admin123",
      createdAt: new Date(),
    });

    console.log("Sample data created in MongoDB");
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    if (!this.db) await this.initializeDatabase();
    const products = await this.db.collection('products').find({ isActive: true }).toArray();
    return products.map(this.transformMongoDoc);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!this.db) await this.initializeDatabase();
    const products = await this.db.collection('products').find({ 
      category, 
      isActive: true 
    }).toArray();
    return products.map(this.transformMongoDoc);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    if (!this.db) await this.initializeDatabase();
    try {
      const product = await this.db.collection('products').findOne({ _id: new ObjectId(id.toString()) });
      return product ? this.transformMongoDoc(product) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('products').insertOne({
      ...productData,
      isActive: productData.isActive ?? true,
      createdAt: new Date(),
    });
    
    const product = await this.db.collection('products').findOne({ _id: result.insertedId });
    return this.transformMongoDoc(product);
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    if (!this.db) await this.initializeDatabase();
    await this.db.collection('products').updateOne(
      { _id: new ObjectId(id.toString()) },
      { $set: productData }
    );
    
    const product = await this.db.collection('products').findOne({ _id: new ObjectId(id.toString()) });
    return product ? this.transformMongoDoc(product) : undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('products').deleteOne({ _id: new ObjectId(id.toString()) });
    return result.deletedCount > 0;
  }

  // Gallery operations
  async getGalleryImages(): Promise<GalleryImage[]> {
    if (!this.db) await this.initializeDatabase();
    const images = await this.db.collection('gallery_images').find({}).toArray();
    return images.map(this.transformMongoDoc);
  }

  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    if (!this.db) await this.initializeDatabase();
    const image = await this.db.collection('gallery_images').findOne({ _id: new ObjectId(id.toString()) });
    return image ? this.transformMongoDoc(image) : undefined;
  }

  async createGalleryImage(imageData: InsertGalleryImage): Promise<GalleryImage> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('gallery_images').insertOne({
      ...imageData,
      createdAt: new Date(),
    });
    
    const image = await this.db.collection('gallery_images').findOne({ _id: result.insertedId });
    return this.transformMongoDoc(image);
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('gallery_images').deleteOne({ _id: new ObjectId(id.toString()) });
    return result.deletedCount > 0;
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    if (!this.db) await this.initializeDatabase();
    const messages = await this.db.collection('contact_messages').find({}).sort({ createdAt: -1 }).toArray();
    return messages.map(this.transformMongoDoc);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    if (!this.db) await this.initializeDatabase();
    const message = await this.db.collection('contact_messages').findOne({ _id: new ObjectId(id.toString()) });
    return message ? this.transformMongoDoc(message) : undefined;
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('contact_messages').insertOne({
      ...messageData,
      isRead: false,
      createdAt: new Date(),
    });
    
    const message = await this.db.collection('contact_messages').findOne({ _id: result.insertedId });
    return this.transformMongoDoc(message);
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('contact_messages').updateOne(
      { _id: new ObjectId(id.toString()) },
      { $set: { isRead: true } }
    );
    return result.modifiedCount > 0;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('contact_messages').deleteOne({ _id: new ObjectId(id.toString()) });
    return result.deletedCount > 0;
  }

  // Admin operations
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    if (!this.db) await this.initializeDatabase();
    const admin = await this.db.collection('admin_users').findOne({ email });
    return admin ? this.transformMongoDoc(admin) : undefined;
  }

  async createAdmin(adminData: InsertAdminUser): Promise<AdminUser> {
    if (!this.db) await this.initializeDatabase();
    const result = await this.db.collection('admin_users').insertOne({
      ...adminData,
      createdAt: new Date(),
    });
    
    const admin = await this.db.collection('admin_users').findOne({ _id: result.insertedId });
    return this.transformMongoDoc(admin);
  }

  // Helper method to transform MongoDB documents
  private transformMongoDoc(doc: any): any {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}

export const storage = new MongoStorage();
