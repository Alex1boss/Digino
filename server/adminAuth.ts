import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import session from 'express-session';

// Add custom properties to the session
declare module 'express-session' {
  interface SessionData {
    isPayPalAuthorized?: boolean;
  }
}

// Admin password should be stored as an environment variable
// In a production environment, you'd use a proper authentication system
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// This is just a simple example - in production you'd use a more secure method
let hashedAdminPassword: string | null = null;

// Initialize the hashed password
(async () => {
  if (!hashedAdminPassword) {
    hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log('Admin authentication initialized');
  }
})();

// Middleware to check if user has admin rights
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // First check if user is authenticated at all
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Check if user has admin role in their profile
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  // If not admin, deny access
  return res.status(403).json({ message: "Access denied: Admin rights required" });
};

// Function to check admin password 
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  if (!hashedAdminPassword) {
    hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  }
  return bcrypt.compare(password, hashedAdminPassword);
};

// Middleware to require admin password for certain operations
export const requireAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminPassword } = req.body;
    
    // If no password provided
    if (!adminPassword) {
      return res.status(401).json({ 
        message: "Admin password required",
        requiresAdminAuth: true
      });
    }
    
    // Check the password
    const isValid = await verifyAdminPassword(adminPassword);
    if (!isValid) {
      return res.status(403).json({ 
        message: "Invalid admin password",
        requiresAdminAuth: true
      });
    }
    
    // If password is valid, proceed
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

// Add Admin Password to Request
export const addAdminAuthToPayPalRequest = async (req: Request, res: Response, next: NextFunction) => {
  // Special handling for PayPal requests
  if (req.originalUrl.startsWith('/paypal/')) {
    if (!req.session.isPayPalAuthorized) {
      return res.status(403).json({ 
        message: "PayPal access requires authorization",
        requiresPayPalAuth: true
      });
    }
  }
  
  next();
};

// Verify PayPal Admin Access
export const verifyPayPalAccess = async (req: Request, res: Response) => {
  try {
    const { adminPassword } = req.body;
    
    if (!adminPassword) {
      return res.status(400).json({ 
        message: "Admin password required",
        requiresPayPalAuth: true
      });
    }
    
    const isValid = await verifyAdminPassword(adminPassword);
    if (!isValid) {
      return res.status(403).json({ 
        message: "Invalid admin password",
        requiresPayPalAuth: true
      });
    }
    
    // Set session flag for PayPal access
    if (req.session) {
      req.session.isPayPalAuthorized = true;
    }
    
    res.status(200).json({ 
      message: "PayPal access authorized", 
      authorized: true 
    });
    
  } catch (error) {
    console.error("PayPal authorization error:", error);
    res.status(500).json({ message: "Authorization error" });
  }
};