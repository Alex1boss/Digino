import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="premium-card p-12 rounded-2xl text-center max-w-3xl mx-auto border-[#4F46E5]/10"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
            Ready to Transform Your Digital Experience?
          </h2>
          
          <p className="text-[#6B7280] mb-10 max-w-2xl mx-auto">
            Discover the most innovative AI-powered tools and products in the InnventaAI marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg"
                className="w-full sm:w-auto px-8 py-6 premium-button"
              >
                Explore Products
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto" 
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 rounded-lg bg-transparent border-[#4F46E5]/20 text-[#4F46E5] font-semibold hover:bg-[#4F46E5]/5"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
          
          <div className="premium-divider my-10"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              "Free 14-day trial",
              "No credit card required",
              "Cancel anytime"
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white/5 px-4 py-3 rounded-full flex items-center border border-[#4F46E5]/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-5 h-5 text-[#22C55E] mr-2" />
                <span className="text-sm text-[#6B7280]">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
