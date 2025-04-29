import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "wouter";

export default function SimplePublish() {
  const [_, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "29.99",
    category: "Digital Assets",
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill out the title and description fields.");
      return;
    }

    setIsPublishing(true);

    try {
      // Create a simple product object
      const newProduct = {
        id: Date.now(),
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: "USD",
        category: formData.category,
        rating: 0,
        reviews: 0,
        sales: 0,
        coverImage: "/path/to/placeholder.jpg",
        author: {
          id: 1,
          name: "Current User",
          avatar: "/avatar.jpg"
        },
        createdAt: new Date().toISOString(),
        iconName: "Zap",
      };

      // Save to localStorage
      const productsString = localStorage.getItem('products') || '[]';
      const products = JSON.parse(productsString);
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));

      alert("Product published successfully!");
      
      // Navigate to explore page
      setTimeout(() => {
        setLocation("/explore");
      }, 1000);
    } catch (error) {
      console.error("Error publishing product:", error);
      alert("Failed to publish product. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="max-w-2xl mx-auto p-8 rounded-xl bg-white/5 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Publish Your Digital Product</h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-white/80 font-medium pl-1">Product Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                placeholder="Enter a catchy product title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-white/80 font-medium pl-1">Product Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-32 p-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 resize-none"
                placeholder="Describe your product in detail"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Price (USD)</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                >
                  <option value="Digital Assets">Digital Assets</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Software">Software</option>
                  <option value="Templates">Templates</option>
                  <option value="Graphics">Graphics</option>
                </select>
              </div>
            </div>
            
            <div className="pt-6">
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full py-4 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Publish Product'}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-white/60 text-sm">Fields marked with * are required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}