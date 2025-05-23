import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { 
  Tag, ChevronRight, ArrowRight, Upload, Wand, X,
  DollarSign, Timer, Gift, FileCheck, Zap, Search,
  CheckCircle, TrendingUp, Award, Rocket, Save, Eye,
  ShieldCheck, Calendar, AlertCircle, AlertTriangle, Sparkles,
  Cpu, Code, BarChart, LayoutGrid, Layers, 
  Palette, FileText, BookOpen, MessageSquare, 
  Music, Video, Image, Database, Globe, Box
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
    productImages: [] as string[], // Changed to array for multiple images
    iconName: "", // Default icon name
    customIcon: "" // Added for custom product icon
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productIcon, setProductIcon] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const productImageRef = React.useRef<HTMLInputElement>(null);
  const productIconRef = React.useRef<HTMLInputElement>(null);
  
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
  
  // Direct approach to handle image uploads without relying on constructors
  const compressImage = async (file: File, maxWidthOrHeight = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Not an image file'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // For now, return the data URL directly without compression
        // This is a more compatible solution that works across environments
        resolve(event.target.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  // Handle product image upload with compression
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if we already have 15 images
    if (productImages.length + files.length > 15) {
      alert('You can upload a maximum of 15 images');
      return;
    }
    
    const imageFilesArray = Array.from(files);
    const newImages: string[] = [];
    
    try {
      // Process files in parallel using Promise.all
      const compressedImages = await Promise.all(
        imageFilesArray.map(async (file) => {
          if (!file.type.startsWith('image/')) {
            throw new Error('Please select image files only (JPEG, PNG, etc.)');
          }
          
          // Compress the image to reduce size
          const compressedImage = await compressImage(file);
          return compressedImage;
        })
      );
      
      // Update state with compressed images
      const updatedImages = [...productImages, ...compressedImages];
      setProductImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        productImages: updatedImages
      }));
      
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    }
  };
  
  // Handle product image drop with compression
  const handleProductImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    // Check if we already have 15 images
    if (productImages.length + files.length > 15) {
      alert('You can upload a maximum of 15 images');
      return;
    }
    
    const imageFilesArray = Array.from(files);
    
    try {
      // Process files in parallel using Promise.all with the same compression function
      const compressedImages = await Promise.all(
        imageFilesArray.map(async (file) => {
          if (!file.type.startsWith('image/')) {
            throw new Error('Please select image files only (JPEG, PNG, etc.)');
          }
          
          // Compress the image to reduce size
          const compressedImage = await compressImage(file);
          return compressedImage;
        })
      );
      
      // Update state with compressed images
      const updatedImages = [...productImages, ...compressedImages];
      setProductImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        productImages: updatedImages
      }));
      
    } catch (error) {
      console.error('Error processing dropped images:', error);
      alert('Error processing images. Please try again.');
    }
  };
  
  // Handle removing a specific product image
  const handleRemoveProductImage = (index: number) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
    setFormData(prev => ({
      ...prev,
      productImages: updatedImages
    }));
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
  
  // Handle product icon upload with compression
  const handleProductIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      try {
        // Use the same compression function but with smaller dimensions for icons
        const compressedIcon = await compressImage(file, 600);
        
        setProductIcon(compressedIcon);
        setFormData(prev => ({
          ...prev,
          customIcon: compressedIcon,
          iconName: "" // Clear the selected icon name when using custom icon
        }));
      } catch (error) {
        console.error('Error processing icon image:', error);
        alert('Error processing image. Please try again.');
      }
    }
  };
  
  // Handle product icon drop with compression
  const handleProductIconDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file (JPEG, PNG, etc.)');
        return;
      }
      
      try {
        // Use the same compression function but with smaller dimensions for icons
        const compressedIcon = await compressImage(file, 600);
        
        setProductIcon(compressedIcon);
        setFormData(prev => ({
          ...prev,
          customIcon: compressedIcon,
          iconName: "" // Clear the selected icon name when using custom icon
        }));
      } catch (error) {
        console.error('Error processing icon image:', error);
        alert('Error processing image. Please try again.');
      }
    }
  };
  
  // Handle product icon drag over
  const handleProductIconDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle product icon button click
  const handleProductIconClick = () => {
    productIconRef.current?.click();
  };
  
  // Load draft data from database on initial render
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        // Import the user drafts loader function
        const { fetchUserDrafts } = await import('../lib/databaseStorage');
        
        // Fetch drafts for user ID 1 (in a real app, get this from auth state)
        const drafts = await fetchUserDrafts(1);
        console.log("Loaded drafts from database:", drafts);
        
        // Here you could show a UI that lets users select from their drafts
        // For now we'll just log them to the console
      } catch (error) {
        console.error("Error loading drafts:", error);
      }
    };
    
    // Call the async function
    loadDrafts();
  }, []);
  
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
  
  // Product publish handler with proper user feedback
  const handlePublish = async () => {
    // Show a custom publication dialog instead of using alert
    const publishDialog = document.createElement('div');
    publishDialog.style.position = 'fixed';
    publishDialog.style.top = '0';
    publishDialog.style.left = '0';
    publishDialog.style.width = '100%';
    publishDialog.style.height = '100%';
    publishDialog.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    publishDialog.style.display = 'flex';
    publishDialog.style.justifyContent = 'center';
    publishDialog.style.alignItems = 'center';
    publishDialog.style.zIndex = '9999';
    
    const dialogContent = document.createElement('div');
    dialogContent.style.backgroundColor = '#1A1A2E';
    dialogContent.style.borderRadius = '12px';
    dialogContent.style.padding = '24px';
    dialogContent.style.width = '90%';
    dialogContent.style.maxWidth = '400px';
    dialogContent.style.textAlign = 'center';
    dialogContent.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
    
    // Add publishing message with a loader
    dialogContent.innerHTML = `
      <div style="margin-bottom: 16px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px;">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Publishing your product</h3>
        <p style="color: rgba(255,255,255,0.7); font-size: 14px;">Please wait while we process your product information...</p>
      </div>
      <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin: 20px 0;">
        <div id="publish-progress-bar" style="height: 100%; width: 0%; background: #4F46E5; transition: width 0.5s ease;"></div>
      </div>
    `;
    
    publishDialog.appendChild(dialogContent);
    document.body.appendChild(publishDialog);
    
    // Animate progress bar
    let progress = 0;
    const progressBar = document.getElementById('publish-progress-bar');
    const progressInterval = setInterval(async () => {
      progress += 5;
      if (progressBar) progressBar.style.width = `${progress}%`;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        try {
          // Import the createProduct function dynamically to avoid circular imports
          const { createProduct } = await import('../lib/databaseStorage');
          
          // Create product object for database with correct types
          // Use type assertions to match the required enum types
          const newProduct: any = {
            name: formData.title || "Untitled Product",
            description: formData.description || "No description",
            price: parseFloat(formData.price) || 29.99,
            currency: "USD",
            // Use a valid value from the category enum
            category: "Digital Assets" as "Digital Assets", // Type assertion to match enum
            licenseType: "Standard" as "Standard", // Type assertion to match enum
            coverImage: productImages.length > 0 ? productImages[0] : "", // Use the first image as cover
            imageUrl: productImages.length > 0 ? productImages[0] : "",   // Add imageUrl field for compatibility
            productImages: formData.productImages, // Store all product images
            authorId: 1, // Default user ID - in a real app, get this from auth state
            iconName: formData.iconName || "cpu",
            customIcon: formData.customIcon || "",
            isPublished: true,
          };
          
          // Save to database via API
          const createdProduct = await createProduct(newProduct);
          console.log("Product created in database:", createdProduct);
          
          // Show success message
          dialogContent.innerHTML = `
            <div style="margin-bottom: 16px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Successfully Published!</h3>
              <p style="color: rgba(255,255,255,0.7); font-size: 14px;">Your product is now live in the marketplace.</p>
            </div>
            <button id="view-product-btn" style="background: #4F46E5; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; width: 100%;">View Product</button>
          `;
          
          // Add button event listener
          const viewProductBtn = document.getElementById('view-product-btn');
          if (viewProductBtn) {
            viewProductBtn.addEventListener('click', () => {
              document.body.removeChild(publishDialog);
              window.location.hash = "/explore";
              window.location.reload();
            });
          }
        } catch (error) {
          // Show error message
          dialogContent.innerHTML = `
            <div style="margin-bottom: 16px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Publication Failed</h3>
              <p style="color: rgba(255,255,255,0.7); font-size: 14px;">There was an error publishing your product. Please try again.</p>
            </div>
            <button id="close-error-btn" style="background: #4F46E5; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; width: 100%;">Close</button>
          `;
          
          // Add button event listener
          const closeErrorBtn = document.getElementById('close-error-btn');
          if (closeErrorBtn) {
            closeErrorBtn.addEventListener('click', () => {
              document.body.removeChild(publishDialog);
            });
          }
          console.error("Publish error:", error);
        }
      }
    }, 50);
  };
  
  // Handle save draft - async version to use database
  const handleSaveDraft = async () => {
    
    setIsSaving(true);
    
    try {
      // Import the saveProductDraft function dynamically to avoid circular imports
      const { saveProductDraft } = await import('../lib/databaseStorage');
      
      // Create product draft object for database
      const draftProduct: any = {
        name: formData.title || "Untitled Draft Product",
        description: formData.description || "Draft description",
        price: parseFloat(formData.price) || 29.99,
        currency: "USD",
        category: "Digital Assets" as "Digital Assets", // Type assertion to match enum
        licenseType: "Standard" as "Standard", // Type assertion to match enum
        coverImage: productImages.length > 0 ? productImages[0] : "", 
        imageUrl: productImages.length > 0 ? productImages[0] : "",
        productImages: formData.productImages,
        authorId: 1, // Default user ID - in a real app, get this from auth state
        iconName: formData.iconName || "cpu",
        customIcon: formData.customIcon || "",
        isPublished: false, // Mark as draft/unpublished
      };
      
      // Save to database
      const savedDraft = await saveProductDraft(draftProduct);
      console.log("Draft saved to database:", savedDraft);
      
      setIsSaving(false);
      
      // Show success toast
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
    } catch (error) {
      console.error("Error saving draft:", error);
      setIsSaving(false);
      
      // Show error toast
      const errorToast = document.createElement('div');
      errorToast.style.position = 'fixed';
      errorToast.style.bottom = '20px';
      errorToast.style.right = '20px';
      errorToast.style.backgroundColor = '#ef4444';
      errorToast.style.color = 'white';
      errorToast.style.padding = '10px 16px';
      errorToast.style.borderRadius = '4px';
      errorToast.style.zIndex = '9999';
      errorToast.style.transition = 'opacity 0.3s ease';
      errorToast.style.opacity = '0';
      errorToast.style.display = 'flex';
      errorToast.style.alignItems = 'center';
      errorToast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Failed to save draft!';
      
      document.body.appendChild(errorToast);
      setTimeout(() => { errorToast.style.opacity = '1'; }, 10);
      setTimeout(() => {
        errorToast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(errorToast), 300);
      }, 2000);
    }
  };
  
  // Handle preview function has been removed and replaced with inline implementation
  
  const handleBackToIntro = () => {
    setCurrentStep(SellingStep.Intro);
  };
  
  const handleNextStep = () => {
    // Validate that at least 3 product images are uploaded before proceeding
    if (currentStep === SellingStep.BasicInfo && productImages.length < 3) {
      // Create a stylish custom alert dialog
      const alertDialog = document.createElement('div');
      alertDialog.style.position = 'fixed';
      alertDialog.style.top = '0';
      alertDialog.style.left = '0';
      alertDialog.style.width = '100%';
      alertDialog.style.height = '100%';
      alertDialog.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
      alertDialog.style.display = 'flex';
      alertDialog.style.justifyContent = 'center';
      alertDialog.style.alignItems = 'center';
      alertDialog.style.zIndex = '9999';
      
      const dialogContent = document.createElement('div');
      dialogContent.style.backgroundColor = '#1A1A2E';
      dialogContent.style.borderRadius = '12px';
      dialogContent.style.padding = '24px';
      dialogContent.style.width = '90%';
      dialogContent.style.maxWidth = '400px';
      dialogContent.style.textAlign = 'center';
      dialogContent.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
      
      // Add validation message with an icon
      dialogContent.innerHTML = `
        <div style="margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px;">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3 style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px;">Image Requirement</h3>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px;">Please upload at least 3 product images before continuing.</p>
        </div>
        <button id="alert-ok-button" style="background: #4F46E5; color: white; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">OK</button>
      `;
      
      alertDialog.appendChild(dialogContent);
      document.body.appendChild(alertDialog);
      
      // Handle the OK button click
      const okButton = document.getElementById('alert-ok-button');
      if (okButton) {
        okButton.addEventListener('click', () => {
          document.body.removeChild(alertDialog);
        });
      }
      
      return;
    }
    
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
              
              {/* Product Images Upload (3-15) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-white/80 font-medium pl-1">Product Images (3-15)</label>
                  <span className="text-xs text-white/60">
                    {productImages.length}/15 - Min 3 required
                  </span>
                </div>
                
                {/* Image gallery */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-white/5">
                        <img 
                          src={image} 
                          alt={`Product image ${index + 1}`} 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            className="h-8 w-8 bg-black/60 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center"
                            onClick={() => handleRemoveProductImage(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-[#4F46E5] text-white text-xs px-2 py-1 rounded-sm">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload area - shown if under 15 images */}
                {productImages.length < 15 && (
                  <div 
                    className={`border-2 border-dashed ${productImages.length < 3 ? 'border-amber-400/70' : 'border-white/20'} rounded-lg p-8 ${productImages.length < 3 ? 'bg-amber-500/5' : 'bg-white/5'} relative text-center`}
                    onDrop={handleProductImageDrop}
                    onDragOver={handleProductImageDragOver}
                  >
                    <Upload className={`mx-auto ${productImages.length < 3 ? 'text-amber-400/70' : 'text-white/30'} mb-4 w-10 h-10`} />
                    <p className="text-white/70 text-center mb-2">
                      Drag and drop or click to upload your product images
                    </p>
                    <p className={`${productImages.length < 3 ? 'text-amber-400' : 'text-white/50'} text-xs text-center mb-4 font-medium`}>
                      {productImages.length >= 3 
                        ? "You've met the minimum requirement of 3 images" 
                        : `Required: Upload at least ${3 - productImages.length} more image${3 - productImages.length !== 1 ? 's' : ''}`}
                    </p>
                    
                    <input 
                      type="file" 
                      id="product-image-upload" 
                      ref={productImageRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      multiple
                    />
                    
                    <motion.button
                      type="button"
                      onClick={handleProductImageClick}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Upload size={16} className="mr-2 inline-block" />
                      Choose Images
                    </motion.button>
                  </div>
                )}
                
                {/* Validation message */}
                {productImages.length < 3 && (
                  <p className="text-amber-400 text-xs mt-2 pl-1">
                    <AlertCircle size={14} className="inline-block mr-1" />
                    At least 3 product images are required
                  </p>
                )}
              </div>
              
              {/* Product Icon Upload */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Icon</label>
                <div 
                  className={`border-2 border-dashed border-white/20 rounded-lg ${productIcon ? 'p-4' : 'p-8'} bg-white/5 relative text-center`}
                  onDrop={handleProductIconDrop}
                  onDragOver={handleProductIconDragOver}
                >
                  {productIcon ? (
                    <div className="relative">
                      <div className="bg-gradient-to-br from-[#4F46E5]/20 to-[#4F46E5]/50 p-4 rounded-lg mx-auto w-[150px] h-[150px] flex items-center justify-center">
                        <img 
                          src={productIcon} 
                          alt="Product icon preview" 
                          className="max-h-[100px] max-w-[100px] mx-auto object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                        onClick={() => {
                          setProductIcon(null);
                          setFormData(prev => ({
                            ...prev,
                            customIcon: ""
                          }));
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Image className="mx-auto text-white/30 mb-4 w-10 h-10" />
                      <p className="text-white/70 text-center mb-4">
                        Drag and drop or click to upload your product icon
                      </p>
                      <p className="text-white/50 text-xs text-center">
                        This icon will represent your product in listings
                      </p>
                    </>
                  )}
                  
                  <input 
                    type="file" 
                    id="product-icon-upload" 
                    ref={productIconRef}
                    className={productIcon ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                    accept="image/*"
                    onChange={handleProductIconUpload}
                  />
                  
                  {!productIcon && (
                    <motion.button
                      type="button"
                      onClick={handleProductIconClick}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Upload size={16} className="mr-2 inline-block" />
                      Choose Icon
                    </motion.button>
                  )}
                </div>
              </div>
              
              {/* Product Files Upload */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Files</label>
                <div 
                  className={`border-2 border-dashed border-white/20 rounded-lg p-8 bg-white/5 relative text-center`}
                  onDrop={handleFileDrop}
                  onDragOver={handleFileDragOver}
                >
                  {selectedFiles.length > 0 ? (
                    <div className="relative">
                      <div className="mb-4">
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
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-white/30 mb-4 w-10 h-10" />
                      <p className="text-white/70 text-center mb-4">
                        Drag and drop your product file or click to browse
                      </p>
                      <p className="text-white/50 text-xs text-center">
                        Supported formats: PDF, ZIP, AI, EPUB, MP4 (max 1GB)
                      </p>
                    </>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className={selectedFiles.length > 0 ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                    multiple
                    accept=".pdf,.zip,.ai,.epub,.mp4"
                  />
                  
                  {selectedFiles.length === 0 && (
                    <motion.button
                      type="button"
                      onClick={handleBrowseClick}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Upload size={16} className="mr-2 inline-block" />
                      Browse Files
                    </motion.button>
                  )}
                  
                  {!isUploading && selectedFiles.length > 0 && (
                    <button
                      onClick={simulateFileUpload}
                      className="mt-3 px-4 py-2 bg-[#4F46E5]/80 hover:bg-[#4F46E5] rounded-lg text-white text-sm"
                    >
                      Upload Files
                    </button>
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
                  disabled={currentStep === SellingStep.BasicInfo && productImages.length < 3}
                  className={`px-8 py-3 rounded-xl ${
                    currentStep === SellingStep.BasicInfo && productImages.length < 3 
                      ? 'bg-gray-600/80 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] cursor-pointer'
                  } text-white font-medium relative overflow-hidden`}
                  whileHover={{ 
                    scale: currentStep === SellingStep.BasicInfo && productImages.length < 3 ? 1 : 1.03,
                    boxShadow: currentStep === SellingStep.BasicInfo && productImages.length < 3 ? 'none' : "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: currentStep === SellingStep.BasicInfo && productImages.length < 3 ? 1 : 0.97 }}
                >
                  <span className="relative z-10 flex items-center">
                    {currentStep === SellingStep.BasicInfo && productImages.length < 3 ? (
                      <>
                        <AlertCircle size={16} className="mr-2" />
                        Upload Required Images
                      </>
                    ) : (
                      "Continue"
                    )}
                  </span>
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
              
              {/* Info about using product icon */}
              <div className="flex items-center mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#4F46E5]/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <Image className="text-[#4F46E5]" size={20} />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Product Icon Added in Step 1</p>
                  <p className="text-white/50 text-xs">
                    The custom product icon you uploaded will be used to represent your product in listings.
                    {productIcon ? 
                      " Your custom icon is ready to go!" : 
                      " Please return to Step 1 if you want to add a custom icon."}
                  </p>
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