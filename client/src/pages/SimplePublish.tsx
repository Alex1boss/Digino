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
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Info,
  X as XIcon
} from "lucide-react";
import { uploadProductImages, compressImage } from "../lib/uploadHelpers";

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
    imageUrl: "",
    authorId: 1 // Default author ID
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
  const handleImageUpload = async (file: File) => {
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
    
    try {
      // Create a local preview first
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as FileReader;
        if (target && target.result) {
          // Set the preview image for UI display
          setFormData(prev => ({ 
            ...prev, 
            previewImage: target.result as string,
          }));
        }
      };
      
      // Start reading the file for preview
      reader.readAsDataURL(file);
      
      // Compress the image before upload to reduce file size
      const compressedFile = await compressImage(file);
      console.log("Image compressed:", file.size, "→", compressedFile.size);
      
      // Upload the image to the server
      const [uploadResult] = await uploadProductImages([compressedFile]);
      console.log("Image uploaded successfully:", uploadResult);
      
      // Store the image URL from the server in our form data
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: uploadResult.url
      }));
      
    } catch (error) {
      console.error("Error processing image:", error);
      showErrorMessage("Failed to upload image. Please try again.");
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

  const handlePublish = async () => {
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
      // Create product object for database
      const productData = {
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 29.99,
        category: formData.category || "Digital Assets",
        iconName: formData.iconName || "cpu",
        tags: formData.tags || "",
        licenseType: formData.license || "Standard", // Changed from license to licenseType to match schema
        imageUrl: formData.imageUrl || "",  // URL from our server upload
        authorId: 1, // Default author ID for now
      };

      console.log("Sending product data to API:", productData);

      // Send the product data to our API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create product: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      console.log("Product created successfully:", result);
      
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
          <button id="view-products" style="padding: 8px 16px; background: white; color: #14B8A6; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 10px;">View Products</button>
          <button id="continue-editing" style="padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 4px; cursor: pointer;">Add Another</button>
        </div>
      `;
      
      document.body.appendChild(successMessage);
      
      document.getElementById('view-products')?.addEventListener('click', () => {
        document.body.removeChild(successMessage);
        // Navigate to explore/products page
        setLocation('/explore');
      });
      
      document.getElementById('continue-editing')?.addEventListener('click', () => {
        document.body.removeChild(successMessage);
        // Reset form for another product
        setFormData({
          title: "",
          description: "",
          price: "29.99",
          category: "Digital Assets",
          iconName: "Zap",
          tags: "",
          fileType: "pdf",
          license: "standard",
          previewImage: "",
          imageUrl: "",
          authorId: 1
        });
        setCurrentStep(1);
      });
      
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
          // Navigate to explore page
          setLocation('/explore');
        }
      }, 10000);
      
    } catch (error) {
      console.error("Error publishing product:", error);
      
      // Capture detailed error information
      let errorDetails = "Unknown error";
      if (error instanceof Error) {
        errorDetails = `${error.name}: ${error.message}`;
        if (error.stack) {
          console.error("Error stack:", error.stack);
        }
      } else {
        errorDetails = String(error);
      }
      
      // Show error message
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
        <h3 style="margin-top: 0; font-size: 18px; font-weight: bold;">Error Publishing Product</h3>
        <p style="margin-bottom: 20px; font-size: 14px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; overflow-wrap: break-word;">${errorDetails}</p>
        <p style="margin-bottom: 20px; font-size: 12px;">Please try again or check your connection.</p>
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
  
  // Add step navigation
  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'prev' && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle draft saving
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
      localStorage.setItem('product_draft', JSON.stringify(draft));
      
      // Show success message
      const draftMessage = document.createElement('div');
      draftMessage.style.position = 'fixed';
      draftMessage.style.top = '50%';
      draftMessage.style.left = '50%';
      draftMessage.style.transform = 'translate(-50%, -50%)';
      draftMessage.style.backgroundColor = '#14B8A6';
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
        <p style="margin-bottom: 20px;">Your draft has been saved successfully. You can continue editing later.</p>
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
      showErrorMessage("Failed to save draft. Please try again.");
    } finally {
      setTimeout(() => {
        setIsDraft(false);
      }, 2000);
    }
  };
  
  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('product_draft');
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
                            ? 'bg-white/10 text-white' 
                            : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < totalSteps - 1 && (
                      <div 
                        className={`h-[2px] w-10 mx-1 ${
                          index + 1 < currentStep 
                            ? 'bg-white/60' 
                            : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:flex gap-6">
              {/* Form Column */}
              <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-[#F59E0B]" />
                      Basic Information
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-white mb-2">Product Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                          placeholder="Enter a descriptive title for your product"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-white mb-2">Product Description</label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={5}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                          placeholder="Describe your product in detail (features, benefits, etc.)"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-white mb-2">Category</label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                        >
                          <option value="Digital Assets">Digital Assets</option>
                          <option value="Software">Software</option>
                          <option value="Design Templates">Design Templates</option>
                          <option value="Audio & Music">Audio & Music</option>
                          <option value="Video & Motion">Video & Motion</option>
                          <option value="3D Models">3D Models</option>
                          <option value="Educational">Educational</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleStepChange('next')} 
                          className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#F59E0B]/80 transition-all flex items-center gap-2"
                        >
                          Next Step <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Pricing & Details */}
                {currentStep === 2 && (
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-[#F59E0B]" />
                      Pricing & Details
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="price" className="block text-white mb-2">Price (USD)</label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                          placeholder="29.99"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="license" className="block text-white mb-2">License Type</label>
                        <select
                          id="license"
                          name="license"
                          value={formData.license}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                        >
                          <option value="standard">Standard License</option>
                          <option value="extended">Extended License</option>
                          <option value="commercial">Commercial License</option>
                          <option value="exclusive">Exclusive Rights</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="tags" className="block text-white mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                          placeholder="software, digital, tech, app"
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          onClick={() => handleStepChange('prev')} 
                          className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button 
                          onClick={() => handleStepChange('next')} 
                          className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#F59E0B]/80 transition-all flex items-center gap-2"
                        >
                          Next Step <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Image Upload & Submit */}
                {currentStep === 3 && (
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-[#F59E0B]" />
                      Cover Image & Publish
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Image Upload Area */}
                      <div>
                        <label className="block text-white mb-2">Product Image</label>
                        <div 
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                            isDraggingOver 
                              ? 'border-[#F59E0B] bg-[#F59E0B]/10' 
                              : 'border-white/20 hover:border-white/40 bg-white/5'
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingOver(true);
                          }}
                          onDragLeave={() => setIsDraggingOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingOver(false);
                            if (e.dataTransfer.files.length > 0) {
                              handleImageUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const target = e.target as HTMLInputElement;
                              if (target.files && target.files.length > 0) {
                                handleImageUpload(target.files[0]);
                              }
                            };
                            input.click();
                          }}
                        >
                          {formData.previewImage ? (
                            <div className="space-y-4">
                              <img 
                                src={formData.previewImage} 
                                alt="Product preview" 
                                className="max-h-[200px] mx-auto rounded shadow-lg"
                              />
                              <div className="flex justify-center">
                                <button 
                                  className="text-white/80 hover:text-white flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData(prev => ({ ...prev, previewImage: "", imageUrl: "" }));
                                  }}
                                >
                                  <XIcon className="w-4 h-4" /> Remove Image
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <UploadCloud className="w-12 h-12 mx-auto text-white/40" />
                              <p className="text-white/60">Drag & drop an image here or click to browse</p>
                              <p className="text-white/40 text-sm">Recommended size: 1200x800px (Max 5MB)</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <button 
                            onClick={() => handleStepChange('prev')} 
                            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" /> Previous
                          </button>
                          <button
                            onClick={handleSaveDraft}
                            disabled={isDraft}
                            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                          >
                            {isDraft ? (
                              <>
                                <Clock className="w-4 h-4 animate-spin" /> Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" /> Save Draft
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div>
                          <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg hover:bg-[#F59E0B]/80 transition-all flex items-center gap-2 shadow-lg"
                          >
                            {isPublishing ? 'Publishing...' : 'Publish Product'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {formData.title || "Product Title"}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {formData.category || "Digital Assets"}
                        </p>
                      </div>
                    </div>
                    
                    {formData.previewImage && (
                      <div className="mb-4">
                        <img 
                          src={formData.previewImage} 
                          alt="Product preview" 
                          className="w-full h-[150px] object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <p className="text-white/80 text-sm mb-4 line-clamp-3">
                      {formData.description || "This is where your product description will appear. A good description helps potential buyers understand what they're getting."}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-sm">
                          {formData.license === "standard" ? "Standard License" : 
                           formData.license === "extended" ? "Extended License" :
                           formData.license === "commercial" ? "Commercial License" : 
                           "Exclusive Rights"}
                        </span>
                      </div>
                      <div className="text-white font-bold">
                        ${formData.price || "29.99"}
                      </div>
                    </div>
                    
                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {formData.tags.split(',').map((tag, index) => (
                          tag.trim() && (
                            <div 
                              key={index} 
                              className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
                            >
                              {tag.trim()}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 text-white/60 text-sm">
                    <p className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Instant delivery upon purchase
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Technical support included
                    </p>
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