import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute -top-40 right-0 w-96 h-96 bg-[#BB86FC]/5 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="md:col-span-1">
                <div className="flex items-center mb-6">
                  <div className="mr-2 text-[#BB86FC]">
                    <Zap size={28} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">
                    <span className="text-white">Innventa</span><span className="text-[#BB86FC]">AI</span>
                  </h3>
                </div>
                
                <p className="text-sm text-[#A0A0A0] mb-6">
                  Building the future of digital products with AI-powered tools for creators and businesses.
                </p>
                
                <div className="flex space-x-4">
                  <a href="#" className="text-[#A0A0A0] hover:text-white transition">
                    <FaTwitter />
                  </a>
                  <a href="#" className="text-[#A0A0A0] hover:text-white transition">
                    <FaInstagram />
                  </a>
                  <a href="#" className="text-[#A0A0A0] hover:text-white transition">
                    <FaLinkedin />
                  </a>
                  <a href="#" className="text-[#A0A0A0] hover:text-white transition">
                    <FaGithub />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-heading font-medium mb-4">Products</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">AI Automation</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Website Templates</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Illustration Kits</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Startup Resources</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Voice Assistants</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-heading font-medium mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">About Us</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Careers</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Blog</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Pricing</a></li>
                  <li><a href="#" className="text-[#A0A0A0] hover:text-white transition text-sm">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-heading font-medium mb-4">Subscribe</h4>
                <p className="text-sm text-[#A0A0A0] mb-4">Get the latest updates and offers directly to your inbox.</p>
                
                <form className="mb-4">
                  <div className="flex">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="bg-white/10 border border-white/10 rounded-l-lg px-4 py-2 w-full text-sm focus:outline-none focus:border-[#BB86FC]/50 rounded-r-none"
                    />
                    <Button 
                      type="submit" 
                      className="bg-[#BB86FC] hover:bg-[#BB86FC]/90 text-white rounded-l-none rounded-r-lg text-sm"
                    >
                      Subscribe
                    </Button>
                  </div>
                </form>
                
                <p className="text-xs text-[#A0A0A0]">
                  By subscribing, you agree to our <a href="#" className="text-[#BB86FC] hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-[#A0A0A0] mb-4 md:mb-0">
                &copy; 2023 InnventaAI. All rights reserved.
              </p>
              
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-[#A0A0A0] hover:text-white transition">Terms</a>
                <a href="#" className="text-sm text-[#A0A0A0] hover:text-white transition">Privacy</a>
                <a href="#" className="text-sm text-[#A0A0A0] hover:text-white transition">Cookies</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
