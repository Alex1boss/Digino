import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Upload,
  Tag,
  DollarSign,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  ChevronRight,
  Check,
  Save,
  Sparkles,
  Book,
  Layers,
  BarChart,
  FileCheck,
  Link2,
  Clock,
  Star,
  AlertCircle
} from "lucide-react";

import { Card3D } from "@/components/ui/3d-card";
import { Badge3D } from "@/components/ui/3d-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Validation schema
const productFormSchema = z.object({
  // Basic Info
  name: z.string().min(3, { message: "Name must be at least 3 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  shortDescription: z.string().max(160, { message: "Short description must not exceed 160 characters." }),
  
  // Categorization
  category: z.string().min(1, { message: "Please select a category." }),
  subCategory: z.string().optional(),
  tags: z.array(z.string()).min(1, { message: "Please add at least one tag." }),
  
  // Pricing
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
  discountPrice: z.coerce.number().min(0).optional(),
  isPricingFlexible: z.boolean().default(false),
  
  // Licensing
  license: z.enum(["standard", "extended", "custom"]),
  allowCommercialUse: z.boolean().default(true),
  allowModification: z.boolean().default(true),
  requireAttribution: z.boolean().default(true),
  
  // Files and Images
  mainImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  
  // SEO
  metaTitle: z.string().max(60, { message: "Meta title must not exceed 60 characters." }).optional(),
  metaDescription: z.string().max(160, { message: "Meta description must not exceed 160 characters." }).optional(),
  isPublished: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Default values for the form
const defaultValues: Partial<ProductFormValues> = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  subCategory: "",
  tags: [],
  price: 0,
  discountPrice: 0,
  isPricingFlexible: false,
  license: "standard",
  allowCommercialUse: true,
  allowModification: true,
  requireAttribution: true,
  mainImage: "",
  galleryImages: [],
  files: [],
  metaTitle: "",
  metaDescription: "",
  isPublished: false,
};

// Category options
const categories = [
  { value: "graphics", label: "Graphics & Design" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "writing", label: "Writing & Translation" },
  { value: "video", label: "Video & Animation" },
  { value: "audio", label: "Music & Audio" },
  { value: "programming", label: "Programming & Tech" },
  { value: "business", label: "Business" },
  { value: "data", label: "Data" },
  { value: "photography", label: "Photography" },
  { value: "ai", label: "AI Services" },
];

// Subcategory options (mapped by parent category)
const subcategories: Record<string, {value: string, label: string}[]> = {
  "graphics": [
    { value: "logo-design", label: "Logo Design" },
    { value: "web-design", label: "Web Design" },
    { value: "app-design", label: "App Design" },
    { value: "ux-ui-design", label: "UX/UI Design" },
    { value: "illustration", label: "Illustration" },
    { value: "nft-art", label: "NFT Art" },
    { value: "3d-models", label: "3D Models" },
  ],
  "programming": [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-apps", label: "Mobile Apps" },
    { value: "game-development", label: "Game Development" },
    { value: "desktop-applications", label: "Desktop Applications" },
    { value: "chatbots", label: "Chatbots" },
    { value: "plugins", label: "Plugins & Extensions" },
  ],
  "ai": [
    { value: "ai-models", label: "AI Models" },
    { value: "ai-templates", label: "AI Templates" },
    { value: "prompt-engineering", label: "Prompt Engineering" },
    { value: "ai-integrations", label: "AI Integrations" },
  ]
};

const steps = [
  { id: "basics", label: "Basic Info" },
  { id: "categorization", label: "Categorization" },
  { id: "pricing", label: "Pricing" },
  { id: "licensing", label: "Licensing" },
  { id: "files", label: "Files & Images" },
  { id: "seo", label: "SEO & Publishing" },
];

export default function UploadProduct() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState("basics");
  const [stepIndex, setStepIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [filePreviews, setFilePreviews] = useState<{name: string, size: string}[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Watch category for subcategory options
  const selectedCategory = form.watch("category");
  
  // Navigation functions
  const goToNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep.id);
      setStepIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep.id);
      setStepIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToStep = (stepId: string) => {
    const index = steps.findIndex(step => step.id === stepId);
    if (index !== -1) {
      setCurrentStep(stepId);
      setStepIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit handler
  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", data);
      
      // Success notification
      toast({
        title: "Product created",
        description: `"${data.name}" has been successfully ${data.isPublished ? 'published' : 'saved as draft'}.`,
        variant: "default",
      });
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      
      // Error notification
      toast({
        title: "Failed to create product",
        description: "There was an error creating your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image upload
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
          form.setValue("mainImage", URL.createObjectURL(file));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle gallery images upload
  const handleGalleryImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      const newUrls: string[] = [];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            newUrls.push(URL.createObjectURL(file));
            
            if (newPreviews.length === files.length) {
              setGalleryPreviews([...galleryPreviews, ...newPreviews]);
              form.setValue("galleryImages", [...(form.getValues("galleryImages") || []), ...newUrls]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Handle file upload
  const handleFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => {
        // Format size
        const size = file.size < 1024 * 1024 
          ? `${(file.size / 1024).toFixed(1)} KB` 
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
          
        return { name: file.name, size };
      });
      
      setFilePreviews([...filePreviews, ...newFiles]);
      form.setValue("files", [...(form.getValues("files") || []), ...Array.from(files).map(f => URL.createObjectURL(f))]);
    }
  };

  // Common classes
  const sectionClasses = "space-y-6";
  const sectionTitleClasses = "text-2xl font-bold text-white";
  const cardClasses = "p-6 space-y-6";

  return (
    <div className="min-h-screen bg-[#0A0A23] text-white pb-20">
      {/* Floating gradient orbs for premium look */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#0056D2]/10 to-transparent blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-gradient-to-r from-[#00C49A]/10 to-transparent blur-[60px]" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "url('/grid.svg')",
          backgroundSize: "100px 100px",
        }}
      />
      
      {/* Page header */}
      <div className="relative z-10 container mx-auto px-4 pt-8 pb-6">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost" 
            size="icon"
            className="mr-4 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold text-white">Upload New Product</h1>
        </div>
        
        <p className="text-white/70 max-w-2xl">
          Create and sell your digital product on our marketplace. Fill out the details below to get started.
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="relative z-10 container mx-auto px-4 mb-8">
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-1 md:space-x-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    stepIndex >= index 
                      ? "bg-white/10 text-white" 
                      : "text-white/40 hover:bg-white/5"
                  )}
                  onClick={() => stepIndex >= index && goToStep(step.id)}
                >
                  <div 
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs", 
                      stepIndex > index 
                        ? "bg-[#00C49A] text-white" 
                        : stepIndex === index 
                          ? "bg-[#0056D2] text-white" 
                          : "bg-white/10 text-white/70"
                    )}
                  >
                    {stepIndex > index ? <Check size={14} /> : index + 1}
                  </div>
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block absolute left-3 top-3 w-[calc(100%-2.5rem)] h-0.5 bg-white/10 -z-10"></div>
        </div>
      </div>
      
      {/* Form content */}
      <div className="relative z-10 container mx-auto px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main form area */}
              <div className="lg:col-span-2">
                <Card3D className="overflow-hidden">
                  <div className="p-6 space-y-8">
                    {/* Basic Info */}
                    {currentStep === "basics" && (
                      <div className={sectionClasses}>
                        <h2 className={sectionTitleClasses}>Basic Information</h2>
                        <p className="text-white/70">
                          Start with the essentials. A great product name and description help your product stand out.
                        </p>
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name*</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter a clear, descriptive name" 
                                  {...field} 
                                  className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                />
                              </FormControl>
                              <FormDescription className="text-white/50">
                                Choose a name that clearly describes what you're selling (75 characters max)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shortDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Short Description*</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="One-line description of your product" 
                                  {...field} 
                                  className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                />
                              </FormControl>
                              <FormDescription className="text-white/50">
                                A brief summary that appears in search results (160 characters max)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Description*</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide detailed information about your product" 
                                  className="resize-none bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white min-h-[200px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-white/50">
                                Describe your product in detail. What is it? What does it do? Who is it for? What problem does it solve?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    {/* Categorization */}
                    {currentStep === "categorization" && (
                      <div className={sectionClasses}>
                        <h2 className={sectionTitleClasses}>Categorization</h2>
                        <p className="text-white/70">
                          Properly categorizing your product helps buyers find it more easily.
                        </p>
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/5 border-white/10 focus:ring-[#0056D2] text-white">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-[#1A1A3A] border-white/10 text-white">
                                  {categories.map((category) => (
                                    <SelectItem 
                                      key={category.value} 
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {selectedCategory && subcategories[selectedCategory] && (
                          <FormField
                            control={form.control}
                            name="subCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subcategory</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-white/5 border-white/10 focus:ring-[#0056D2] text-white">
                                      <SelectValue placeholder="Select a subcategory" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1A1A3A] border-white/10 text-white">
                                    {subcategories[selectedCategory].map((subcat) => (
                                      <SelectItem 
                                        key={subcat.value} 
                                        value={subcat.value}
                                      >
                                        {subcat.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <div className="space-y-3">
                          <Label htmlFor="tags">Tags* (at least 1)</Label>
                          <div className="flex flex-wrap gap-2">
                            {(form.getValues("tags") || []).map((tag, index) => (
                              <div 
                                key={index}
                                className="flex items-center bg-white/10 rounded-full px-3 py-1 text-sm"
                              >
                                <span>{tag}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 ml-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                                  onClick={() => {
                                    const currentTags = form.getValues("tags") || [];
                                    form.setValue(
                                      "tags", 
                                      currentTags.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <span className="sr-only">Remove</span>
                                  <span aria-hidden="true">×</span>
                                </Button>
                              </div>
                            ))}
                            
                            <Input
                              id="add-tag"
                              placeholder="Add a tag"
                              className="w-32 h-8 bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white text-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                                  e.preventDefault();
                                  const currentTags = form.getValues("tags") || [];
                                  const newTag = (e.target as HTMLInputElement).value.trim();
                                  form.setValue("tags", [...currentTags, newTag]);
                                  (e.target as HTMLInputElement).value = "";
                                }
                              }}
                            />
                          </div>
                          <p className="text-xs text-white/50">Press Enter to add a tag. Add keywords that buyers might use to find your product.</p>
                          {form.formState.errors.tags && (
                            <p className="text-xs text-red-500">{form.formState.errors.tags.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Pricing */}
                    {currentStep === "pricing" && (
                      <div className={sectionClasses}>
                        <h2 className={sectionTitleClasses}>Pricing</h2>
                        <p className="text-white/70">
                          Set a competitive price that reflects the value of your product.
                        </p>
                        
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price* ($USD)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                  <Input 
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    {...field} 
                                    className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white pl-8"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="discountPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Price ($USD)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                  <Input 
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    {...field} 
                                    className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white pl-8"
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-white/50">
                                Optional. If set, this will be displayed as a sale price.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isPricingFlexible"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Flexible Pricing</FormLabel>
                                <FormDescription className="text-white/50">
                                  Allow customers to make offers or negotiate pricing
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-[#0056D2]"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="bg-[#0056D2]/10 rounded-lg p-4 border border-[#0056D2]/30">
                          <h4 className="font-medium mb-2 flex items-center text-[#0056D2]">
                            <AlertCircle size={16} className="mr-2" />
                            Pricing Tips
                          </h4>
                          <ul className="space-y-2 text-sm text-white/70">
                            <li className="flex items-start">
                              <span className="text-[#0056D2] mr-2">•</span>
                              Research competitors to find the right price point
                            </li>
                            <li className="flex items-start">
                              <span className="text-[#0056D2] mr-2">•</span>
                              Consider offering a discount for the launch period
                            </li>
                            <li className="flex items-start">
                              <span className="text-[#0056D2] mr-2">•</span>
                              Remember platform fees when setting your price
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {/* Licensing */}
                    {currentStep === "licensing" && (
                      <div className={sectionClasses}>
                        <h2 className={sectionTitleClasses}>Licensing Options</h2>
                        <p className="text-white/70">
                          Define how customers can use your digital product.
                        </p>
                        
                        <FormField
                          control={form.control}
                          name="license"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>License Type*</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-3"
                                >
                                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                                    <FormControl>
                                      <RadioGroupItem value="standard" className="mt-1" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="text-base font-medium">Standard License</FormLabel>
                                      <FormDescription className="text-white/70">
                                        Basic license for personal or single commercial project use.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  
                                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                                    <FormControl>
                                      <RadioGroupItem value="extended" className="mt-1" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="text-base font-medium">Extended License</FormLabel>
                                      <FormDescription className="text-white/70">
                                        Expanded rights for multiple projects or commercial distribution.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  
                                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                                    <FormControl>
                                      <RadioGroupItem value="custom" className="mt-1" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="text-base font-medium">Custom License</FormLabel>
                                      <FormDescription className="text-white/70">
                                        Create your own custom licensing terms for your product.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-4 pt-4">
                          <h3 className="text-lg font-medium">License Terms</h3>
                          
                          <FormField
                            control={form.control}
                            name="allowCommercialUse"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Commercial Use</FormLabel>
                                  <FormDescription className="text-white/50">
                                    Allow buyers to use in commercial projects
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#0056D2]"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="allowModification"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Modifications</FormLabel>
                                  <FormDescription className="text-white/50">
                                    Allow buyers to modify or adapt the product
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#0056D2]"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="requireAttribution"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Attribution Required</FormLabel>
                                  <FormDescription className="text-white/50">
                                    Require buyers to credit you when using the product
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#0056D2]"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Files & Images */}
                    {currentStep === "files" && (
                      <div className={sectionClasses}>
                        <h2 className={sectionTitleClasses}>Files & Images</h2>
                        <p className="text-white/70">
                          Upload product images and files that buyers will download after purchase.
                        </p>
                        
                        {/* Main Product Image */}
                        <div className="space-y-3">
                          <Label>Main Product Image*</Label>
                          
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 bg-white/5 relative">
                            {previewImage ? (
                              <div className="relative w-full">
                                <img 
                                  src={previewImage} 
                                  alt="Product preview" 
                                  className="max-h-[200px] mx-auto rounded-md object-contain"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                  onClick={() => {
                                    setPreviewImage(null);
                                    form.setValue("mainImage", "");
                                  }}
                                >
                                  <span className="sr-only">Remove</span>
                                  <span aria-hidden="true">×</span>
                                </Button>
                              </div>
                            ) : (
                              <>
                                <ImageIcon size={40} className="text-white/30 mb-4" />
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
                              id="main-image-upload" 
                              className={previewImage ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                              accept="image/*"
                              onChange={handleMainImageUpload}
                            />
                            
                            {!previewImage && (
                              <Button
                                type="button"
                                className="mt-4 bg-white/10 hover:bg-white/20 text-white"
                                onClick={() => document.getElementById("main-image-upload")?.click()}
                              >
                                <Upload size={16} className="mr-2" />
                                Choose File
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Gallery Images */}
                        <div className="space-y-3">
                          <Label>Gallery Images (Optional)</Label>
                          
                          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 bg-white/5 relative">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              {galleryPreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img 
                                    src={preview} 
                                    alt={`Gallery image ${index + 1}`} 
                                    className="h-24 w-full object-cover rounded-md"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                    onClick={() => {
                                      const newPreviews = [...galleryPreviews];
                                      newPreviews.splice(index, 1);
                                      setGalleryPreviews(newPreviews);
                                      
                                      const galleryImages = form.getValues("galleryImages") || [];
                                      const newGalleryImages = [...galleryImages];
                                      newGalleryImages.splice(index, 1);
                                      form.setValue("galleryImages", newGalleryImages);
                                    }}
                                  >
                                    <span className="sr-only">Remove</span>
                                    <span aria-hidden="true">×</span>
                                  </Button>
                                </div>
                              ))}
                              
                              {galleryPreviews.length < 6 && (
                                <div 
                                  className="h-24 border border-white/20 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                                  onClick={() => document.getElementById("gallery-images-upload")?.click()}
                                >
                                  <Upload size={20} className="text-white/50 mb-2" />
                                  <span className="text-white/50 text-sm">Add Image</span>
                                </div>
                              )}
                            </div>
                            
                            <input 
                              type="file" 
                              id="gallery-images-upload" 
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryImagesUpload}
                            />
                            
                            <p className="text-white/50 text-xs text-center">
                              Add up to 6 additional product images to showcase your product
                            </p>
                          </div>
                        </div>
                        
                        {/* Downloadable Files */}
                        <div className="space-y-3">
                          <Label>Downloadable Files*</Label>
                          
                          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 bg-white/5 relative">
                            {filePreviews.length > 0 ? (
                              <div className="space-y-3 mb-4">
                                {filePreviews.map((file, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center justify-between bg-white/10 rounded-md p-3"
                                  >
                                    <div className="flex items-center">
                                      <FileText size={20} className="text-white/70 mr-3" />
                                      <div>
                                        <p className="text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-white/50">{file.size}</p>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                                      onClick={() => {
                                        const newFilePreviews = [...filePreviews];
                                        newFilePreviews.splice(index, 1);
                                        setFilePreviews(newFilePreviews);
                                        
                                        const files = form.getValues("files") || [];
                                        const newFiles = [...files];
                                        newFiles.splice(index, 1);
                                        form.setValue("files", newFiles);
                                      }}
                                    >
                                      <span className="sr-only">Remove</span>
                                      <span aria-hidden="true">×</span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center mb-4">
                                <FileText size={40} className="text-white/30 mx-auto mb-3" />
                                <p className="text-white/70">
                                  Upload the files customers will receive after purchase
                                </p>
                              </div>
                            )}
                            
                            <input 
                              type="file" 
                              id="files-upload" 
                              className="hidden"
                              multiple
                              onChange={handleFilesUpload}
                            />
                            
                            <div className="flex justify-center">
                              <Button
                                type="button"
                                className="bg-white/10 hover:bg-white/20 text-white"
                                onClick={() => document.getElementById("files-upload")?.click()}
                              >
                                <Upload size={16} className="mr-2" />
                                Upload Files
                              </Button>
                            </div>
                            
                            <p className="text-white/50 text-xs text-center mt-3">
                              ZIP, RAR, PDF, DOC, and other file types supported (max 1GB per file)
                            </p>
                          </div>
                          {form.formState.errors.files && (
                            <p className="text-xs text-red-500">{form.formState.errors.files.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* SEO & Publishing */}
                    {currentStep === "seo" && (
                      <div className={sectionClasses}>
                        <h2 className={sectionTitleClasses}>SEO & Publishing</h2>
                        <p className="text-white/70">
                          Optimize your product listing for search engines and prepare for publishing.
                        </p>
                        
                        <FormField
                          control={form.control}
                          name="metaTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Title</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="SEO title (defaults to product name if empty)" 
                                  {...field} 
                                  className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                />
                              </FormControl>
                              <FormDescription className="text-white/50">
                                Optimize for search engines (60 characters max)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="metaDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="SEO description (defaults to short description if empty)" 
                                  className="resize-none bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-white/50">
                                Brief summary for search engines (160 characters max)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator className="bg-white/10 my-6" />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Publishing Options</h3>
                          
                          <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Publish immediately</FormLabel>
                                  <FormDescription className="text-white/50">
                                    If turned off, your product will be saved as a draft
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#0056D2]"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <Card3D className="border border-[#00C49A]/30 bg-[#00C49A]/5">
                            <div className="p-4">
                              <h4 className="font-medium mb-3 flex items-center text-[#00C49A]">
                                <Check size={18} className="mr-2" />
                                Ready to publish!
                              </h4>
                              
                              <p className="text-white/70 text-sm mb-4">
                                Your product is ready to be {form.watch("isPublished") ? "published" : "saved as a draft"}. Review all information before submitting.
                              </p>
                              
                              <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:from-[#0056D2]/90 hover:to-[#00C49A]/90 text-white rounded-lg gap-2"
                                disabled={submitting}
                              >
                                {submitting ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                  </>
                                ) : saveSuccess ? (
                                  <>
                                    <Check size={16} />
                                    <span>Success!</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={16} />
                                    <span>{form.watch("isPublished") ? "Publish Product" : "Save as Draft"}</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </Card3D>
                        </div>
                      </div>
                    )}
                  </div>
                </Card3D>
                
                {/* Navigation buttons */}
                <div className="mt-6 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    onClick={goToPrevious}
                    disabled={stepIndex === 0}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                  
                  {stepIndex < steps.length - 1 ? (
                    <Button 
                      type="button" 
                      className="bg-[#0056D2] hover:bg-[#0056D2]/90 text-white rounded-lg gap-2"
                      onClick={goToNext}
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:from-[#0056D2]/90 hover:to-[#00C49A]/90 text-white rounded-lg gap-2"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check size={16} />
                          <span>Success!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>{form.watch("isPublished") ? "Publish Product" : "Save as Draft"}</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Sidebar / Help section */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <Card3D className={cardClasses}>
                    <h3 className="text-lg font-semibold mb-4">Completion Progress</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-white/70">Progress</span>
                          <span className="text-white font-medium">
                            {Math.round((stepIndex / (steps.length - 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#0056D2] to-[#00C49A] rounded-full"
                            style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {steps.map((step, index) => (
                          <div 
                            key={step.id}
                            className={cn(
                              "flex items-center p-2 rounded-md transition-colors",
                              stepIndex === index 
                                ? "bg-white/10" 
                                : "hover:bg-white/5"
                            )}
                            onClick={() => stepIndex >= index && goToStep(step.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <div 
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3",
                                stepIndex > index 
                                  ? "bg-[#00C49A] text-white" 
                                  : stepIndex === index 
                                    ? "bg-[#0056D2] text-white" 
                                    : "bg-white/10 text-white/70"
                              )}
                            >
                              {stepIndex > index ? <Check size={14} /> : index + 1}
                            </div>
                            <span 
                              className={cn(
                                stepIndex >= index ? "text-white" : "text-white/50"
                              )}
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                  
                  <Card3D className={cardClasses}>
                    <h3 className="text-lg font-semibold mb-4">Step Tips</h3>
                    
                    {currentStep === "basics" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0056D2]/20 p-2 rounded-full mt-1">
                            <FileText size={20} className="text-[#0056D2]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Be Descriptive</h4>
                            <p className="text-sm text-white/70">
                              Use clear, specific language to describe your product. Avoid vague terms.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-[#00C49A]/20 p-2 rounded-full mt-1">
                            <Star size={20} className="text-[#00C49A]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Highlight Benefits</h4>
                            <p className="text-sm text-white/70">
                              Focus on how your product solves problems or improves the buyer's workflow.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === "categorization" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0056D2]/20 p-2 rounded-full mt-1">
                            <Tag size={20} className="text-[#0056D2]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Use Relevant Tags</h4>
                            <p className="text-sm text-white/70">
                              Add tags that potential buyers might search for when looking for your product.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-[#00C49A]/20 p-2 rounded-full mt-1">
                            <Layers size={20} className="text-[#00C49A]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Select Specific Categories</h4>
                            <p className="text-sm text-white/70">
                              Choose the most specific category and subcategory that matches your product.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === "pricing" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0056D2]/20 p-2 rounded-full mt-1">
                            <BarChart size={20} className="text-[#0056D2]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Market Research</h4>
                            <p className="text-sm text-white/70">
                              Check competitive prices for similar products to position yours effectively.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-[#00C49A]/20 p-2 rounded-full mt-1">
                            <DollarSign size={20} className="text-[#00C49A]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Value-Based Pricing</h4>
                            <p className="text-sm text-white/70">
                              Price based on the value your product provides, not just your time investment.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === "licensing" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0056D2]/20 p-2 rounded-full mt-1">
                            <FileCheck size={20} className="text-[#0056D2]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Clear Terms</h4>
                            <p className="text-sm text-white/70">
                              Make your licensing terms clear and easy to understand to avoid confusion.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-[#00C49A]/20 p-2 rounded-full mt-1">
                            <Link2 size={20} className="text-[#00C49A]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Consider Tiered Licensing</h4>
                            <p className="text-sm text-white/70">
                              Offering different license tiers can help you reach more customers and maximize revenue.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === "files" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0056D2]/20 p-2 rounded-full mt-1">
                            <ImageIcon size={20} className="text-[#0056D2]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">High-Quality Images</h4>
                            <p className="text-sm text-white/70">
                              Use clear, professional images that showcase your product's features and quality.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-[#00C49A]/20 p-2 rounded-full mt-1">
                            <HelpCircle size={20} className="text-[#00C49A]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Include Documentation</h4>
                            <p className="text-sm text-white/70">
                              Add a README or help file to guide users on how to use your product.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === "seo" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0056D2]/20 p-2 rounded-full mt-1">
                            <Book size={20} className="text-[#0056D2]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Use Keywords</h4>
                            <p className="text-sm text-white/70">
                              Include relevant keywords in your title and description to improve discoverability.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-[#00C49A]/20 p-2 rounded-full mt-1">
                            <Clock size={20} className="text-[#00C49A]" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Release Timing</h4>
                            <p className="text-sm text-white/70">
                              Consider publishing during peak traffic times to maximize initial visibility.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card3D>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium mb-2 flex items-center">
                      <HelpCircle size={16} className="text-[#0056D2] mr-2" />
                      Need Help?
                    </h4>
                    <p className="text-sm text-white/70 mb-3">
                      Having trouble with your product submission? Our resources can help:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Book size={14} className="text-white/50 mr-2" />
                        <Link href="#" className="text-[#0056D2] hover:underline">
                          Seller Guidelines
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <HelpCircle size={14} className="text-white/50 mr-2" />
                        <Link href="#" className="text-[#0056D2] hover:underline">
                          FAQ
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <FileText size={14} className="text-white/50 mr-2" />
                        <Link href="#" className="text-[#0056D2] hover:underline">
                          Best Practices
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}