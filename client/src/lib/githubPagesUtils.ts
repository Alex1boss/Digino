/**
 * Utility functions for GitHub Pages deployment
 */

/**
 * Detects if the application is running on GitHub Pages
 */
export const isGitHubPages = (): boolean => {
  return window.location.hostname.includes('github.io');
};

/**
 * Transforms API requests for GitHub Pages static hosting
 * - When running locally or on Replit: uses the regular API endpoints
 * - When running on GitHub Pages: uses the static JSON files
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  if (isGitHubPages()) {
    // For GitHub Pages, point to the static JSON files
    return `${cleanEndpoint}.json`;
  }
  
  // For local development, use the regular API
  return `/${cleanEndpoint}`;
};