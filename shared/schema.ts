import { pgTable, text, serial, integer, boolean, timestamp, real, foreignKey, varchar, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import {
  Box, 
  Code, 
  Cpu, 
  Rocket, 
  Users, 
  Mic
} from "lucide-react";

// Create user roles enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'seller']);

// Create category enum
export const categoryEnum = pgEnum('category', [
  'Digital Assets', 
  'AI Tools', 
  'Software', 
  'Templates', 
  'Graphics'
]);

// Create license types enum
export const licenseEnum = pgEnum('license_type', [
  'Standard', 
  'Commercial', 
  'Extended', 
  'Open Source'
]);

// Create purchase status enum
export const purchaseStatusEnum = pgEnum('purchase_status', [
  'pending',
  'completed',
  'failed',
  'refunded'
]);

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: userRoleEnum("role").default('user'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").default(0),
  currency: varchar("currency", { length: 3 }).default('USD'),
  category: categoryEnum("category").default('Digital Assets'),
  licenseType: licenseEnum("license_type").default('Standard'),
  tags: text("tags"),
  
  // Product media
  imageUrl: text("image_url"),
  coverImage: text("cover_image"),
  customIcon: text("custom_icon"),
  iconName: text("icon_name").default('cpu'),
  productImages: json("product_images").$type<string[]>(),
  
  // Download & purchase details
  downloadUrl: text("download_url"),
  fileType: text("file_type"),
  fileSize: text("file_size"),
  
  // Metrics
  rating: real("rating").default(0),
  reviews: integer("reviews").default(0),
  sales: integer("sales").default(0),
  views: integer("views").default(0),
  
  // Flag fields
  isFree: boolean("is_free").default(false),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(true),
  
  // Author relationship
  authorId: integer("author_id").references(() => users.id),
  
  // UI fields
  ctaText: text("cta_text").default('View Details'),
  link: text("link"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchases/Orders model
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  
  // Relations
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  
  // Purchase details
  amount: real("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default('USD'),
  stripePaymentId: text("stripe_payment_id"), // Reference to Stripe payment
  
  // Purchase status - use the type directly without default for now
  status: text("status").notNull().default('completed'),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlists model
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  
  // Relations
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Reviews model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  
  // Relations
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  
  // Review content
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  avatarUrl: true,
  bio: true,
  role: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  currency: true,
  category: true,
  licenseType: true,
  tags: true,
  
  // Media fields
  imageUrl: true,
  coverImage: true,
  customIcon: true,
  iconName: true,
  productImages: true,
  
  // Download details
  downloadUrl: true,
  fileType: true,
  fileSize: true,
  
  // Flags
  isFree: true,
  isFeatured: true,
  isPublished: true,
  
  // Relations
  authorId: true,
  
  // UI fields
  ctaText: true,
  link: true,
});

// Purchase schema
export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  userId: true,
  productId: true,
  amount: true,
  currency: true,
  stripePaymentId: true,
  status: true,
});

// Wishlist schema
export const insertWishlistSchema = createInsertSchema(wishlists).pick({
  userId: true,
  productId: true,
});

// Review schema
export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  rating: true,
  comment: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductDB = typeof products.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Author type for UI display
export interface Author {
  id: number;
  name: string;
  avatar: string;
}

// Extended Product type with UI-specific additions
export interface Product extends ProductDB {
  // Lucide icon component
  Icon: LucideIcon;
  
  // Optional UI-specific properties
  author?: Author;
}

// Map icon names to Lucide components
export const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    "box": Box,
    "code": Code,
    "cpu": Cpu,
    "rocket": Rocket,
    "users": Users,
    "mic": Mic,
  };
  
  return iconMap[iconName] || Cpu;
};
