import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Link2, 
  MapPin, 
  Image as ImageIcon, 
  Briefcase, 
  Award, 
  ArrowLeft,
  Save,
  Check
} from "lucide-react";

import { Avatar3D } from "@/components/ui/3d-avatar";
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
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Validation schema
const profileFormSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  username: z.string().min(3, { message: "Username must be at least 3 characters." })
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers and underscores." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  profilePicture: z.string().optional(),
  bio: z.string().max(280, { message: "Bio must not exceed 280 characters." }).optional(),
  location: z.string().max(50).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  
  // Professional Info
  profession: z.string().max(50).optional(),
  company: z.string().max(50).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.enum(["0-1", "1-3", "3-5", "5-10", "10+"]).optional(),
  
  // Social Media
  twitter: z.string().max(50).optional(),
  instagram: z.string().max(50).optional(),
  linkedin: z.string().max(50).optional(),
  github: z.string().max(50).optional(),
  
  // Privacy & Notifications
  emailVisibility: z.boolean().default(false),
  allowMessages: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Default values for the form
const defaultValues: Partial<ProfileFormValues> = {
  fullName: "Alex Morgan",
  username: "alexmorgan",
  email: "alex@example.com",
  bio: "Digital creator and entrepreneur. I build premium digital assets and products for modern creators.",
  location: "San Francisco, CA",
  website: "https://alexmorgan.co",
  profession: "UI/UX Designer",
  company: "DesignStudio",
  skills: ["UI Design", "Product Design", "Figma", "React"],
  experience: "5-10",
  twitter: "alexmorgan",
  instagram: "alexmorgan.design",
  linkedin: "alexmorgan",
  github: "alexmorgan",
  emailVisibility: false,
  allowMessages: true,
  emailNotifications: true,
};

export default function EditProfile() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("personal");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Submit handler
  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", data);
      
      // Success notification
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Error notification
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
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
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>
        
        <p className="text-white/70 max-w-2xl">
          Customize your profile information to stand out in the marketplace. A complete profile increases your credibility as a seller.
        </p>
      </div>
      
      {/* Form content */}
      <div className="relative z-10 container mx-auto px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar with profile preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <Card3D className={cardClasses}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative group">
                        <Avatar3D 
                          letter={form.getValues("fullName")?.[0] || "A"} 
                          size="xl" 
                          verified={true} 
                          className="mx-auto"
                        />
                        <label 
                          htmlFor="profile-picture"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                          <ImageIcon size={24} className="text-white" />
                        </label>
                        <input 
                          id="profile-picture" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </div>
                      
                      <h3 className="mt-4 text-xl font-semibold text-white">
                        {form.watch("fullName") || "Your Name"}
                      </h3>
                      <p className="text-[#00C49A] font-medium">
                        @{form.watch("username") || "username"}
                      </p>
                      
                      <p className="mt-3 text-white/70 text-sm">
                        {form.watch("bio") || "Your bio will appear here."}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        <Badge3D label="Edit Mode" icon={User} color="#0056D2" />
                      </div>
                      
                      <div className="w-full mt-6">
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:from-[#0056D2]/90 hover:to-[#00C49A]/90 text-white rounded-lg gap-2"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : saveSuccess ? (
                            <>
                              <Check size={16} />
                              <span>Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              <span>Save Profile</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card3D>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check size={16} className="text-[#00C49A] mr-2" />
                      Profile Completion Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-start">
                        <span className="text-[#00C49A] mr-2">•</span>
                        Add a professional profile picture
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00C49A] mr-2">•</span>
                        Write a concise, compelling bio
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00C49A] mr-2">•</span>
                        Add your skills and experience
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#00C49A] mr-2">•</span>
                        Link your social media accounts
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Main form area */}
              <div className="lg:col-span-3">
                <Tabs 
                  defaultValue="personal" 
                  value={selectedTab} 
                  onValueChange={setSelectedTab}
                  className="w-full"
                >
                  <Card3D className="p-0 overflow-hidden">
                    <TabsList className="bg-white/5 border-b border-white/10 w-full rounded-none h-auto p-0">
                      <TabsTrigger 
                        value="personal" 
                        className={cn(
                          "rounded-none data-[state=active]:bg-white/10 border-b-2 border-transparent data-[state=active]:border-[#0056D2] px-6 py-4 text-white/70 data-[state=active]:text-white",
                          selectedTab === "personal" ? "text-white border-[#0056D2]" : ""
                        )}
                      >
                        <User size={16} className="mr-2" />
                        Personal Info
                      </TabsTrigger>
                      <TabsTrigger 
                        value="professional" 
                        className={cn(
                          "rounded-none data-[state=active]:bg-white/10 border-b-2 border-transparent data-[state=active]:border-[#0056D2] px-6 py-4 text-white/70 data-[state=active]:text-white",
                          selectedTab === "professional" ? "text-white border-[#0056D2]" : ""
                        )}
                      >
                        <Briefcase size={16} className="mr-2" />
                        Professional
                      </TabsTrigger>
                      <TabsTrigger 
                        value="social" 
                        className={cn(
                          "rounded-none data-[state=active]:bg-white/10 border-b-2 border-transparent data-[state=active]:border-[#0056D2] px-6 py-4 text-white/70 data-[state=active]:text-white",
                          selectedTab === "social" ? "text-white border-[#0056D2]" : ""
                        )}
                      >
                        <Link2 size={16} className="mr-2" />
                        Social Media
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="p-6">
                      <TabsContent value="personal" className="m-0 space-y-6">
                        <div className={sectionClasses}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your full name" 
                                      {...field} 
                                      className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Choose a username" 
                                      {...field} 
                                      className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                    />
                                  </FormControl>
                                  <FormDescription className="text-white/50">
                                    This will be your unique @username
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your email" 
                                    type="email"
                                    {...field} 
                                    className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell us about yourself" 
                                    className="resize-none bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white min-h-[120px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-white/50">
                                  Max 280 characters. Briefly describe who you are and what you do.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                      <Input 
                                        placeholder="City, Country" 
                                        {...field} 
                                        className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white pl-10"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Personal Website</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Link2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                      <Input 
                                        placeholder="https://yourwebsite.com" 
                                        {...field} 
                                        className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white pl-10"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="professional" className="m-0 space-y-6">
                        <div className={sectionClasses}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="profession"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Profession/Title</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g. UI Designer, Developer" 
                                      {...field} 
                                      className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company/Organization</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Where you work" 
                                      {...field} 
                                      className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/5 border-white/10 focus:ring-[#0056D2] text-white">
                                      <SelectValue placeholder="Select your experience level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1A1A3A] border-white/10 text-white">
                                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                                    <SelectItem value="1-3">1-3 years</SelectItem>
                                    <SelectItem value="3-5">3-5 years</SelectItem>
                                    <SelectItem value="5-10">5-10 years</SelectItem>
                                    <SelectItem value="10+">10+ years</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-3">
                            <Label htmlFor="skills">Skills & Expertise</Label>
                            <div className="flex flex-wrap gap-2">
                              {(form.getValues("skills") || []).map((skill, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center bg-white/10 rounded-full px-3 py-1 text-sm"
                                >
                                  <span>{skill}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 ml-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                                    onClick={() => {
                                      const currentSkills = form.getValues("skills") || [];
                                      form.setValue(
                                        "skills", 
                                        currentSkills.filter((_, i) => i !== index)
                                      );
                                    }}
                                  >
                                    <span className="sr-only">Remove</span>
                                    <span aria-hidden="true">×</span>
                                  </Button>
                                </div>
                              ))}
                              
                              <Input
                                id="add-skill"
                                placeholder="Add a skill"
                                className="w-32 h-8 bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                                    e.preventDefault();
                                    const currentSkills = form.getValues("skills") || [];
                                    const newSkill = (e.target as HTMLInputElement).value.trim();
                                    form.setValue("skills", [...currentSkills, newSkill]);
                                    (e.target as HTMLInputElement).value = "";
                                  }
                                }}
                              />
                            </div>
                            <p className="text-xs text-white/50">Press Enter to add a skill</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="social" className="m-0 space-y-6">
                        <div className={sectionClasses}>
                          <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">@</div>
                                    <Input 
                                      placeholder="username" 
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
                            name="instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">@</div>
                                    <Input 
                                      placeholder="username" 
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
                            name="linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">linkedin.com/in/</div>
                                    <Input 
                                      placeholder="username" 
                                      {...field} 
                                      className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white pl-32"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="github"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GitHub</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">github.com/</div>
                                    <Input 
                                      placeholder="username" 
                                      {...field} 
                                      className="bg-white/5 border-white/10 focus-visible:ring-[#0056D2] text-white pl-24"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator className="bg-white/10 my-6" />
                        
                        <div className={sectionClasses}>
                          <h3 className="text-lg font-semibold">Privacy & Notifications</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="emailVisibility"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Visibility</FormLabel>
                                    <FormDescription className="text-white/50">
                                      Make your email visible to other users
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <div>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="sr-only"
                                        id="email-visibility"
                                      />
                                      <label
                                        htmlFor="email-visibility"
                                        className={`block w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative cursor-pointer ${
                                          field.value ? "bg-[#0056D2]" : "bg-white/20"
                                        }`}
                                      >
                                        <span
                                          className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${
                                            field.value ? "translate-x-5" : "translate-x-0.5"
                                          }`}
                                        />
                                      </label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="allowMessages"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Allow Messages</FormLabel>
                                    <FormDescription className="text-white/50">
                                      Allow other users to send you messages
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <div>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="sr-only"
                                        id="allow-messages"
                                      />
                                      <label
                                        htmlFor="allow-messages"
                                        className={`block w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative cursor-pointer ${
                                          field.value ? "bg-[#0056D2]" : "bg-white/20"
                                        }`}
                                      >
                                        <span
                                          className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${
                                            field.value ? "translate-x-5" : "translate-x-0.5"
                                          }`}
                                        />
                                      </label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Notifications</FormLabel>
                                    <FormDescription className="text-white/50">
                                      Receive email notifications for messages and updates
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <div>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="sr-only"
                                        id="email-notifications"
                                      />
                                      <label
                                        htmlFor="email-notifications"
                                        className={`block w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative cursor-pointer ${
                                          field.value ? "bg-[#0056D2]" : "bg-white/20"
                                        }`}
                                      >
                                        <span
                                          className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${
                                            field.value ? "translate-x-5" : "translate-x-0.5"
                                          }`}
                                        />
                                      </label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Card3D>
                </Tabs>
                
                <div className="mt-6 flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:from-[#0056D2]/90 hover:to-[#00C49A]/90 text-white rounded-lg gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check size={16} />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Profile</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}