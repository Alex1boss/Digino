import React from "react";
import { Button } from "@/components/ui/button";
import { Laptop } from "lucide-react";
import { Link } from "wouter";

export default function BuyingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A28] to-[#101035] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00C49A] to-[#7C96FF]">
            Premium Shopping Experience
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Discover unique digital products created by talented innovators from around the world.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
            <p className="text-white/70 mb-6">Explore our curated selection of premium digital assets.</p>
            <Link href="/explore">
              <Button className="bg-gradient-to-r from-[#00C49A] to-[#7C96FF] hover:opacity-90">
                <Laptop className="mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4">Sell Your Creations</h2>
            <p className="text-white/70 mb-6">List your digital products and reach global customers.</p>
            <Link href="/sell">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-6">Why Choose Innventa AI Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Laptop className="h-12 w-12 mb-4 text-[#00C49A]" />
              <h3 className="text-xl font-medium mb-2">Premium Quality</h3>
              <p className="text-white/70">Carefully vetted products that meet the highest standards</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Laptop className="h-12 w-12 mb-4 text-[#7C96FF]" />
              <h3 className="text-xl font-medium mb-2">AI-Powered</h3>
              <p className="text-white/70">Intelligent recommendations based on your preferences</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Laptop className="h-12 w-12 mb-4 text-[#BB86FC]" />
              <h3 className="text-xl font-medium mb-2">Secure Transactions</h3>
              <p className="text-white/70">Safe and reliable payment processing system</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/explore">
            <Button size="lg" className="bg-gradient-to-r from-[#00C49A] to-[#7C96FF] hover:opacity-90">
              Explore All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}