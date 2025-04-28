import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

interface ProductForm3DProps {
  onBack?: () => void;
}

export default function ProductForm3D({ onBack }: ProductForm3DProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: ""
  });
  
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    console.log("Form submitted:", formData);
    
    // Reset after animation
    setTimeout(() => {
      setFormSubmitted(false);
      // Success message or redirect could be added here
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
              type="button"
              onClick={onBack}
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
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
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
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
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
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
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
              
              <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left text-white/60 text-sm flex items-center">
                  <Shield size={16} className="text-[#22C55E] mr-2" />
                  <span>Secure submission with data encryption</span>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <motion.button
                    type="button"
                    onClick={onBack}
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