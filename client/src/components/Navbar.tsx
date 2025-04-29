import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 py-4 ${
        isScrolled 
          ? "bg-[#0A0A23]/95 shadow-md backdrop-blur-lg" 
          : "bg-[#0A0A23] backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="mr-2 text-[#4F46E5] bg-[#4F46E5]/10 p-1.5 rounded">
              <Zap size={22} />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold">
              <span className="text-white">Innventa</span>
              <span className="text-[#4F46E5]">AI</span>
            </h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="font-medium transition-colors duration-200 hover:text-[#4F46E5]">
            Home
          </Link>
          <Link href="#products" className="font-medium transition-colors duration-200 hover:text-[#4F46E5]">
            Products
          </Link>
          <Link href="#pricing" className="font-medium transition-colors duration-200 hover:text-[#4F46E5]">
            Pricing
          </Link>
          <Link href="#blog" className="font-medium transition-colors duration-200 hover:text-[#4F46E5]">
            Blog
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-[#4F46E5]/20 text-white font-medium transition duration-200 text-sm md:text-base rounded-lg hover:bg-[#4F46E5]/5"
          >
            Sign In
          </Button>
          <Button
            className="premium-button text-sm md:text-base"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
