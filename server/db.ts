import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@shared/schema';
import ws from 'ws';

// Configure Neon to use WebSockets for connection pooling
neonConfig.webSocketConstructor = ws;

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Make sure your database is properly set up.');
}

// Create a database connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Log when database connection is established
console.log('Database connection established');