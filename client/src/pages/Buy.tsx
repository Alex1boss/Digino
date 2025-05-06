import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, DollarSign, Lock, Check, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card3D } from '@/components/ui/3d-card';
import { Badge3D } from '@/components/ui/3d-badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PayPalButton from '@/components/PayPalButton';
import PayPalAuthDialog from '@/components/PayPalAuthDialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/schema';

export default function Buy() {
  const [isPaypalAuthorized, setIsPaypalAuthorized] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [, setLocation] = useLocation();
  const [matched, params] = useRoute('/buy/:id');
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const productId = params?.id || '';

  // Get product data based on URL parameter
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      try {
        console.log("Fetching product for buy page:", productId);
        
        // Fetch product details
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch product ${productId}:`, response.status, response.statusText);
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        console.log("Successfully fetched product data:", data);
        return data as Product;
      } catch (err) {
        console.error("Error fetching product:", err);
        throw err;
      }
    },
    enabled: !!productId,
    retry: 3 // Retry up to 3 times if the request fails
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase",
        variant: "destructive"
      });
      setLocation('/auth');
    } else {
      console.log("User is authenticated, proceeding with purchase");
    }
  }, [isAuthenticated, setLocation, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, the product you're looking for doesn't exist or could not be loaded.</p>
            <button 
              onClick={() => setLocation('/explore')}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setLocation(`/product/${productId}`)}
            className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Product</span>
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-gray-400 mb-10">You're just one step away from owning this premium digital product</p>
          
          <Card3D className="p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Product info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-20 h-20 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.imageUrl || product.coverImage})` }}
                  />
                  <div>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <Badge3D 
                      label={product.category || "Digital Product"}
                      color="#8b5cf6"
                      glowColor="rgba(139, 92, 246, 0.3)"
                      icon={Shield}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-400">Price</span>
                    <span className="font-semibold">${product.price || '59.99'}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-400">License Type</span>
                    <span>{product.category === 'Digital Assets' ? 'Standard' : 'Commercial'}</span>
                  </div>
                  
                  <div className="flex justify-between py-3">
                    <span className="text-gray-400">Total</span>
                    <span className="text-xl font-bold">${product.price || '59.99'}</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Instant digital delivery after payment</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Lifetime access to the product</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>30-day satisfaction guarantee</span>
                  </div>
                </div>
              </div>
              
              {/* Payment section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                
                <div className="relative p-5 rounded-xl border-2 border-blue-500/50 bg-blue-950/30 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="font-bold text-white">P</span>
                      </div>
                      <span className="font-semibold">PayPal</span>
                    </div>
                    <div className="flex items-center bg-white/10 px-2 py-1 rounded-md">
                      <Shield className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-400">Secure</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">
                    Pay securely via PayPal. You can pay with your PayPal account or credit card.
                  </p>
                  
                  <motion.div 
                    className="w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div 
                      id="paypal-button"
                      className="w-full py-3 px-4 bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-blue-600 active:bg-blue-700"
                      onClick={() => {
                        if (!isPaypalAuthorized) {
                          setShowAuthDialog(true);
                        }
                      }}
                    >
                      {isPaypalAuthorized ? (
                        <>
                          <DollarSign className="w-5 h-5" />
                          <span>Pay with PayPal</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Unlock PayPal Payment</span>
                        </>
                      )}
                    </div>
                    
                    <div style={{ display: isPaypalAuthorized ? 'block' : 'none' }}>
                      <PayPalButton 
                        amount={product.price?.toString() || '59.99'} 
                        currency="USD" 
                        intent="CAPTURE" 
                      />
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-green-400 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span>Your payment is protected by PayPal's Buyer Protection Program</span>
                </div>
                
                {/* Direct Buy Now button for improved visibility and access */}
                <motion.button
                  onClick={() => {
                    if (!isPaypalAuthorized) {
                      setShowAuthDialog(true);
                    } else {
                      // Find and trigger the PayPal button
                      const paypalBtn = document.getElementById('paypal-button');
                      if (paypalBtn) {
                        paypalBtn.click();
                      }
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 mt-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Buy Now - ${product.price || '59.99'}</span>
                </motion.button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">By completing this purchase, you agree to our <a href="#" className="text-blue-400 hover:underline">Terms of Service</a></p>
                </div>
              </div>
            </div>
          </Card3D>
          
          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium">Secure Payment</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium">Money-Back Guarantee</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">Trusted by 10,000+ users</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* PayPal Admin Auth Dialog */}
      <PayPalAuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        onSuccess={() => {
          setShowAuthDialog(false);
          setIsPaypalAuthorized(true);
          toast({
            title: "PayPal Access Granted",
            description: "You can now proceed with your payment",
            variant: "default"
          });
          
          // Give a little time for the UI to update before clicking the PayPal button
          setTimeout(() => {
            const paypalBtn = document.getElementById('paypal-button');
            if (paypalBtn) {
              paypalBtn.click();
            }
          }, 500);
        }}
      />
    </div>
  );
}