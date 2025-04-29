import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProductsSection from "../components/ProductsSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../../../shared/schema";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <HeroSection />
        <ProductsSection products={products || []} isLoading={isLoading} />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
