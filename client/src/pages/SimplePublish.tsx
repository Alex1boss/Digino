import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "wouter";
import { 
  Zap, 
  Code, 
  BarChart2, 
  Gift, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Package, 
  BookOpen 
} from "lucide-react";

export default function SimplePublish() {
  const [_, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "29.99",
    category: "Digital Assets",
    iconName: "Zap",
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description) {
      // Create styled validation error message
      const validationError = document.createElement('div');
      validationError.style.position = 'fixed';
      validationError.style.top = '50%';
      validationError.style.left = '50%';
      validationError.style.transform = 'translate(-50%, -50%)';
      validationError.style.backgroundColor = '#f59e0b';
      validationError.style.color = 'white';
      validationError.style.padding = '20px';
      validationError.style.borderRadius = '10px';
      validationError.style.zIndex = '9999';
      validationError.style.width = '90%';
      validationError.style.maxWidth = '400px';
      validationError.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      validationError.style.textAlign = 'center';
      
      validationError.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">Validation Error</h3>
        <p style="margin-bottom: 20px;">Please fill out the title and description fields.</p>
        <div>
          <button style="padding: 8px 16px; background: white; color: #f59e0b; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
        </div>
      `;
      
      document.body.appendChild(validationError);
      
      const okButton = validationError.querySelector('button');
      if (okButton) {
        okButton.addEventListener('click', () => {
          document.body.removeChild(validationError);
        });
      }
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        if (document.body.contains(validationError)) {
          document.body.removeChild(validationError);
        }
      }, 3000);
      
      return;
    }

    setIsPublishing(true);
    console.log("Publishing product...");

    try {
      // Create a simple product object with all required fields
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
        coverImage: "/assets/product-placeholder.jpg",
        author: {
          id: 1,
          name: "Current User",
          avatar: "/assets/avatar.jpg"
        },
        createdAt: new Date().toISOString(),
        iconName: formData.iconName,
      };

      console.log("Product object created:", newProduct);
      
      // Get existing products from localStorage
      let existingProducts = [];
      try {
        const savedProducts = localStorage.getItem('products');
        console.log("Existing products in localStorage:", savedProducts);
        
        if (savedProducts) {
          existingProducts = JSON.parse(savedProducts);
        }
      } catch (parseError) {
        console.error("Error parsing products from localStorage:", parseError);
        existingProducts = [];
      }
      
      // Add new product to array
      existingProducts.push(newProduct);
      
      // Save updated array back to localStorage
      console.log("Saving updated products to localStorage:", existingProducts);
      localStorage.setItem('products', JSON.stringify(existingProducts));
      
      // Success message - using a better approach than alert
      const successMessage = document.createElement('div');
      successMessage.style.position = 'fixed';
      successMessage.style.top = '50%';
      successMessage.style.left = '50%';
      successMessage.style.transform = 'translate(-50%, -50%)';
      successMessage.style.backgroundColor = '#4F46E5';
      successMessage.style.color = 'white';
      successMessage.style.padding = '20px';
      successMessage.style.borderRadius = '10px';
      successMessage.style.zIndex = '9999';
      successMessage.style.width = '90%';
      successMessage.style.maxWidth = '400px';
      successMessage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      successMessage.style.textAlign = 'center';
      
      successMessage.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">Success!</h3>
        <p style="margin-bottom: 20px;">Your product has been published successfully!</p>
        <div>
          <button style="padding: 8px 16px; background: white; color: #4F46E5; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
        </div>
      `;
      
      document.body.appendChild(successMessage);
      
      // Set up a timer to automatically navigate after showing success message
      const redirectTimer = setTimeout(() => {
        // Remove the message first
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
        
        // Then redirect to the explore page
        window.location.href = "/#/explore";
        window.location.reload(); 
      }, 2000);
      
      // Allow manual dismissal with OK button
      const okButton = successMessage.querySelector('button');
      if (okButton) {
        okButton.addEventListener('click', () => {
          // Clear the automatic redirect timer
          clearTimeout(redirectTimer);
          
          // Remove the message
          document.body.removeChild(successMessage);
          
          // Immediately redirect
          window.location.href = "/#/explore";
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error publishing product:", error);
      
      // Create styled error message
      const errorMessage = document.createElement('div');
      errorMessage.style.position = 'fixed';
      errorMessage.style.top = '50%';
      errorMessage.style.left = '50%';
      errorMessage.style.transform = 'translate(-50%, -50%)';
      errorMessage.style.backgroundColor = '#ef4444';
      errorMessage.style.color = 'white';
      errorMessage.style.padding = '20px';
      errorMessage.style.borderRadius = '10px';
      errorMessage.style.zIndex = '9999';
      errorMessage.style.width = '90%';
      errorMessage.style.maxWidth = '400px';
      errorMessage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      errorMessage.style.textAlign = 'center';
      
      errorMessage.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">Error</h3>
        <p style="margin-bottom: 20px;">Failed to publish product. Please try again.</p>
        <div>
          <button style="padding: 8px 16px; background: white; color: #ef4444; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
        </div>
      `;
      
      document.body.appendChild(errorMessage);
      
      const okButton = errorMessage.querySelector('button');
      if (okButton) {
        okButton.addEventListener('click', () => {
          document.body.removeChild(errorMessage);
        });
      }
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 5000);
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
            
            <div className="space-y-2">
              <label className="block text-white/80 font-medium pl-1">Product Icon</label>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { name: "Zap", icon: <Zap className="h-6 w-6" /> },
                  { name: "Code", icon: <Code className="h-6 w-6" /> },
                  { name: "BarChart2", icon: <BarChart2 className="h-6 w-6" /> },
                  { name: "Gift", icon: <Gift className="h-6 w-6" /> },
                  { name: "FileText", icon: <FileText className="h-6 w-6" /> },
                  { name: "Image", icon: <Image className="h-6 w-6" /> },
                  { name: "Music", icon: <Music className="h-6 w-6" /> },
                  { name: "Video", icon: <Video className="h-6 w-6" /> },
                  { name: "Package", icon: <Package className="h-6 w-6" /> },
                  { name: "BookOpen", icon: <BookOpen className="h-6 w-6" /> }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, iconName: item.name }))}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                      formData.iconName === item.name ? 
                      "bg-[#4F46E5] text-white" : 
                      "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
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