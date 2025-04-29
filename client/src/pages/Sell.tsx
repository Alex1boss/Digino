import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { 
  Tag, ChevronRight, ArrowRight, Upload, Wand, 
  DollarSign, Timer, Gift, FileCheck, Zap, Search,
  CheckCircle, TrendingUp, Award, Rocket, Save, Eye,
  ShieldCheck, Calendar, AlertCircle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm3D from "@/components/ProductForm3D";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
    metaDescription: ""
  });
  
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
              
              <div className="p-6 border border-dashed border-white/20 rounded-xl text-center">
                <Upload className="mx-auto text-white/40 mb-3 w-10 h-10" />
                <p className="text-white/60 mb-4">Drag and drop your product file or click to browse</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white/80"
                >
                  Browse Files
                </motion.button>
                <p className="text-white/40 text-xs mt-3">Supported formats: PDF, ZIP, AI, EPUB, MP4 (max 1GB)</p>
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
                  <div>
                    <h3 className="text-white font-medium">Personal Use</h3>
                    <p className="text-white/60 text-sm mt-1">
                      Buyer can use the product for personal projects only. Cannot be used in commercial projects or products.
                    </p>
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
                  <div>
                    <h3 className="text-white font-medium">Commercial Use</h3>
                    <p className="text-white/60 text-sm mt-1">
                      Buyer can use the product in commercial projects and products with a single end product for sale.
                    </p>
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
                  <div>
                    <h3 className="text-white font-medium">Extended Commercial</h3>
                    <p className="text-white/60 text-sm mt-1">
                      Buyer can use the product in unlimited commercial projects and products, including redistributable products.
                    </p>
                  </div>
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
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.2)" }}
                  className="flex flex-col items-center justify-center p-6 border border-[#4F46E5] rounded-xl bg-gradient-to-b from-[#4F46E5]/10 to-transparent"
                >
                  <Rocket className="text-[#4F46E5] mb-3 w-8 h-8" />
                  <h3 className="text-white font-medium mb-1">Publish Now</h3>
                  <p className="text-white/60 text-xs text-center">Make your product live immediately</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(255, 255, 255, 0.05)" }}
                  className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl"
                >
                  <Save className="text-white/80 mb-3 w-8 h-8" />
                  <h3 className="text-white font-medium mb-1">Save Draft</h3>
                  <p className="text-white/60 text-xs text-center">Continue editing later</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(255, 255, 255, 0.05)" }}
                  className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl"
                >
                  <Eye className="text-white/80 mb-3 w-8 h-8" />
                  <h3 className="text-white font-medium mb-1">Preview</h3>
                  <p className="text-white/60 text-xs text-center">See how it looks first</p>
                </motion.div>
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
                  onClick={handleBackToIntro}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-medium relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Publish Product</span>
                </motion.button>
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
      </div>
    </div>
  );
}