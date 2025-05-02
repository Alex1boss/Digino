import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "wouter";

export default function DirectPublish() {
  const [_, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  
  // Direct API call function (no localStorage involved)
  const createProduct = async () => {
    setIsSubmitting(true);
    setError("");
    setResponse("");
    
    try {
      // Hardcoded test product
      const testProduct = {
        name: "Direct API Test Product",
        description: "A test product created via direct API call",
        price: 29.99,
        category: "Digital Assets",
        iconName: "Zap",
        tags: "test,api,direct",
        licenseType: "Standard",
        imageUrl: "",
        authorId: 1
      };
      
      console.log("Attempting direct API call with:", testProduct);
      
      // Use the browser's built-in API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testProduct),
        // Don't use any caching
        cache: 'no-store'
      });
      
      // Get response as text first to log it
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      setResponse(responseText);
      
      if (response.ok) {
        setSuccess(true);
        console.log("Product created successfully");
      } else {
        setError(`Server error: ${response.status} - ${response.statusText}`);
        console.error("Server error:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Exception during API call:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-4">
            <h1 className="text-xl font-bold text-white">Direct API Publishing</h1>
            <p className="text-blue-100 text-sm">Create product via direct API call</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {success ? (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                <p className="font-medium">Success!</p>
                <p className="text-sm">Product was created successfully via the API</p>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setLocation('/explore')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    View All Products
                  </button>
                  <button 
                    onClick={() => {
                      setSuccess(false);
                      setResponse("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={createProduct}
                disabled={isSubmitting}
                className="w-full mb-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                          disabled:bg-blue-300 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Creating Product..." : "Create Test Product"}
              </button>
            )}
            
            {response && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">API Response:</p>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg border overflow-auto max-h-48">
                  {response}
                </pre>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This page completely bypasses localStorage and directly calls the API.
                It creates a sample product with hardcoded data to test the API connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}