import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { slideIn, fadeIn, textVariant } from "../lib/utils";
import { Badge } from "./ui/badge";
import { ShieldCheck, Star, CreditCard, Users } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="min-h-[85vh] flex items-center relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#BB86FC]/10 via-black/40 to-transparent"></div>
      
      {/* Premium decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#BB86FC]/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute -top-8 -right-8 w-72 h-72 bg-[#00CFFF]/10 rounded-full filter blur-3xl"></div>
      <div className="absolute top-1/4 right-1/3 w-36 h-36 bg-[#03DAC5]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#CF6679]/10 rounded-full filter blur-3xl"></div>
      
      {/* Grid overlay for futuristic feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjIiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium badge */}
          <motion.div
            variants={fadeIn("down", "tween", 0.1, 0.5)}
            initial="hidden"
            animate="show"
            className="mb-6 flex justify-center"
          >
            <Badge className="px-4 py-1.5 rounded-full bg-[#BB86FC]/20 text-[#BB86FC] border border-[#BB86FC]/30 backdrop-blur-sm">
              Premium Digital Marketplace
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={textVariant(0.2)}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 text-shadow-glow"
          >
            Discover & Sell <br />
            <span className="text-gradient bg-gradient-to-r from-[#BB86FC] via-[#03DAC5] to-[#00CFFF] bg-clip-text text-transparent">
              Premium Digital Assets
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn("up", "tween", 0.3, 0.7)}
            initial="hidden"
            animate="show"
            className="text-lg md:text-xl text-[#B0B0B0] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A secure marketplace for creators to sell and buyers to discover high-quality 
            digital products, templates, courses, and more.
          </motion.p>
          
          <motion.div 
            variants={slideIn("up", "tween", 0.5, 0.7)}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/explore">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-7 rounded-full bg-gradient-to-r from-[#BB86FC] to-[#3700B3] text-white font-medium transition duration-300 hover:shadow-lg hover:shadow-[#BB86FC]/20 btn-glow border-0"
              >
                Explore Products
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-7 rounded-full glass text-white font-medium transition duration-300 hover:bg-white/10 border-white/10 hover:border-white/20"
              >
                Start Selling
              </Button>
            </Link>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            variants={fadeIn("up", "tween", 0.7, 0.7)}
            initial="hidden"
            animate="show"
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
          >
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-6 h-6 text-[#03DAC5] mb-2" />
              <h3 className="text-white font-medium">Secure Transactions</h3>
              <p className="text-sm text-[#A0A0A0]">All payments protected</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Star className="w-6 h-6 text-[#BB86FC] mb-2" />
              <h3 className="text-white font-medium">Verified Sellers</h3>
              <p className="text-sm text-[#A0A0A0]">Quality guaranteed</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <CreditCard className="w-6 h-6 text-[#00CFFF] mb-2" />
              <h3 className="text-white font-medium">Multiple Payment Options</h3>
              <p className="text-sm text-[#A0A0A0]">Pay your way</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Users className="w-6 h-6 text-[#CF6679] mb-2" />
              <h3 className="text-white font-medium">10K+ Users</h3>
              <p className="text-sm text-[#A0A0A0]">Growing community</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
