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
  link: text("link").notNull(),
  ctaText: text("cta_text").notNull(),
  iconName: text("icon_name").notNull(),
  isFree: boolean("is_free").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  link: true,
  ctaText: true,
  iconName: true,
  isFree: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductDB = typeof products.$inferSelect;

// Extended Product type with Icon component
export interface Product extends ProductDB {
  Icon: LucideIcon;
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
