import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getIconComponent, insertProductSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from 'zod';
import bcrypt from 'bcrypt';
import { 
  handleProductImageUpload, 
  handleAvatarUpload, 
  configureFileUpload, 
  ensureUploadDirs,
  serveUploads
} from "./upload";
import path from "path";

// Check if bcrypt is available
let bcryptAvailable = true;
try {
  // Test bcrypt with a simple hash
  bcrypt.hashSync('test', 1);
} catch (e) {
  console.warn('bcrypt is not installed or not working properly, password hashing will not work');
  bcryptAvailable = false;
  // We'll handle this gracefully in the routes
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure file upload middleware
  app.use(configureFileUpload());
  
  // Ensure upload directories exist
  ensureUploadDirs();
  
  // Serve uploaded files
  app.use(serveUploads);
  
  // File upload routes
  app.post("/api/upload/product-image", handleProductImageUpload);
  app.post("/api/upload/avatar", handleAvatarUpload);
  
  // User routes
  
  // Register a new user
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password if bcrypt is available
      let hashedPassword;
      if (bcryptAvailable) {
        hashedPassword = await bcrypt.hash(userData.password, 10);
      } else {
        // Fallback for development only - don't store plaintext passwords in production!
        hashedPassword = `UNHASHED_${userData.password}`;
      }
      
      // Create the user with hashed password
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error registering user:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Login user
  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find the user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Compare passwords
      let passwordMatch = false;
      
      if (bcryptAvailable) {
        // Use bcrypt for secure password comparison
        passwordMatch = await bcrypt.compare(password, user.password);
      } else {
        // Fallback for development only - basic comparison for unhashed passwords
        passwordMatch = user.password === `UNHASHED_${password}`;
      }
      
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // In a production app, you would create a JWT token here
      res.json({
        user: userWithoutPassword,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Get user profile
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Update user profile
  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Get existing user
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Handle password updates separately
      let updateData = { ...req.body };
      if (updateData.password) {
        if (bcryptAvailable) {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
          // Fallback for development only - don't store plaintext passwords in production!
          updateData.password = `UNHASHED_${updateData.password}`;
        }
      }
      
      // Update the user
      const updatedUser = await storage.updateUser(id, updateData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser || {};
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // API routes for products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      
      // Transform the products to include the Icon component reference
      const transformedProducts = products.map(product => ({
        ...product,
        Icon: getIconComponent(product.iconName || "cpu")
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
        Icon: getIconComponent(product.iconName || "cpu")
      };
      
      res.json(transformedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create a new product
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      console.log("Received product data:", JSON.stringify(req.body, null, 2));
      
      // Validate the request body against the product schema
      const productData = insertProductSchema.parse(req.body);
      console.log("Validated product data:", JSON.stringify(productData, null, 2));
      
      // Create the product in the database
      const newProduct = await storage.createProduct(productData);
      console.log("Product created successfully:", JSON.stringify(newProduct, null, 2));
      
      // Return the created product with the Icon reference
      res.status(201).json({
        ...newProduct,
        Icon: getIconComponent(newProduct.iconName || "cpu")
      });
    } catch (error) {
      console.error("Error creating product:", error);
      
      // Handle validation errors
      if (error instanceof ZodError) {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: error.errors 
        });
      }
      
      // Provide more detailed error information
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`Error detail: ${errorMessage}`);
      
      res.status(500).json({ 
        message: "Failed to create product", 
        error: errorMessage 
      });
    }
  });

  // Update an existing product
  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // Get the existing product
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Update the product
      const updatedProduct = await storage.updateProduct(id, req.body);
      
      // Return the updated product with the Icon reference
      res.json({
        ...updatedProduct,
        Icon: getIconComponent(updatedProduct?.iconName || "cpu")
      });
    } catch (error) {
      console.error("Error updating product:", error);
      
      // Handle validation errors
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete a product
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // Get the existing product
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Delete the product
      const deleted = await storage.deleteProduct(id);
      
      if (deleted) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete product" });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Get products by author
  app.get("/api/users/:id/products", async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.id);
      if (isNaN(authorId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const products = await storage.getProductsByAuthor(authorId);
      
      // Transform the products to include the Icon component reference
      const transformedProducts = products.map(product => ({
        ...product,
        Icon: getIconComponent(product.iconName || "cpu")
      }));
      
      res.json(transformedProducts);
    } catch (error) {
      console.error("Error fetching author products:", error);
      res.status(500).json({ message: "Failed to fetch author products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}