-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'seller');
CREATE TYPE category AS ENUM ('Digital Assets', 'AI Tools', 'Software', 'Templates', 'Graphics');
CREATE TYPE license_type AS ENUM ('Standard', 'Commercial', 'Extended', 'Open Source');
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  category category DEFAULT 'Digital Assets',
  license_type license_type DEFAULT 'Standard',
  tags TEXT,
  
  -- Product media
  image_url TEXT,
  cover_image TEXT,
  custom_icon TEXT,
  icon_name TEXT DEFAULT 'cpu',
  product_images JSONB,
  
  -- Download & purchase details
  download_url TEXT,
  file_type TEXT,
  file_size TEXT,
  
  -- Metrics
  rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  
  -- Flag fields
  is_free BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  
  -- Author relationship
  author_id INTEGER REFERENCES users(id),
  
  -- UI fields
  cta_text TEXT DEFAULT 'View Details',
  link TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  amount REAL NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sample user for development
INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2b$10$5AKHxB.CQjM0qI8YJaJGVu4X0iCO59D5DSvStXHnkGvOgC8K.aU0O', 'admin@example.com', 'Admin User', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Create sample products
INSERT INTO products (name, description, link, cta_text, icon_name, is_free, author_id)
VALUES 
  ('AI Automation Tool', 'Automate business tasks', '#', 'Explore Tool', 'cpu', FALSE, 1),
  ('Website Templates', 'Modern portfolio sites', '#', 'Browse Templates', 'code', FALSE, 1),
  ('Illustration Kits', 'High-quality illustrations', '#', 'View Kits', 'users', FALSE, 1),
  ('Startup Kits', 'Resources to launch', '#', 'Get Started', 'rocket', TRUE, 1),
  ('Voice Assist Tools', 'AI-powered assistants', '#', 'Try Voice Tools', 'mic', FALSE, 1),
  ('Code Generator', 'AI-driven code creation', '#', 'Generate Code', 'code', FALSE, 1)
ON CONFLICT DO NOTHING;