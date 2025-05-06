import React from "react";
import { ShoppingCart, PackageOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BuyingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Digital Marketplace
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Discover and purchase high-quality AI tools, digital assets, and more.
          </p>
          
          <div className="bg-[#1A1A3A] rounded-xl p-8 mb-12 shadow-lg border border-[#4F46E5]/20">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 text-[#4F46E5]">
                <ShoppingCart size={96} strokeWidth={1.5} />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Shopping Cart
            </h2>
            
            <p className="text-white/60 mb-8">
              Your cart is currently empty. Browse our marketplace to find digital products.
            </p>
            
            <button className="bg-gradient-to-r from-[#4F46E5] to-[#8A84FA] text-white font-medium py-3 px-8 rounded-full hover:opacity-90 transition-all">
              Explore Products
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1A1A3A] rounded-xl p-6 shadow-lg border border-[#4F46E5]/20">
              <PackageOpen className="w-12 h-12 text-[#4F46E5] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Recent Purchases</h3>
              <p className="text-white/60">
                You haven't made any purchases yet. Start shopping to see your order history here.
              </p>
            </div>
            
            <div className="bg-[#1A1A3A] rounded-xl p-6 shadow-lg border border-[#4F46E5]/20">
              <ShoppingCart className="w-12 h-12 text-[#4F46E5] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Saved Items</h3>
              <p className="text-white/60">
                Add items to your wishlist to save them for later purchase.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}