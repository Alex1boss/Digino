import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function BuyingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A28] to-[#101035] text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">
          Buy AI Products
        </h1>
        
        <p className="text-lg text-white/80 max-w-md mx-auto">
          Browse and purchase the latest AI-powered tools to enhance your workflow.
        </p>
        
        <div className="flex justify-center my-8">
          <div className="w-24 h-24 text-purple-300">
            <ShoppingCart size={96} strokeWidth={1.5} />
          </div>
        </div>
        
        <Button 
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 py-6 h-auto text-lg font-medium"
        >
          View Shopping Cart
        </Button>
        
        <p className="text-white/60 text-sm">
          Coming soon... full shopping cart functionality
        </p>
      </div>
    </div>
  );
}