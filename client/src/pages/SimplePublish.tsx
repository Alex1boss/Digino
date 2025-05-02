import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "wouter";

export default function SimplePublish() {
  const [_, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "Test Product",
    description: "This is a test product description",
    price: "29.99",
    category: "Digital Assets",
    iconName: "Zap",
    tags: "test,demo",
    license: "standard"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Create product object for database
      const productData = {
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 29.99,
        category: formData.category || "Digital Assets",
        iconName: formData.iconName || "cpu",
        tags: formData.tags || "",
        licenseType: formData.license || "Standard", // Changed from license to licenseType
        imageUrl: "",
        authorId: 1
      };
      
      console.log("Sending product data:", productData);
      
      // Using XMLHttpRequest instead of fetch for more detailed error reporting
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/products', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Response received:", xhr.responseText);
          setSuccess(true);
        } else {
          console.error("Error response:", xhr.status, xhr.statusText, xhr.responseText);
          setError(`Server error: ${xhr.status} ${xhr.statusText}`);
        }
        setIsSubmitting(false);
      };
      
      xhr.onerror = function() {
        console.error("Network error occurred");
        setError("Network error - check your connection");
        setIsSubmitting(false);
      };
      
      xhr.send(JSON.stringify(productData));
    } catch (err) {
      console.error("Error in submit handler:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Publish Product</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>Product created successfully!</p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => setLocation('/explore')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Products
                </button>
                <button 
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      title: "Test Product",
                      description: "This is a test product description",
                      price: "29.99",
                      category: "Digital Assets",
                      iconName: "Zap",
                      tags: "test,demo",
                      license: "standard"
                    });
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Add Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product Data</label>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-xs break-all whitespace-pre-wrap">
                    {JSON.stringify({
                      name: formData.title,
                      description: formData.description,
                      price: parseFloat(formData.price) || 29.99,
                      category: formData.category,
                      iconName: formData.iconName,
                      tags: formData.tags,
                      licenseType: formData.license,
                      authorId: 1
                    }, null, 2)}
                  </pre>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSubmitting ? "Publishing..." : "Publish Product"}
              </button>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Connection Information:</p>
                <div className="bg-gray-100 p-2 rounded text-xs mt-1">
                  <p>API Endpoint: /api/products</p>
                  <p>Method: POST</p>
                  <p>Content-Type: application/json</p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}