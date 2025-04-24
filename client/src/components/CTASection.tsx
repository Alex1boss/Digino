import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6 text-shadow-glow">
            Ready to Transform Your Digital Experience?
          </h2>
          
          <p className="text-[#A0A0A0] mb-10">
            Join thousands of creators and businesses using InnventaAI to build the next generation of digital products.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="w-full sm:w-auto px-8 py-7 rounded-full bg-[#BB86FC]/90 text-white font-medium transition duration-300 hover:bg-[#BB86FC] btn-glow border-0"
            >
              Start Creating Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-7 rounded-full glass text-white font-medium transition duration-300 hover:bg-white/10 border-white/10"
            >
              Book a Demo
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >
            {[
              "Free 14-day trial",
              "No credit card required",
              "Cancel anytime"
            ].map((feature, index) => (
              <div key={index} className="glass px-4 py-3 rounded-full flex items-center">
                <Check className="w-5 h-5 text-[#BB86FC] mr-2" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
