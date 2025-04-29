import { motion } from "framer-motion";
import { ProductCard } from "./ui/product-card";
import { Product } from "../../../shared/schema";
import { Skeleton } from "./ui/skeleton";
import { staggerContainer } from "../lib/utils";
import { Button } from "./ui/button";

interface ProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductsSection({ products, isLoading }: ProductsSectionProps) {
  return (
    <section id="products" className="py-16 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-heading font-semibold text-center mb-16"
        >
          <span className="text-[#BB86FC]">AI-Powered</span> Products Built for You
        </motion.h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="glass rounded-xl p-6 h-full">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-32 ml-3" />
                </div>
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-4 w-1/2 mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 product-grid"
          >
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
              />
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="glass px-6 py-3 rounded-full text-white inline-flex items-center transition duration-300 btn-glow"
          >
            Need Help Choosing?
          </Button>
        </div>
      </div>
    </section>
  );
}
