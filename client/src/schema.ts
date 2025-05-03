import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price"),
  iconName: text("icon_name").notNull(),
  link: text("link").notNull(),
  ctaText: text("cta_text").notNull().default("Learn More"),
  isFree: boolean("is_free").notNull().default(false),
  category: text("category"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  iconName: true,
  link: true, 
  ctaText: true,
  isFree: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductDB = typeof products.$inferSelect;

export interface Product extends ProductDB {
  Icon: LucideIcon;
  coverImage?: string;
  imageUrl?: string;
  createdAt?: string;
  currency?: string;
  rating?: number;
  reviews?: number;
  sales?: number;
  customIcon?: string;
  productImages?: string[];
  tags?: string;
  author?: {
    id: number;
    name: string;
    avatar: string;
  };
}

// Function to get icon component based on name
export const getIconComponent = (iconName: string): LucideIcon => {
  switch (iconName) {
    case "box":
      return Box;
    case "code":
      return Code; 
    case "cpu":
      return Cpu;
    case "rocket":
      return Rocket;
    case "users":
      return Users;
    case "mic":
      return Mic;
    default:
      return Cpu;
  }
};