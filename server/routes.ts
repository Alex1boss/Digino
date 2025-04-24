import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getIconComponent } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      
      // Transform the products to include the Icon component reference
      const transformedProducts = products.map(product => ({
        ...product,
        Icon: getIconComponent(product.iconName)
      }));
      
      res.json(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Transform the product to include the Icon component reference
      const transformedProduct = {
        ...product,
        Icon: getIconComponent(product.iconName)
      };
      
      res.json(transformedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
