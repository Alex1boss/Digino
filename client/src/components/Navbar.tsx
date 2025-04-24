import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
      className={`glass fixed top-0 left-0 right-0 z-50 py-4 border-b border-white/5 ${
        isScrolled ? "backdrop-blur-lg" : "backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="mr-2 text-[#BB86FC]">
              <Zap size={28} />
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-semibold">
              <span className="text-white">Innventa</span>
              <span className="text-[#BB86FC]">AI</span>
            </h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="transition duration-300 hover:text-[#BB86FC]">
            Home
          </Link>
          <Link href="#products" className="transition duration-300 hover:text-[#BB86FC]">
            Products
          </Link>
          <Link href="#pricing" className="transition duration-300 hover:text-[#BB86FC]">
            Pricing
          </Link>
          <Link href="#blog" className="transition duration-300 hover:text-[#BB86FC]">
            Blog
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="glass transition duration-300 btn-glow text-sm md:text-base rounded-full"
          >
            Discover Tools
          </Button>
          <Button
            className="bg-[#00CFFF]/10 text-[#00CFFF] transition duration-300 btn-glow-blue text-sm md:text-base border-0 rounded-full hover:bg-[#00CFFF]/20"
          >
            Browse Collection
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
