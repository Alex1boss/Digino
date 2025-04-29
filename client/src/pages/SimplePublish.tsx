import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "wouter";
import { 
  Zap, 
  Code, 
  BarChart2, 
  Gift, 
  FileText, 
  ImageIcon, 
  Music, 
  Video, 
  Package, 
  BookOpen,
  Tag,
  Save,
  Eye,
  DollarSign,
  Upload,
  Check,
  Clock,
  ShieldCheck
} from "lucide-react";

export default function SimplePublish() {
  const [_, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "29.99",
    category: "Digital Assets",
    iconName: "Zap",
    tags: "",
    fileType: "pdf",
    license: "standard",
    previewImage: "",
  });
  
  // For tracking form progress
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // For draft functionality
  const [isDraft, setIsDraft] = useState(false);
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
        tags: formData.tags,
        license: formData.license,
        fileType: formData.fileType
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
      successMessage.style.backgroundColor = '#14B8A6';
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
          <button style="padding: 8px 16px; background: white; color: #14B8A6; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
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

  // Function to handle saving a draft
  const handleSaveDraft = () => {
    setIsDraft(true);
    
    try {
      // Create a draft object
      const draft = {
        ...formData,
        isDraft: true,
        lastSaved: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('productDraft', JSON.stringify(draft));
      
      // Show success message
      const draftMessage = document.createElement('div');
      draftMessage.style.position = 'fixed';
      draftMessage.style.top = '50%';
      draftMessage.style.left = '50%';
      draftMessage.style.transform = 'translate(-50%, -50%)';
      draftMessage.style.backgroundColor = '#14B8A6'; // Teal color
      draftMessage.style.color = 'white';
      draftMessage.style.padding = '20px';
      draftMessage.style.borderRadius = '10px';
      draftMessage.style.zIndex = '9999';
      draftMessage.style.width = '90%';
      draftMessage.style.maxWidth = '400px';
      draftMessage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      draftMessage.style.textAlign = 'center';
      
      draftMessage.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">Draft Saved</h3>
        <p style="margin-bottom: 20px;">Your product draft has been saved. You can continue editing later.</p>
        <div>
          <button style="padding: 8px 16px; background: white; color: #14B8A6; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
        </div>
      `;
      
      document.body.appendChild(draftMessage);
      
      const okButton = draftMessage.querySelector('button');
      if (okButton) {
        okButton.addEventListener('click', () => {
          document.body.removeChild(draftMessage);
        });
      }
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        if (document.body.contains(draftMessage)) {
          document.body.removeChild(draftMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsDraft(false);
    }
  };
  
  // Function to navigate between steps
  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'prev' && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('productDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draft }));
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-[#1E3A8A]"> {/* Deep Blue background */}
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Publish Your Digital Product</h1>
            <p className="text-white/70 text-center mb-8">Fill out the form below to list your digital product in our marketplace</p>
            
            {/* Progress indicator */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center space-x-2 w-full max-w-md">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div 
                      className={`rounded-full w-8 h-8 flex items-center justify-center transition-all ${
                        index + 1 === currentStep 
                          ? 'bg-[#F59E0B] text-white' 
                          : index + 1 < currentStep 
                            ? 'bg-[#14B8A6] text-white' 
                            : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    {index < totalSteps - 1 && (
                      <div 
                        className={`flex-1 h-1 rounded transition-all ${
                          index + 1 < currentStep ? 'bg-[#14B8A6]' : 'bg-white/10'
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Two column layout - Form on left, Preview on right */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form Column */}
              <div className="w-full lg:w-3/5 space-y-6 p-6 bg-white/5 rounded-xl border border-white/10">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="space-y-2">
                      <label className="block text-white/80 font-medium pl-1">Product Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#14B8A6] focus:bg-white/10"
                        placeholder="Enter a catchy product title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-white/80 font-medium pl-1">Product Description*</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full h-32 p-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#14B8A6] focus:bg-white/10 resize-none"
                        placeholder="Describe your product in detail"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-white/80 font-medium pl-1">
                          <span className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Price (USD)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#14B8A6] focus:bg-white/10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-white/80 font-medium pl-1">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#14B8A6] focus:bg-white/10"
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
                      <label className="block text-white/80 font-medium pl-1">
                        <span className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Tags (comma separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#14B8A6] focus:bg-white/10"
                        placeholder="marketing, automation, ai"
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Visual and Icon */}
                {currentStep === 2 && (
                  <div>
                    <div className="space-y-2">
                      <label className="block text-white/80 font-medium pl-1">Product Icon</label>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { name: "Zap", icon: <Zap className="h-6 w-6" /> },
                          { name: "Code", icon: <Code className="h-6 w-6" /> },
                          { name: "BarChart2", icon: <BarChart2 className="h-6 w-6" /> },
                          { name: "Gift", icon: <Gift className="h-6 w-6" /> },
                          { name: "FileText", icon: <FileText className="h-6 w-6" /> },
                          { name: "Image", icon: <ImageIcon className="h-6 w-6" /> },
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
                              "bg-[#F59E0B] text-white" : 
                              "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {item.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-8">
                      <label className="block text-white/80 font-medium pl-1">File Type</label>
                      <select
                        name="fileType"
                        value={formData.fileType}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#14B8A6] focus:bg-white/10"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="zip">ZIP Archive</option>
                        <option value="video">Video File</option>
                        <option value="audio">Audio File</option>
                        <option value="image">Image Collection</option>
                        <option value="software">Software/Application</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 mt-6">
                      <label className="block text-white/80 font-medium pl-1">
                        <span className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Preview Image (Coming Soon)
                        </span>
                      </label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center bg-white/5 cursor-not-allowed">
                        <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
                        <p className="text-white/50 text-center">Drag & drop your preview image here, or click to browse</p>
                        <p className="text-white/30 text-sm mt-2">(This feature is coming soon)</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: License & Finalize */}
                {currentStep === 3 && (
                  <div>
                    <div className="space-y-2">
                      <label className="block text-white/80 font-medium pl-1">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          License Type
                        </span>
                      </label>
                      <div className="space-y-3">
                        {[
                          { id: "standard", label: "Standard License", desc: "For personal or single commercial use" },
                          { id: "extended", label: "Extended License", desc: "For multiple commercial projects and applications" },
                          { id: "enterprise", label: "Enterprise License", desc: "For unlimited use within an organization" }
                        ].map(option => (
                          <label key={option.id} className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                            formData.license === option.id 
                              ? "border-[#14B8A6] bg-[#14B8A6]/10" 
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}>
                            <div className="flex items-start">
                              <input
                                type="radio"
                                name="license"
                                value={option.id}
                                checked={formData.license === option.id}
                                onChange={handleChange}
                                className="mt-1 text-[#14B8A6]"
                              />
                              <div className="ml-3">
                                <p className="text-white font-medium">{option.label}</p>
                                <p className="text-white/70 text-sm">{option.desc}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-lg">
                      <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-[#14B8A6]" />
                        Trust Elements (Automatic)
                      </h3>
                      <div className="text-white/70 text-sm space-y-2">
                        <p className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-[#14B8A6]" />
                          Secure Transactions
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-[#14B8A6]" />
                          Buyer Protection
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-[#14B8A6]" />
                          Content Verification
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 ? (
                    <button
                      onClick={() => handleStepChange('prev')}
                      className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      onClick={() => handleStepChange('next')}
                      className="px-6 py-3 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/80 transition-all flex items-center gap-2"
                    >
                      Next
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveDraft}
                        disabled={isDraft}
                        className="px-6 py-3 border border-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/20 transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isDraft ? 'Saving...' : 'Save Draft'}
                      </button>
                      
                      <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg hover:bg-[#F59E0B]/80 transition-all flex items-center gap-2 shadow-lg"
                      >
                        {isPublishing ? 'Publishing...' : 'Publish Product'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preview Column */}
              <div className="w-full lg:w-2/5 p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="sticky top-8">
                  <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4" />
                    Product Preview
                  </h3>
                  
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                        {formData.iconName === "Zap" && <Zap className="w-6 h-6" />}
                        {formData.iconName === "Code" && <Code className="w-6 h-6" />}
                        {formData.iconName === "BarChart2" && <BarChart2 className="w-6 h-6" />}
                        {formData.iconName === "Gift" && <Gift className="w-6 h-6" />}
                        {formData.iconName === "FileText" && <FileText className="w-6 h-6" />}
                        {formData.iconName === "Image" && <ImageIcon className="w-6 h-6" />}
                        {formData.iconName === "Music" && <Music className="w-6 h-6" />}
                        {formData.iconName === "Video" && <Video className="w-6 h-6" />}
                        {formData.iconName === "Package" && <Package className="w-6 h-6" />}
                        {formData.iconName === "BookOpen" && <BookOpen className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg leading-tight">
                          {formData.title || "Product Title"}
                        </h4>
                        <div className="flex items-center text-white/60 text-sm">
                          <span>{formData.category}</span>
                          <span className="mx-2">•</span>
                          <span>${formData.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4 pb-4 border-b border-white/10">
                      <p className="text-white/80 text-sm">
                        {formData.description || "Enter a product description to see the preview"}
                      </p>
                    </div>
                    
                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.split(',').map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-white/10 text-white/70 rounded-md text-xs"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Just now</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{formData.license} License</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">Publishing Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          formData.title ? 'bg-[#14B8A6] text-white' : 'bg-white/20'
                        }`}>
                          {formData.title && <Check className="w-3 h-3" />}
                        </div>
                        <span>Product Title</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          formData.description ? 'bg-[#14B8A6] text-white' : 'bg-white/20'
                        }`}>
                          {formData.description && <Check className="w-3 h-3" />}
                        </div>
                        <span>Product Description</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          formData.price ? 'bg-[#14B8A6] text-white' : 'bg-white/20'
                        }`}>
                          {formData.price && <Check className="w-3 h-3" />}
                        </div>
                        <span>Price Set</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          formData.category ? 'bg-[#14B8A6] text-white' : 'bg-white/20'
                        }`}>
                          {formData.category && <Check className="w-3 h-3" />}
                        </div>
                        <span>Category Selected</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          formData.tags ? 'bg-[#14B8A6] text-white' : 'bg-white/20'
                        }`}>
                          {formData.tags && <Check className="w-3 h-3" />}
                        </div>
                        <span>Tags Added</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}