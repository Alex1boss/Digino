import { 
  users, 
  type User, 
  type InsertUser, 
  products, 
  type ProductDB, 
  type InsertProduct 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<ProductDB[]>;
  getProduct(id: number): Promise<ProductDB | undefined>;
  createProduct(product: InsertProduct): Promise<ProductDB>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, ProductDB>;
  private userCurrentId: number;
  private productCurrentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.userCurrentId = 1;
    this.productCurrentId = 1;
    
    // Initialize with default products
    this.initializeProducts();
  }

  private initializeProducts() {
    const defaultProducts: InsertProduct[] = [
      {
        name: "AI Automation Tool",
        description: "Automate business tasks",
        link: "#",
        ctaText: "Explore Tool",
        iconName: "cpu",
        isFree: false
      },
      {
        name: "Website Templates",
        description: "Modern portfolio sites",
        link: "#",
        ctaText: "Browse Templates",
        iconName: "code",
        isFree: false
      },
      {
        name: "Illustration Kits",
        description: "High-quality illustrations",
        link: "#",
        ctaText: "View Kits",
        iconName: "users",
        isFree: false
      },
      {
        name: "Startup Kits",
        description: "Resources to launch",
        link: "#",
        ctaText: "Get Started",
        iconName: "rocket",
        isFree: true
      },
      {
        name: "Voice Assist Tools",
        description: "AI-powered assistants",
        link: "#",
        ctaText: "Try Voice Tools",
        iconName: "mic",
        isFree: false
      },
      {
        name: "Code Generator",
        description: "AI-driven code creation",
        link: "#",
        ctaText: "Generate Code",
        iconName: "code",
        isFree: false
      }
    ];
    
    defaultProducts.forEach(product => this.createProduct(product));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllProducts(): Promise<ProductDB[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<ProductDB | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<ProductDB> {
    const id = this.productCurrentId++;
    const product: ProductDB = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
}

export const storage = new MemStorage();
