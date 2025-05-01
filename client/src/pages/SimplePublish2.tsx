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
        license: formData.license || "Standard",
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
