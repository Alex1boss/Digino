import { 
  users, 
  type User, 
  type InsertUser, 
  products, 
  type ProductDB, 
  type InsertProduct,
  wishlists,
  type Wishlist,
  type InsertWishlist,
  purchases,
  type Purchase,
  type InsertPurchase,
  reviews,
  type Review,
  type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface defining all our data operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Product methods
  getAllProducts(): Promise<ProductDB[]>;
  getProduct(id: number): Promise<ProductDB | undefined>;
  getProductsByAuthor(authorId: number): Promise<ProductDB[]>;
  createProduct(product: InsertProduct): Promise<ProductDB>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<ProductDB | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Wishlist methods
  addToWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  getUserWishlist(userId: number): Promise<Wishlist[]>;
  
  // Purchase methods
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  getProductPurchases(productId: number): Promise<Purchase[]>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getProductReviews(productId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
  
  // Product methods
  async getAllProducts(): Promise<ProductDB[]> {
    return await db.select().from(products);
  }
  
  async getProduct(id: number): Promise<ProductDB | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  
  async getProductsByAuthor(authorId: number): Promise<ProductDB[]> {
    return await db.select()
      .from(products)
      .where(eq(products.authorId, authorId));
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<ProductDB> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<ProductDB | undefined> {
    const result = await db.update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }
  
  // Wishlist methods
  async addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist> {
    const result = await db.insert(wishlists).values(wishlistItem).returning();
    return result[0];
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const result = await db.delete(wishlists)
      .where(
        and(
          eq(wishlists.userId, userId),
          eq(wishlists.productId, productId)
        )
      )
      .returning();
    return result.length > 0;
  }
  
  async getUserWishlist(userId: number): Promise<Wishlist[]> {
    return await db.select()
      .from(wishlists)
      .where(eq(wishlists.userId, userId));
  }
  
  // Purchase methods
  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const result = await db.insert(purchases).values(purchase).returning();
    return result[0];
  }
  
  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return await db.select()
      .from(purchases)
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.createdAt));
  }
  
  async getProductPurchases(productId: number): Promise<Purchase[]> {
    return await db.select()
      .from(purchases)
      .where(eq(purchases.productId, productId))
      .orderBy(desc(purchases.createdAt));
  }
  
  // Review methods
  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }
  
  async getProductReviews(productId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }
}

// Create and export a singleton instance of the database storage
export const storage = new DatabaseStorage();
