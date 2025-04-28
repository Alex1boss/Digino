import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, UploadCloud, Check } from "lucide-react";

export default function ProductForm3D() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  const handleImageUpload = () => {
    setImageUploaded(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Reset after animation
    setTimeout(() => {
      setFormSubmitted(false);
    }, 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto relative z-10"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#4F46E5]/10 to-transparent blur-3xl rounded-3xl"></div>
      
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        className="relative w-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 overflow-hidden"
        style={{
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
        }}
      >
        {/* Glassmorphism shine effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
          <div 
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-white/5 to-transparent transform rotate-45"
            style={{
              animation: "shine 8s infinite"
            }}
          ></div>
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
              transform: "translateX(-100%)",
              animation: "shine-form 3s ease-in-out infinite alternate"
            }}
          ></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mr-4 p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5]"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Add New Product
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Product Title</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'title' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="Enter your product name"
                    onFocus={() => handleFocus('title')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  {focusedField === 'title' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Category</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'category' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 appearance-none"
                    onFocus={() => handleFocus('category')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <option value="" className="bg-[#0A0A23] text-white">Select a category</option>
                    <option value="ai_tools" className="bg-[#0A0A23] text-white">AI Tools</option>
                    <option value="data_analytics" className="bg-[#0A0A23] text-white">Data Analytics</option>
                    <option value="automation" className="bg-[#0A0A23] text-white">Automation</option>
                    <option value="content_generation" className="bg-[#0A0A23] text-white">Content Generation</option>
                  </select>
                  {focusedField === 'category' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Price */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Price</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'price' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 text-white/50">
                    $
                  </div>
                  <input
                    type="text"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="0.00"
                    onFocus={() => handleFocus('price')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  {focusedField === 'price' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Short Description</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'description' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <textarea
                    className="w-full h-24 p-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 resize-none"
                    placeholder="Describe your product in a few sentences"
                    onFocus={() => handleFocus('description')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  ></textarea>
                  {focusedField === 'description' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              <div className="premium-divider my-8"></div>
              
              {/* Seller Information */}
              <div className="flex items-center mb-6">
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Seller Information
                </h3>
                <div className="flex items-center ml-3 text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-1 rounded-full text-xs">
                  <Shield size={12} className="mr-1" />
                  <span>Verified Status</span>
                </div>
              </div>
              
              {/* Seller Name */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Seller Name</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'sellerName' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="Your name or company name"
                    onFocus={() => handleFocus('sellerName')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  {focusedField === 'sellerName' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Profile Image</label>
                <div className="flex items-center">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-4 overflow-hidden"
                    animate={imageUploaded ? { rotate: 360 } : {}}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    {imageUploaded ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center">
                        <Check size={24} className="text-white" />
                      </div>
                    ) : (
                      <div className="text-white/40">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor" fillOpacity="0.5"/>
                          <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" fillOpacity="0.5"/>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.button 
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 flex items-center"
                    onClick={handleImageUpload}
                  >
                    <UploadCloud size={16} className="mr-2" />
                    {imageUploaded ? "Change Image" : "Upload Image"}
                  </motion.button>
                </div>
              </div>
              
              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Seller Bio</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'bio' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <textarea
                    className="w-full h-20 p-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 resize-none"
                    placeholder="Tell us about yourself or your company"
                    onFocus={() => handleFocus('bio')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  ></textarea>
                  {focusedField === 'bio' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Seller Website */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Website (Optional)</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'website' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10"
                    placeholder="https://example.com"
                    onFocus={() => handleFocus('website')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  {focusedField === 'website' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Location */}
              <div className="space-y-2">
                <label className="block text-white/80 font-medium pl-1">Location</label>
                <motion.div
                  whileHover={{ y: -2 }}
                  animate={focusedField === 'location' ? { 
                    boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.4), 0 2px 8px rgba(79, 70, 229, 0.2)" 
                  } : {}}
                  className="relative"
                >
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner transition-all duration-200 focus:outline-none focus:border-[#4F46E5]/40 focus:bg-white/10 appearance-none"
                    onFocus={() => handleFocus('location')}
                    onBlur={handleBlur}
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <option value="" className="bg-[#0A0A23] text-white">Select your location</option>
                    <option value="us" className="bg-[#0A0A23] text-white">United States</option>
                    <option value="ca" className="bg-[#0A0A23] text-white">Canada</option>
                    <option value="uk" className="bg-[#0A0A23] text-white">United Kingdom</option>
                    <option value="eu" className="bg-[#0A0A23] text-white">Europe</option>
                    <option value="asia" className="bg-[#0A0A23] text-white">Asia</option>
                    <option value="other" className="bg-[#0A0A23] text-white">Other</option>
                  </select>
                  {focusedField === 'location' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.2)",
                        zIndex: -1
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </div>
              
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left text-white/60 text-sm flex items-center">
                  <Shield size={16} className="text-[#22C55E] mr-2" />
                  <span>Secure submission with data encryption</span>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white/80 flex-1 md:flex-initial"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium flex-1 md:flex-initial relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                    }}
                    whileTap={{ scale: 0.97 }}
                    animate={formSubmitted ? { scale: [1, 0.95, 1.03, 1] } : {}}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut" 
                    }}
                  >
                    <span className="relative z-10">Submit Product</span>
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      animate={formSubmitted ? { x: ["100%", "0%"] } : {}}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}