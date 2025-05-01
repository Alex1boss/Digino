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
  ShieldCheck,
  X as XIcon
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
  
  // For drag and drop visual feedback
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (!file) {
      console.error("No file selected");
      showErrorMessage("Please select a valid file");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type:", file.type);
      showErrorMessage("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large:", file.size);
      showErrorMessage("Image is too large. Maximum size is 5MB.");
      return;
    }
    
    console.log("Processing file:", file.name, "Type:", file.type, "Size:", file.size);
    
    // Convert to data URL for preview
    const reader = new FileReader();
    
    // Handle errors
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      showErrorMessage("Error reading file. Please try a different image.");
    };
    
    // Function to resize the image to reduce localStorage quota issues
    const resizeImage = (dataUrl: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        try {
          console.log("Starting image resize process");
          
          // Fallback in case of any errors
          const handleResizeError = (err: any) => {
            console.error("Image resize error:", err);
            console.log("Using original image as fallback");
            resolve(dataUrl); // Return original instead of failing
          };
          
          // Create image element
          const img = new Image();
          
          // Set crossOrigin to anonymous to avoid CORS issues
          img.crossOrigin = "anonymous";
          
          // Set timeout to handle potential loading issues
          const loadTimeout = setTimeout(() => {
            console.warn("Image load timeout - using original");
            resolve(dataUrl);
          }, 5000);
          
          img.onload = () => {
            clearTimeout(loadTimeout);
            
            try {
              // Create canvas for resizing
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                console.error("Failed to get canvas context");
                handleResizeError("Canvas context not available");
                return;
              }
              
              // Calculate new dimensions - reduce to save space
              const MAX_WIDTH = 500; // Made slightly smaller
              const MAX_HEIGHT = 500;
              
              let width = img.width;
              let height = img.height;
              
              // Check for valid dimensions
              if (!width || !height || width <= 0 || height <= 0) {
                console.error("Invalid image dimensions:", width, "x", height);
                handleResizeError("Invalid image dimensions");
                return;
              }
              
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height = Math.round(height * MAX_WIDTH / width);
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width = Math.round(width * MAX_HEIGHT / height);
                  height = MAX_HEIGHT;
                }
              }
              
              // Set canvas dimensions and draw resized image
              canvas.width = width;
              canvas.height = height;
              
              // Fill with background first (transparent images fix)
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              
              // Draw the image
              ctx.drawImage(img, 0, 0, width, height);
              
              try {
                // Try with JPEG first (smaller file size)
                const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.65); // 65% quality for even smaller size
                
                // Log info about the process
                console.log("Image resized successfully");
                console.log("Original dimensions:", img.width, "x", img.height);
                console.log("New dimensions:", width, "x", height);
                console.log("Original size (bytes):", dataUrl.length);
                console.log("New size (bytes):", resizedDataUrl.length);
                console.log("Size reduction:", Math.round((1 - resizedDataUrl.length / dataUrl.length) * 100) + "%");
                
                resolve(resizedDataUrl);
              } catch (toDataUrlError) {
                console.error("Error converting canvas to data URL:", toDataUrlError);
                handleResizeError(toDataUrlError);
              }
            } catch (canvasError) {
              console.error("Error working with canvas:", canvasError);
              handleResizeError(canvasError);
            }
          };
          
          img.onerror = (err) => {
            clearTimeout(loadTimeout);
            console.error("Error loading image for resizing:", err);
            handleResizeError("Failed to load image");
          };
          
          // Set source after event handlers
          img.src = dataUrl;
          
          // For some browsers, setting src isn't enough if the image is already cached
          if (img.complete) {
            console.log("Image already loaded - triggering onload");
            img.onload(new Event('AlreadyLoaded') as any);
          }
        } catch (error) {
          console.error("Critical error in image resizing:", error);
          // Still provide a fallback
          resolve(dataUrl);
        }
      });
    };
    
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const target = e.target as FileReader;
      if (target && target.result) {
        console.log("File read successful, data URL created");
        try {
          // Resize the image to prevent QuotaExceededError
          const originalDataUrl = target.result as string;
          console.log("Original image size (bytes):", originalDataUrl.length);
          
          const resizedDataUrl = await resizeImage(originalDataUrl);
          console.log("Resized image size (bytes):", resizedDataUrl.length);
          
          setFormData(prev => ({ 
            ...prev, 
            previewImage: resizedDataUrl,
          }));
        } catch (resizeError) {
          console.error("Error resizing image:", resizeError);
          // Use original as fallback, though this may still cause quota issues
          setFormData(prev => ({ 
            ...prev, 
            previewImage: target.result as string,
          }));
        }
      } else {
        console.error("File read successful but result is empty");
        showErrorMessage("Could not process image. Please try again.");
      }
    };
    
    // Start reading the file
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
      showErrorMessage("Error reading file. Please try again.");
    }
  };
  
  // Helper function to show error messages
  const showErrorMessage = (message: string) => {
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
      <p style="margin-bottom: 20px;">${message}</p>
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = () => {
    console.log("Publish button clicked"); 
    
    // Validation check
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

    // Start the publishing process
    setIsPublishing(true);
    console.log("Publishing product...");

    try {
      // ULTRA SIMPLIFIED APPROACH FOR RELIABILITY:
      // 1. Create a minimal product to avoid storage issues
      // 2. Skip localStorage and use sessionStorage which tends to be more reliable for this use case
      // 3. Use a bare minimum of data and skip images entirely if needed

      // Skip image to focus on core data first
      const uniqueId = "product-" + Date.now();
      
      // Create a minimal product object with essential fields only
      const minimalProduct = {
        id: uniqueId,
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category || "Digital Assets",
        iconName: "cpu",  // Default icon
        createdAt: new Date().toISOString()
      };

      console.log("Created minimal product:", minimalProduct);

      // First try to save just the minimal data to ensure base functionality works
      sessionStorage.setItem(uniqueId, JSON.stringify(minimalProduct));
      
      // Now try to add it to our product list
      let products = [];
      try {
        const existingProducts = sessionStorage.getItem('minimal_products');
        if (existingProducts) {
          products = JSON.parse(existingProducts);
        }
      } catch (e) {
        console.log("Error parsing existing products, starting fresh");
        products = [];
      }
      
      products.push(uniqueId);
      sessionStorage.setItem('minimal_products', JSON.stringify(products));
      
      console.log("Successfully saved minimal product");

      // Now that we know basic storage works, try to add the image data if possible
      try {
        if (formData.previewImage) {
          const imageUrl = formData.previewImage;
          
          // Try to store the image in a separate key to isolate any potential issues
          sessionStorage.setItem(`${uniqueId}_image`, imageUrl);
          console.log("Saved image separately");
          
          // Now try to update the minimal product with image data
          const fullProduct = {
            ...minimalProduct,
            coverImage: imageUrl,
            imageUrl: imageUrl,
            customIcon: imageUrl
          };
          
          // Try to save the full product now
          try {
            sessionStorage.setItem(`${uniqueId}_full`, JSON.stringify(fullProduct));
            console.log("Saved full product with images");
          } catch (imageError) {
            console.warn("Could not save full product with images:", imageError);
            // But the minimal product was already saved, so we can continue
          }
        }
      } catch (imageError) {
        console.warn("Image data could not be saved, but basic product was saved:", imageError);
        // Continue since we already saved the minimal product
      }
      
      // Now try to use localStorage as a fallback/additional storage
      try {
        // First create an array entry if it doesn't exist
        let localProducts = [];
        try {
          const localProductsJson = localStorage.getItem('products');
          if (localProductsJson) {
            localProducts = JSON.parse(localProductsJson);
          }
        } catch (e) {
          console.warn("Error parsing localStorage products:", e);
        }
        
        // Create a complete product with all expected fields
        const completeProduct = {
          id: uniqueId,
          name: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          currency: "USD",
          category: formData.category || "Digital Assets",
          rating: 0,
          reviews: 0,
          sales: 0,
          coverImage: formData.previewImage || "",
          imageUrl: formData.previewImage || "",
          customIcon: formData.previewImage || "",
          author: {
            id: 1,
            name: "Current User",
            avatar: "/assets/avatar.jpg"
          },
          createdAt: new Date().toISOString(),
          iconName: formData.iconName || "cpu",
          tags: formData.tags || "",
          license: formData.license || "Standard",
          fileType: formData.fileType || "software"
        };
        
        // Add to array
        localProducts.push(completeProduct);
        
        // Try to save (but don't worry if it fails since we have sessionStorage backup)
        try {
          localStorage.setItem('products', JSON.stringify(localProducts));
          console.log("Also saved to localStorage successfully");
        } catch (e) {
          console.warn("Could not save to localStorage, but sessionStorage is working:", e);
        }
      } catch (e) {
        console.warn("Skipping localStorage backup due to error:", e);
      }
      
      // Display success message
      console.log("Publication successful, showing success message");
      
      // Success message
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
    } catch (e) {
      // More robust error logging
      console.error("Error publishing product:", e);
      
      // Extract error details
      let errorDetails = "";
      
      if (e instanceof Error) {
        errorDetails = e.message || "Unknown error";
        console.error("Error message:", e.message);
        console.error("Error stack:", e.stack);
      } else if (typeof e === 'string') {
        errorDetails = e;
      } else {
        // If it's some other object, try to stringify it
        try {
          errorDetails = JSON.stringify(e);
        } catch (_) {
          errorDetails = "Unidentified error";
        }
      }

      // Log various localStorage state for debugging
      try {
        console.log("Current localStorage state:");
        console.log("localStorage size estimate:", new Blob([JSON.stringify(localStorage)]).size, "bytes");
        console.log("localStorage keys:", Object.keys(localStorage));
        console.log("product_index:", localStorage.getItem('product_index'));
      } catch (debugError) {
        console.log("Error during debug logging:", debugError);
      }
      
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
      
      // Provide detailed information to help debugging
      errorMessage.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">Publication Failed</h3>
        <p style="margin-bottom: 10px;">There was an error publishing your product:</p>
        <p style="margin-bottom: 20px; font-size: 14px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; overflow-wrap: break-word;">${errorDetails}</p>
        <p style="margin-bottom: 20px; font-size: 12px;">Try uploading a smaller image or clearing browser storage.</p>
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
      
    } catch (e) {
      const error = e as Error;
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
      } catch (e) {
        const error = e as Error;
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
                  <div key={index} className="flex items-center">
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
                        className={`flex-1 h-1 rounded transition-all mx-1 w-16 ${
                          index + 1 < currentStep ? 'bg-[#14B8A6]' : 'bg-white/10'
                        }`}
                      ></div>
                    )}
                  </div>
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
                          Upload Preview Image
                        </span>
                      </label>
                      <div 
                        className={`border-2 border-dashed ${isDraggingOver ? 'border-[#14B8A6] bg-[#14B8A6]/10' : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'} rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200`}
                        onClick={() => {
                          const uploadInput = document.getElementById('image-upload');
                          if (uploadInput) {
                            uploadInput.click();
                          }
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingOver(true);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingOver(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingOver(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingOver(false);
                          
                          try {
                            console.log("File drop detected");
                            
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              const file = e.dataTransfer.files[0];
                              console.log("File dropped:", file.name, "Type:", file.type, "Size:", file.size);
                              
                              // First check file size 
                              if (file.size > 10 * 1024 * 1024) { // 10MB max
                                showErrorMessage("Image too large (max 10MB). Please choose a smaller file.");
                                return;
                              }
                              
                              // Then check file type
                              if (!file.type.startsWith('image/')) {
                                showErrorMessage("Please upload an image file (JPEG, PNG, etc.)");
                                return;
                              }
                              
                              // Add a short delay to allow the UI to update
                              setTimeout(() => {
                                try {
                                  handleImageUpload(file);
                                } catch (processingError) {
                                  console.error("Error in delayed image processing:", processingError);
                                  showErrorMessage("Could not process image. Please try another file.");
                                }
                              }, 100);
                            } else {
                              console.warn("No files found in drop event");
                              showErrorMessage("No valid file detected. Please try again.");
                            }
                          } catch (error) {
                            console.error("Error handling file drop:", error);
                            showErrorMessage("Error processing your file. Please try again or use the browse button.");
                          }
                        }}
                      >
                        {formData.previewImage ? (
                          <div className="relative w-full h-40 mb-2 animate-fadeIn">
                            <img 
                              src={formData.previewImage} 
                              alt="Preview" 
                              className="w-full h-full object-contain rounded-md shadow-lg border border-white/20" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
                              <button 
                                className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md transition-all duration-200 hover:scale-110"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({ ...prev, previewImage: "" }));
                                }}
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className={`w-12 h-12 ${isDraggingOver ? 'text-[#14B8A6]' : 'text-white/30'} mb-3 ${isDraggingOver ? 'animate-pulse' : ''}`} />
                            <p className={`${isDraggingOver ? 'text-[#14B8A6]' : 'text-white/50'} text-center transition-colors duration-200`}>
                              {isDraggingOver ? 'Release to upload image' : 'Drag & drop your preview image here, or click to browse'}
                            </p>
                          </>
                        )}
                        <input 
                          type="file" 
                          id="image-upload" 
                          accept="image/jpeg,image/png,image/gif,image/webp,image/*" 
                          className="hidden"
                          onChange={(e) => {
                            try {
                              console.log("File input change detected");
                              if (e.target.files && e.target.files.length > 0) {
                                const file = e.target.files[0];
                                console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size);
                                
                                // Check file size first
                                if (file.size > 10 * 1024 * 1024) { // 10MB
                                  showErrorMessage("Image too large (max 10MB). Please choose a smaller file.");
                                  // Reset the input so user can try again
                                  e.target.value = "";
                                  return;
                                }
                                
                                // Use a small delay to allow UI to update
                                setTimeout(() => {
                                  try {
                                    handleImageUpload(file);
                                  } catch (uploadError) {
                                    console.error("Error in delayed file handling:", uploadError);
                                    showErrorMessage("Could not process image. Please try another file.");
                                  }
                                }, 100);
                              } else {
                                console.warn("No files selected");
                              }
                            } catch (error) {
                              console.error("Error handling file input change:", error);
                              showErrorMessage("Error processing your file. Please try again.");
                            }
                          }}
                        />
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