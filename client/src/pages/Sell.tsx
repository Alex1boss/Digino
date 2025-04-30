import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { 
  Tag, ChevronRight, ArrowRight, Upload, Wand, 
  DollarSign, Timer, Gift, FileCheck, Zap, Search,
  CheckCircle, TrendingUp, Award, Rocket, Save, Eye,
  ShieldCheck, Calendar, AlertCircle, Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import ProductForm3D from "../components/ProductForm3D";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";

// Enum to track the steps of the selling process
enum SellingStep {
  Intro,
  BasicInfo,
  Categorization,
  Pricing,
  Licensing,
  SEO,
  Publish
}

export default function Sell() {
  const [currentStep, setCurrentStep] = useState<SellingStep>(SellingStep.Intro);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    discountEndsAt: "",
    bonusContent: false,
    licenses: {
      personal: true,
      commercial: false,
      extended: false
    },
    seoTitle: "",
    keywords: "",
    metaDescription: "",
    files: [] as File[],
    previewUrl: "",
    productLink: "",
    productImage: "" // Added for product image
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [productImage, setProductImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const productImageRef = React.useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(files)]
      }));
    }
  };
  
  // Handle file drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };
  
  // Handle file drag over
  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle browse files button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle product image upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageDataUrl = e.target.result as string;
          setProductImage(imageDataUrl);
          setFormData(prev => ({
            ...prev,
            productImage: imageDataUrl
          }));
        }
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle product image drop
  const handleProductImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file (JPEG, PNG, etc.)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageDataUrl = e.target.result as string;
          setProductImage(imageDataUrl);
          setFormData(prev => ({
            ...prev,
            productImage: imageDataUrl
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle product image drag over
  const handleProductImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle product image button click
  const handleProductImageClick = () => {
    productImageRef.current?.click();
  };
  
  // Simulate file upload with progress
  const simulateFileUpload = () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  // SIMPLIFIED direct publish button handler
  const handlePublish = () => {
    // Show we're publishing
    alert("Publishing your product...");
    
    // Direct navigation after publishing - no delays or complex logic
    try {
      // Create a very simple product object - minimal fields
      const newProduct = {
        id: Date.now(),
        name: formData.title || "Untitled Product",
        description: formData.description || "No description",
        price: parseFloat(formData.price) || 29.99,
        currency: "USD",
        category: formData.category || "Digital Assets",
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
      
      // Save directly to localStorage with minimal error handling
      const productsString = localStorage.getItem('products') || '[]';
      const products = JSON.parse(productsString);
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      
      // Force raw navigation to explore page using hash-router compatible approach
      window.location.hash = "/explore";
      window.location.reload();
      
    } catch (error) {
      // If anything fails, show error and allow retry
      alert("Error saving product. Please try again.");
      console.error("Publish error:", error);
    }
  };
  
  // Handle save draft
  const handleSaveDraft = () => {
    
    setIsSaving(true);
    
    // Save the current form data to localStorage as a draft
    const draft = {
      id: `draft-${Date.now()}`,
      date: new Date().toISOString(),
      data: formData
    };
    
    // Get existing drafts and add this one
    const existingDrafts = JSON.parse(localStorage.getItem('productDrafts') || '[]');
    localStorage.setItem('productDrafts', JSON.stringify([...existingDrafts, draft]));
    
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      
      // Use custom toast instead of alert
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.backgroundColor = '#3b82f6';
      toast.style.color = 'white';
      toast.style.padding = '10px 16px';
      toast.style.borderRadius = '4px';
      toast.style.zIndex = '9999';
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Draft saved successfully!';
      
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '1'; }, 10);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }, 1500);
  };
  
  // Handle preview function has been removed and replaced with inline implementation
  
  const handleBackToIntro = () => {
    setCurrentStep(SellingStep.Intro);
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePreviousStep = () => {
    if (currentStep > SellingStep.BasicInfo) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep(SellingStep.Intro);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLicenseChange = (license: 'personal' | 'commercial' | 'extended') => {
    setFormData(prev => ({
      ...prev,
      licenses: {
        ...prev.licenses,
        [license]: !prev.licenses[license]
      }
    }));
  };
  
  const handleBonusContentToggle = () => {
    setFormData(prev => ({
      ...prev,
      bonusContent: !prev.bonusContent
    }));
  };
  
  const startSelling = () => {
    setCurrentStep(SellingStep.BasicInfo);
  };
  
  const renderIntro = () => (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-12 text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
        >
          Start Selling Your Digital Masterpiece
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-white/60 max-w-2xl mx-auto mb-8 text-sm"
        >
          Earn, Inspire, and Lead the Future of Digital Innovation.
        </motion.p>
        
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            onClick={startSelling}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(79, 70, 229, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="premium-button px-10 py-4 flex items-center justify-center mx-auto text-lg"
          >
            <span>Start Selling Now</span>
            <Rocket className="ml-2 w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
      
      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="premium-card p-6"
        >
          <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5] mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">Global Reach</h3>
          <p className="text-[#6B7280] text-sm">
            Access our marketplace with thousands of tech-focused buyers looking for innovative digital products.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="premium-card p-6"
        >
          <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5] mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">Smart Promotion</h3>
          <p className="text-[#6B7280] text-sm">
            Our AI-powered system automatically promotes quality products to the right audience.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="premium-card p-6"
        >
          <div className="w-12 h-12 bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5] mb-4">
            <DollarSign size={24} />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">Instant Payouts</h3>
          <p className="text-[#6B7280] text-sm">
            Receive payment immediately after each sale with our secure payment processing system.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
  
  const renderStepContent = () => {
    switch (currentStep) {
      case SellingStep.Intro:
        return renderIntro();
        
      case SellingStep.BasicInfo:
        return (
          <motion.div
            key="basicInfo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
          >
            <div className="flex items-center mb-6">
              <motion.button
                onClick={handleBackToIntro}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
              >
                <ArrowRight size={20} className="transform rotate-180" />
              </motion.button>
              
              <h2 className="text-2xl font-semibold text-white">
                Product Upload
              </h2>
              
              <div className="ml-auto flex items-center text-sm text-white/60">
                <span className="font-medium text-[#4F46E5]">Step 1</span>
                <span className="mx-2">/</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                  placeholder="Enter a catchy product title"
                  style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 resize-none"
                  placeholder="Describe your product in detail. What makes it special? What problems does it solve?"
                  style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                />
              </div>
              
              {/* Product Image Upload */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Image</label>
                <div 
                  className={`border-2 border-dashed border-white/20 rounded-lg ${productImage ? 'p-4' : 'p-8'} bg-white/5 relative text-center`}
                  onDrop={handleProductImageDrop}
                  onDragOver={handleProductImageDragOver}
                >
                  {productImage ? (
                    <div className="relative">
                      <img 
                        src={productImage} 
                        alt="Product preview" 
                        className="max-h-[200px] mx-auto rounded-md object-contain"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                        onClick={() => {
                          setProductImage(null);
                          setFormData(prev => ({
                            ...prev,
                            productImage: ""
                          }));
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        <span aria-hidden="true">×</span>
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-white/30 mb-4 w-10 h-10" />
                      <p className="text-white/70 text-center mb-4">
                        Drag and drop or click to upload your main product image
                      </p>
                      <p className="text-white/50 text-xs text-center">
                        Recommended: 1200 x 800px, PNG or JPG
                      </p>
                    </>
                  )}
                  
                  <input 
                    type="file" 
                    id="product-image-upload" 
                    ref={productImageRef}
                    className={productImage ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                    accept="image/*"
                    onChange={handleProductImageUpload}
                  />
                  
                  {!productImage && (
                    <motion.button
                      type="button"
                      onClick={handleProductImageClick}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Upload size={16} className="mr-2 inline-block" />
                      Choose Image
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* Product Files Upload */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Files</label>
                <div 
                  className="p-6 border border-dashed border-white/20 rounded-xl text-center"
                  onDrop={handleFileDrop}
                  onDragOver={handleFileDragOver}
                >
                  <Upload className="mx-auto text-white/40 mb-3 w-10 h-10" />
                  <p className="text-white/60 mb-4">Drag and drop your product file or click to browse</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept=".pdf,.zip,.ai,.epub,.mp4"
                  />
                  <motion.button
                    onClick={handleBrowseClick}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white/80"
                  >
                    Browse Files
                  </motion.button>
                  <p className="text-white/40 text-xs mt-3">Supported formats: PDF, ZIP, AI, EPUB, MP4 (max 1GB)</p>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 text-sm">{selectedFiles.length} file(s) selected</span>
                        <button 
                          onClick={() => setSelectedFiles([])}
                          className="text-[#4F46E5] text-xs hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 text-left">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center text-sm text-white/70 mb-1 last:mb-0">
                            <span className="truncate flex-1">{file.name}</span>
                            <span className="text-xs text-white/50 ml-2">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {isUploading && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#4F46E5] rounded-full transition-all duration-300 ease-in-out"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    
                    {!isUploading && selectedFiles.length > 0 && (
                      <button
                        onClick={simulateFileUpload}
                        className="mt-3 px-3 py-1.5 bg-[#4F46E5]/80 hover:bg-[#4F46E5] rounded-lg text-white text-sm"
                      >
                        Upload Files
                      </button>
                    )}
                  </div>
                )}
              </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <motion.button
                  onClick={handleBackToIntro}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/80"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Continue</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
        
      case SellingStep.Categorization:
        return (
          <motion.div
            key="categorization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
          >
            <div className="flex items-center mb-6">
              <motion.button
                onClick={handlePreviousStep}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
              >
                <ArrowRight size={20} className="transform rotate-180" />
              </motion.button>
              
              <h2 className="text-2xl font-semibold text-white">
                Smart Categorization
              </h2>
              
              <div className="ml-auto flex items-center text-sm text-white/60">
                <span className="font-medium text-[#4F46E5]">Step 2</span>
                <span className="mx-2">/</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-[#4F46E5]/10 rounded-lg flex items-center">
              <Wand className="text-[#4F46E5] mr-3 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">
                  <span className="font-medium">AI-Suggested Category: </span>
                  <span className="text-[#4F46E5]">AI Tools</span>
                </p>
                <p className="text-white/60 text-xs">Our AI analyzed your product description and suggested this category.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Select Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 appearance-none"
                  style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                >
                  <option value="" className="bg-[#0A0A23] text-white">Select a category</option>
                  <option value="ai_tools" className="bg-[#0A0A23] text-white">AI Tools</option>
                  <option value="templates" className="bg-[#0A0A23] text-white">Templates</option>
                  <option value="ebooks" className="bg-[#0A0A23] text-white">E-Books</option>
                  <option value="courses" className="bg-[#0A0A23] text-white">Courses</option>
                  <option value="code" className="bg-[#0A0A23] text-white">Code</option>
                  <option value="design_assets" className="bg-[#0A0A23] text-white">Design Assets</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <p className="text-white/80 font-medium pl-1">Most Popular Categories</p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 bg-white/5 rounded-full text-white/70 text-sm cursor-pointer hover:bg-[#4F46E5]/20 hover:text-white transition-all">AI Tools</div>
                  <div className="px-3 py-1.5 bg-white/5 rounded-full text-white/70 text-sm cursor-pointer hover:bg-[#4F46E5]/20 hover:text-white transition-all">Templates</div>
                  <div className="px-3 py-1.5 bg-white/5 rounded-full text-white/70 text-sm cursor-pointer hover:bg-[#4F46E5]/20 hover:text-white transition-all">E-Books</div>
                  <div className="px-3 py-1.5 bg-white/5 rounded-full text-white/70 text-sm cursor-pointer hover:bg-[#4F46E5]/20 hover:text-white transition-all">Courses</div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <motion.button
                  onClick={handlePreviousStep}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/80"
                >
                  Back
                </motion.button>
                
                <motion.button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Continue</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
        
      case SellingStep.Pricing:
        return (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
          >
            <div className="flex items-center mb-6">
              <motion.button
                onClick={handlePreviousStep}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
              >
                <ArrowRight size={20} className="transform rotate-180" />
              </motion.button>
              
              <h2 className="text-2xl font-semibold text-white">
                Pricing Settings
              </h2>
              
              <div className="ml-auto flex items-center text-sm text-white/60">
                <span className="font-medium text-[#4F46E5]">Step 3</span>
                <span className="mx-2">/</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Fixed Price ($)</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 text-white/50">
                    $
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="0.00"
                    style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                  />
                </div>
              </div>
              
              <div className="p-5 border border-white/10 rounded-xl">
                <div className="flex items-center mb-4">
                  <Timer className="text-[#4F46E5] mr-3" size={20} />
                  <h3 className="text-white/90 font-medium">Launch Offer (Optional)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-white/60 text-sm pl-1">Discount Price ($)</label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 text-white/50">
                        $
                      </div>
                      <input
                        type="text"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full h-10 pl-12 pr-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                        placeholder="0.00"
                        style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white/60 text-sm pl-1">Ends At</label>
                    <input
                      type="date"
                      name="discountEndsAt"
                      value={formData.discountEndsAt}
                      onChange={handleChange}
                      className="w-full h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                      style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-5 border border-white/10 rounded-xl">
                <div className="flex items-center mb-4">
                  <Gift className="text-[#4F46E5] mr-3" size={20} />
                  <h3 className="text-white/90 font-medium">Early Buyer Bonus Content</h3>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="relative inline-block w-10 mr-3 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="bonus-toggle"
                      className="opacity-0 absolute block w-6 h-6 cursor-pointer" 
                      checked={formData.bonusContent}
                      onChange={handleBonusContentToggle}
                    />
                    <label 
                      htmlFor="bonus-toggle" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${formData.bonusContent ? 'bg-[#4F46E5]' : 'bg-white/10'}`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${formData.bonusContent ? 'translate-x-4' : 'translate-x-0'}`}
                      ></span>
                    </label>
                  </div>
                  <span className="text-white/70 text-sm">Include bonus material for first 50 buyers</span>
                </div>
                
                {formData.bonusContent && (
                  <div className="p-4 border border-dashed border-white/20 rounded-lg text-center">
                    <Upload className="mx-auto text-white/40 mb-2 w-6 h-6" />
                    <p className="text-white/60 text-sm mb-3">Upload bonus material (PDF, ZIP, etc.)</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-sm"
                    >
                      Browse Files
                    </motion.button>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-between">
                <motion.button
                  onClick={handlePreviousStep}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/80"
                >
                  Back
                </motion.button>
                
                <motion.button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Continue</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
        
      case SellingStep.Licensing:
        return (
          <motion.div
            key="licensing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
          >
            <div className="flex items-center mb-6">
              <motion.button
                onClick={handlePreviousStep}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
              >
                <ArrowRight size={20} className="transform rotate-180" />
              </motion.button>
              
              <h2 className="text-2xl font-semibold text-white">
                License Options
              </h2>
              
              <div className="ml-auto flex items-center text-sm text-white/60">
                <span className="font-medium text-[#4F46E5]">Step 4</span>
                <span className="mx-2">/</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="space-y-5">
              <div 
                className={`p-5 rounded-xl border ${formData.licenses.personal ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-white/10 bg-white/5'} cursor-pointer hover:border-[#4F46E5]/50 transition-colors`}
                onClick={() => handleLicenseChange('personal')}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${formData.licenses.personal ? 'bg-[#4F46E5]' : 'bg-white/10'}`}>
                    {formData.licenses.personal && <CheckCircle size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-white font-medium">Personal Use</h3>
                      <Badge variant="outline" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30 text-xs">Basic</Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-2">
                      For individual, non-commercial projects only
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>Use in personal projects</span>
                      </li>
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>Install on 1 device</span>
                      </li>
                      <li className="flex items-center text-white/60 text-xs line-through">
                        <CheckCircle size={12} className="text-white/20 mr-2 flex-shrink-0" />
                        <span>Use in commercial work</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-5 rounded-xl border ${formData.licenses.commercial ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-white/10 bg-white/5'} cursor-pointer hover:border-[#4F46E5]/50 transition-colors`}
                onClick={() => handleLicenseChange('commercial')}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${formData.licenses.commercial ? 'bg-[#4F46E5]' : 'bg-white/10'}`}>
                    {formData.licenses.commercial && <CheckCircle size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-white font-medium">Commercial Use</h3>
                      <Badge variant="outline" className="bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30 text-xs">Standard</Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-2">
                      For business use within a single company
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>All Personal Use benefits</span>
                      </li>
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>Use in 1 commercial project</span>
                      </li>
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>Team use (up to 5 people)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-5 rounded-xl border ${formData.licenses.extended ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-white/10 bg-white/5'} cursor-pointer hover:border-[#4F46E5]/50 transition-colors`}
                onClick={() => handleLicenseChange('extended')}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${formData.licenses.extended ? 'bg-[#4F46E5]' : 'bg-white/10'}`}>
                    {formData.licenses.extended && <CheckCircle size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-white font-medium">Extended Commercial</h3>
                      <Badge variant="outline" className="bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30 text-xs">Premium</Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-2">
                      Unlimited commercial usage with full rights
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>All Commercial Use benefits</span>
                      </li>
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>Unlimited commercial projects</span>
                      </li>
                      <li className="flex items-center text-white/60 text-xs">
                        <CheckCircle size={12} className="text-[#22C55E] mr-2 flex-shrink-0" />
                        <span>Redistribution rights in final products</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg flex items-start mt-4">
                <ShieldCheck className="text-[#4F46E5] mr-3 mt-0.5 w-5 h-5 flex-shrink-0" />
                <p className="text-white/70 text-sm">
                  You can select multiple license options. Buyers will choose from the licenses you've enabled when making a purchase.
                </p>
              </div>
              
              <div className="mt-8 flex justify-between">
                <motion.button
                  onClick={handlePreviousStep}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/80"
                >
                  Back
                </motion.button>
                
                <motion.button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Continue</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
        
      case SellingStep.SEO:
        return (
          <motion.div
            key="seo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
          >
            <div className="flex items-center mb-6">
              <motion.button
                onClick={handlePreviousStep}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
              >
                <ArrowRight size={20} className="transform rotate-180" />
              </motion.button>
              
              <h2 className="text-2xl font-semibold text-white">
                SEO Boost
              </h2>
              
              <div className="ml-auto flex items-center text-sm text-white/60">
                <span className="font-medium text-[#4F46E5]">Step 5</span>
                <span className="mx-2">/</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-[#4F46E5]/10 rounded-lg flex items-center">
              <Search className="text-[#4F46E5] mr-3 flex-shrink-0" />
              <p className="text-white/70 text-sm">
                Optimize your product listing for search engines to increase visibility and sales.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-white/80 font-medium pl-1">SEO Title</label>
                  <div className="flex items-center bg-[#4F46E5]/10 rounded-full px-3 py-1">
                    <Wand className="text-[#4F46E5] w-3 h-3 mr-1" />
                    <span className="text-xs text-white/70">Auto-Generated</span>
                  </div>
                </div>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle || formData.title}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                  placeholder="SEO optimized title (can be different from product title)"
                  style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Keywords</label>
                <div className="relative">
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="ai, productivity, automation, tool"
                    style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                  />
                  <div className="absolute right-3 top-3">
                    <Wand className="text-[#4F46E5] w-5 h-5" />
                  </div>
                </div>
                <p className="text-white/50 text-xs pl-1">Separate keywords with commas</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription || formData.description?.substring(0, 160)}
                  onChange={handleChange}
                  className="w-full h-20 p-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 resize-none"
                  placeholder="Brief description that appears in search results (max 160 characters)"
                  style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                />
                <p className="text-white/50 text-xs pl-1">
                  {((formData.metaDescription || formData.description)?.length || 0)} / 160 characters
                </p>
              </div>
              
              <div className="space-y-2 mt-6 p-4 bg-[#4F46E5]/5 border border-[#4F46E5]/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-[#4F46E5] mr-2">🔗</span>
                  <label className="block text-white/90 font-medium">Product Link</label>
                </div>
                <p className="text-white/60 text-xs mb-3">
                  Add a direct link to your product file or download page. This is where customers will be directed after purchase.
                </p>
                <div className="relative">
                  <input
                    type="text"
                    name="productLink"
                    value={formData.productLink}
                    onChange={handleChange}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="https://example.com/your-product"
                    style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                    🔗
                  </div>
                </div>
                <p className="text-white/50 text-xs pl-1 mt-1">
                  Make sure this link is secure and accessible
                </p>
              </div>
              
              <div className="mt-8 flex justify-between">
                <motion.button
                  onClick={handlePreviousStep}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/80"
                >
                  Back
                </motion.button>
                
                <motion.button
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Continue</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
        
      case SellingStep.Publish:
        return (
          <motion.div
            key="publish"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
          >
            <div className="flex items-center mb-6">
              <motion.button
                onClick={handlePreviousStep}
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
              >
                <ArrowRight size={20} className="transform rotate-180" />
              </motion.button>
              
              <h2 className="text-2xl font-semibold text-white">
                Ready to Publish
              </h2>
              
              <div className="ml-auto flex items-center text-sm text-white/60">
                <span className="font-medium text-[#4F46E5]">Step 6</span>
                <span className="mx-2">/</span>
                <span>6</span>
              </div>
            </div>
            
            <div className="p-6 border border-[#4F46E5]/20 rounded-xl mb-6">
              <h3 className="text-white font-medium mb-3">Trust Elements (Automatic)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#4F46E5]/20 flex items-center justify-center mr-3">
                    <FileCheck className="text-[#4F46E5] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Quality Badge</p>
                    <p className="text-white/50 text-xs">Verified by Innventa AI</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#4F46E5]/20 flex items-center justify-center mr-3">
                    <TrendingUp className="text-[#4F46E5] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Popularity Tag</p>
                    <p className="text-white/50 text-xs">Based on downloads</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#4F46E5]/20 flex items-center justify-center mr-3">
                    <Award className="text-[#4F46E5] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Hot Seller Badge</p>
                    <p className="text-white/50 text-xs">After 10 sales</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handlePublish()}
                  disabled={isPublishing}
                  className="flex flex-col items-center justify-center p-6 border border-[#4F46E5] rounded-xl bg-gradient-to-b from-[#4F46E5]/10 to-transparent relative cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {isPublishing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#4F46E5]/10 backdrop-blur-sm rounded-xl">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Rocket className="text-[#4F46E5] mb-3 w-8 h-8" />
                  <h3 className="text-white font-medium mb-1">Publish Now</h3>
                  <p className="text-white/60 text-xs text-center">Make your product live immediately</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSaveDraft()}
                  disabled={isSaving}
                  className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl relative cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {isSaving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Save className="text-white/80 mb-3 w-8 h-8" />
                  <h3 className="text-white font-medium mb-1">Save Draft</h3>
                  <p className="text-white/60 text-xs text-center">Continue editing later</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    // Create a fake preview popup
                    const message = document.createElement('div');
                    message.style.position = 'fixed';
                    message.style.top = '50%';
                    message.style.left = '50%';
                    message.style.transform = 'translate(-50%, -50%)';
                    message.style.backgroundColor = 'white';
                    message.style.color = 'black';
                    message.style.padding = '20px';
                    message.style.borderRadius = '10px';
                    message.style.zIndex = '9999';
                    message.style.width = '90%';
                    message.style.maxWidth = '400px';
                    message.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    
                    message.innerHTML = `
                      <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">An embedded page at ${window.location.hostname} says</h3>
                      <p style="margin-bottom: 20px;">Preview would open at: /preview/${formData.title?.toLowerCase().replace(/\s+/g, '-') || 'product'}</p>
                      <div style="text-align: right;">
                        <button style="padding: 8px 16px; background: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button>
                      </div>
                    `;
                    
                    document.body.appendChild(message);
                    
                    const button = message.querySelector('button');
                    if (button) {
                      button.addEventListener('click', () => {
                        document.body.removeChild(message);
                      });
                    }
                  }}
                  className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Eye className="text-white/80 mb-3 w-8 h-8" />
                  <h3 className="text-white font-medium mb-1">Preview</h3>
                  <p className="text-white/60 text-xs text-center">See how it looks first</p>
                </button>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => handlePreviousStep()}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 transition-all duration-200"
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePublish()}
                  disabled={isPublishing}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {isPublishing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span className="relative z-10">Publishing...</span>
                    </div>
                  ) : (
                    <span className="relative z-10">Publish Product</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-32">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
        
        {/* Product Link Section - For users to add their product link */}
        <div className="mt-16 p-6 border border-[#4F46E5]/30 rounded-xl bg-gradient-to-r from-[#4F46E5]/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-full">
              <h3 className="text-white text-lg font-medium mb-2">Add Your Product Link</h3>
              <p className="text-white/70 mb-4">
                Enter your product link below to share it with your audience. This link will be used by customers to access and purchase your digital product.
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-white/80 font-medium text-sm">Product URL</label>
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      placeholder="https://example.com/your-product" 
                      className="flex-1 h-12 px-4 rounded-l-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                      style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    />
                    <button 
                      className="h-12 px-4 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white rounded-r-lg"
                      onClick={() => {
                        // Validate URL
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        if (input && input.value) {
                          // Check if valid URL
                          try {
                            new URL(input.value);
                            
                            // Use custom toast
                            const toast = document.createElement('div');
                            toast.style.position = 'fixed';
                            toast.style.bottom = '20px';
                            toast.style.right = '20px';
                            toast.style.backgroundColor = '#22c55e';
                            toast.style.color = 'white';
                            toast.style.padding = '10px 16px';
                            toast.style.borderRadius = '4px';
                            toast.style.zIndex = '9999';
                            toast.style.transition = 'opacity 0.3s ease';
                            toast.style.opacity = '0';
                            toast.innerText = 'Product link saved successfully!';
                            
                            document.body.appendChild(toast);
                            setTimeout(() => { toast.style.opacity = '1'; }, 10);
                            setTimeout(() => {
                              toast.style.opacity = '0';
                              setTimeout(() => document.body.removeChild(toast), 300);
                            }, 2000);
                          } catch (e) {
                            // Show error for invalid URL
                            const toast = document.createElement('div');
                            toast.style.position = 'fixed';
                            toast.style.bottom = '20px';
                            toast.style.right = '20px';
                            toast.style.backgroundColor = '#ef4444';
                            toast.style.color = 'white';
                            toast.style.padding = '10px 16px';
                            toast.style.borderRadius = '4px';
                            toast.style.zIndex = '9999';
                            toast.style.transition = 'opacity 0.3s ease';
                            toast.style.opacity = '0';
                            toast.innerText = 'Please enter a valid URL';
                            
                            document.body.appendChild(toast);
                            setTimeout(() => { toast.style.opacity = '1'; }, 10);
                            setTimeout(() => {
                              toast.style.opacity = '0';
                              setTimeout(() => document.body.removeChild(toast), 300);
                            }, 2000);
                          }
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-white/80 font-medium text-sm">Vanity URL (Optional)</label>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 px-3 h-12 flex items-center bg-white/10 border-y border-l border-white/10 rounded-l-lg text-white/50">
                      digino.com/
                    </div>
                    <input 
                      type="text" 
                      placeholder="your-product-name" 
                      className="flex-1 h-12 px-4 rounded-r-lg bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                      style={{ boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    />
                  </div>
                  <p className="text-white/50 text-xs">Create a short, memorable URL for your product</p>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <button 
                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/15 rounded-md text-white text-sm"
                    onClick={() => {
                      // Copy generated product link
                      const vanityInput = document.querySelectorAll('input[type="text"]')[1] as HTMLInputElement;
                      if (vanityInput && vanityInput.value) {
                        const link = `https://digino.com/${vanityInput.value}`;
                        navigator.clipboard.writeText(link);
                        alert('Link copied to clipboard');
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                  
                  <button 
                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/15 rounded-md text-white text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Analytics
                  </button>
                  
                  <button 
                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/15 rounded-md text-white text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Link Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}