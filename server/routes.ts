import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getIconComponent, insertProductSchema } from "@shared/schema";
import { ZodError } from 'zod';
import { 
  handleProductImageUpload, 
  handleAvatarUpload, 
  configureFileUpload, 
  ensureUploadDirs,
  serveUploads
} from "./upload";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  addAdminAuthToPayPalRequest,
  verifyPayPalAccess
} from "./adminAuth";
import path from "path";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure file upload middleware
  app.use(configureFileUpload());
  
  // Ensure upload directories exist
  ensureUploadDirs();
  
  // Serve uploaded files
  app.use(serveUploads);
  
  // Set up authentication system
  setupAuth(app);
  
  // File upload routes - require authentication
  app.post("/api/upload/product-image", isAuthenticated, handleProductImageUpload);
  app.post("/api/upload/avatar", isAuthenticated, handleAvatarUpload);
  
  // User routes - these are now managed by the auth system setup
  
  // Get user profile for authenticated users or by ID
  app.get("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if the user is trying to access their own profile
      if (req.user && req.user.id !== id) {
        // For non-admin users, prevent accessing other profiles
        if (req.user.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
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
  
  // Update user profile - require authentication
  app.patch("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if the user is trying to update their own profile
      if (req.user && req.user.id !== id) {
        // For non-admin users, prevent updating other profiles
        if (req.user.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      // Get existing user
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Handle password updates using our hashPassword function
      let updateData = { ...req.body };
      if (updateData.password) {
        const { hashPassword } = await import('./auth');
        updateData.password = await hashPassword(updateData.password);
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

  // Create a new product - require authentication
  app.post("/api/products", isAuthenticated, async (req: Request, res: Response) => {
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

  // Update an existing product - require authentication
  app.patch("/api/products/:id", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Get products for the currently authenticated user
  app.get("/api/user/products", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const products = await storage.getProductsByAuthor(userId);
      
      // Transform the products to include the Icon component reference
      const transformedProducts = products.map(product => ({
        ...product,
        Icon: getIconComponent(product.iconName || "cpu")
      }));
      
      res.json(transformedProducts);
    } catch (error) {
      console.error("Error fetching current user products:", error);
      res.status(500).json({ message: "Failed to fetch your products" });
    }
  });

  // PayPal authorization route
  app.post("/api/paypal-auth", isAuthenticated, verifyPayPalAccess);

  // PayPal integration routes with enhanced security
  app.use("/paypal", isAuthenticated, addAdminAuthToPayPalRequest);

  // PayPal setup endpoint - required for the PayPal SDK to initialize
  app.get("/paypal/setup", async (req, res) => {
    try {
      console.log("PayPal setup endpoint called");
      await loadPaypalDefault(req, res);
    } catch (error) {
      console.error("Error loading PayPal setup:", error);
      res.status(500).json({ 
        message: "Failed to initialize PayPal",
        error: "Payment service temporarily unavailable"
      });
    }
  });

  // Create PayPal order endpoint
  app.post("/paypal/order", async (req, res) => {
    try {
      console.log("PayPal order endpoint called with body:", req.body);
      
      // Validate required fields
      const { intent, amount, currency } = req.body;
      if (!intent || !amount || !currency) {
        return res.status(400).json({ 
          message: "Missing required payment information",
          error: "Please provide intent, amount, and currency" 
        });
      }
      
      // Create PayPal order
      await createPaypalOrder(req, res);
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      res.status(500).json({ 
        message: "Failed to create payment order",
        error: "Payment service temporarily unavailable"
      });
    }
  });

  // Capture PayPal order endpoint
  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    try {
      console.log("PayPal capture endpoint called for orderID:", req.params.orderID);
      
      // Validate order ID
      const { orderID } = req.params;
      if (!orderID) {
        return res.status(400).json({ 
          message: "Missing order ID",
          error: "Order ID is required" 
        });
      }
      
      // Capture the payment
      await capturePaypalOrder(req, res);
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      res.status(500).json({ 
        message: "Failed to complete payment",
        error: "Payment service temporarily unavailable"
      });
    }
  });
  
  // We'll also add these routes without the /paypal prefix to match the client component
  app.get("/setup", (req, res) => {
    console.log("Redirecting /setup to /paypal/setup");
    req.url = "/paypal/setup";
    app._router.handle(req, res);
  });
  
  app.post("/order", (req, res) => {
    console.log("Redirecting /order to /paypal/order");
    req.url = "/paypal/order";
    app._router.handle(req, res);
  });
  
  app.post("/order/:orderID/capture", (req, res) => {
    console.log("Redirecting /order/:orderID/capture to /paypal/order/:orderID/capture");
    req.url = `/paypal/order/${req.params.orderID}/capture`;
    app._router.handle(req, res);
  });

  const httpServer = createServer(app);
  return httpServer;
}