import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { slideIn, fadeIn, textVariant } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#BB86FC]/5 to-transparent"></div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#BB86FC]/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -top-8 -right-8 w-72 h-72 bg-[#00CFFF]/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            variants={textVariant(0.1)}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-semibold mb-6 text-shadow-glow"
          >
            Welcome to the Future<br />
            <span className="text-gradient">
              of Digital Innovation
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn("up", "tween", 0.3, 0.7)}
            initial="hidden"
            animate="show"
            className="text-lg md:text-xl text-[#A0A0A0] mb-10 max-w-2xl mx-auto"
          >
            Smart tools, powered by AI. Built for creators, devs,<br className="hidden md:block" />
            and dreamers.
          </motion.p>
          
          <motion.div 
            variants={slideIn("up", "tween", 0.5, 0.7)}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-7 rounded-full bg-[#BB86FC]/90 text-white font-medium transition duration-300 hover:bg-[#BB86FC] btn-glow border-0"
            >
              Explore Products
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-7 rounded-full glass text-white font-medium transition duration-300 hover:bg-white/10 border-white/10"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
