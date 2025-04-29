import { motion } from "framer-motion";
import { cn, fadeIn } from "../lib/utils";
import { Check, CpuIcon } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 md:p-12 relative overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#BB86FC]/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#00CFFF]/10 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
                Powerful AI Technology<br />
                <span className="text-[#BB86FC]">Simplified For Everyone</span>
              </h2>
              
              <p className="text-[#A0A0A0] mb-8">
                Our AI tools transform complex processes into intuitive workflows that anyone can use. 
                No technical expertise required—just your creativity and ideas.
              </p>
              
              <motion.ul 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    title: "No-Code Solutions",
                    description: "Build and launch without writing a single line of code"
                  },
                  {
                    title: "Intelligent Automation",
                    description: "Let AI handle repetitive tasks while you focus on what matters"
                  },
                  {
                    title: "Custom Integration",
                    description: "Seamlessly connect with your existing tools and workflows"
                  }
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    variants={fadeIn("left", "spring", index * 0.2, 0.75)}
                    className="flex items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#BB86FC]/20 flex items-center justify-center text-[#BB86FC] flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-[#A0A0A0] mt-1">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
              className="md:w-1/2 relative"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut" 
                }}
                className="glass rounded-xl p-6 md:p-8 max-w-md mx-auto"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#00CFFF] bg-[#00CFFF]/10">
                    <CpuIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl ml-3 font-heading font-medium">AI Processing Demo</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="glass bg-white/5 rounded-lg p-4">
                    <p className="text-sm">Input: "Create a landing page for my fitness app"</p>
                  </div>
                  
                  <div className="flex items-center justify-center my-2">
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center animate-pulse">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#BB86FC]">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="glass bg-white/5 rounded-lg p-4 border border-[#BB86FC]/20">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium text-[#BB86FC]">Processing complete</p>
                      <span className="text-xs bg-[#BB86FC]/20 text-[#BB86FC] px-2 py-1 rounded-full">98% match</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-[#A0A0A0]">Generated 3 template options with customized:</p>
                      <ul className="text-xs text-[#A0A0A0] list-disc ml-4 space-y-1">
                        <li>Color schemes based on fitness industry trends</li>
                        <li>Mobile-responsive layouts</li>
                        <li>Workout tracking components</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 rounded-lg bg-[#00CFFF]/90 text-white text-sm font-medium transition hover:bg-[#00CFFF]">
                    View Results
                  </button>
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00CFFF]/5 rounded-full filter blur-3xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
