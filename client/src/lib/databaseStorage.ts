import { queryClient } from './queryClient';
import type { Product } from '@shared/schema';

/**
 * Database Storage Utilities
 * 
 * These functions provide API access to the PostgreSQL database
 * instead of relying on localStorage which has limitations
 */

/**
 * Fetch all products from the database
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a single product by ID from the database
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching product #${id}:`, error);
    return null;
  }
}

/**
 * Create a new product in the database
 */
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create product: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const createdProduct = await response.json();
  
  // Invalidate the products cache to refresh any lists
  queryClient.invalidateQueries({ queryKey: ['/api/products'] });
  
  return createdProduct;
}

/**
 * Update an existing product in the database
 */
export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
  }
  
  const updatedProduct = await response.json();
  
  // Invalidate both the specific product and the products list
  queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
  queryClient.invalidateQueries({ queryKey: ['/api/products'] });
  
  return updatedProduct;
}

/**
 * Delete a product from the database
 */
export async function deleteProduct(id: number): Promise<boolean> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.status} ${response.statusText}`);
  }
  
  // Invalidate the products cache
  queryClient.invalidateQueries({ queryKey: ['/api/products'] });
  
  return true;
}

/**
 * Fetch products by author from the database
 */
export async function fetchProductsByAuthor(authorId: number): Promise<Product[]> {
  const response = await fetch(`/api/users/${authorId}/products`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch author products: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Save a product draft to the database
 * This creates a product with isPublished=false instead of using localStorage
 */
export async function saveProductDraft(draftData: Partial<Product>): Promise<Product> {
  // Make sure the draft is marked as unpublished
  const productDraft = {
    ...draftData,
    isPublished: false
  };
  
  // Use the existing createProduct function but mark it as a draft
  return await createProduct(productDraft);
}

/**
 * Fetch all draft products for a user
 */
export async function fetchUserDrafts(userId: number): Promise<Product[]> {
  // We can reuse the fetchProductsByAuthor function but filter for unpublished products
  const products = await fetchProductsByAuthor(userId);
  return products.filter(product => !product.isPublished);
}