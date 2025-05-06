import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronLeft, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card3D } from '@/components/ui/3d-card';
import { Product } from '@/schema';
import { motion } from 'framer-motion';
import PayPalButton from '@/components/PayPalButton';
import { useAuth } from '@/hooks/use-auth';

export default function CheckoutPage() {
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [, setLocation] = useLocation();
  const [matched, params] = useRoute('/checkout/:id');
  const { isAuthenticated, user } = useAuth();
  const productId = params?.id || '';

  // Get product data based on URL parameter
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      try {
        console.log("Fetching product for checkout:", productId);
        
        // Fetch product details
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        return await response.json() as Product;
      } catch (err) {
        console.error("Error fetching product:", err);
        throw err;
      }
    },
    enabled: !!productId
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, setLocation]);

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
        <button 
          onClick={() => setLocation(`/product/${productId}`)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Product</span>
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <Card3D className="p-6 rounded-2xl mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="flex gap-4 mb-6">
                <div 
                  className="w-24 h-24 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.imageUrl || product.coverImage})` }}
                ></div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.licenseType || 'Standard'} License</p>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-400">Digital Download</span>
                    </div>
                    <span className="font-semibold">${product.price || '59.99'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${product.price || '59.99'}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Processing Fee</span>
                  <span>$0.00</span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-800">
                  <span>Total</span>
                  <span>${product.price || '59.99'}</span>
                </div>
              </div>
            </Card3D>
            
            <Card3D className="p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Your Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                    {user?.fullName || user?.username || 'User'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Check className="w-4 h-4 text-green-500" />
                <span>Purchase as a business gift</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-500" />
                <span>I agree to the <a href="#" className="text-purple-400 hover:underline">terms and conditions</a></span>
              </div>
            </Card3D>
          </div>
          
          {/* Payment section */}
          <div className="lg:col-span-1">
            <Card3D className="p-6 rounded-2xl sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              
              <div className="space-y-6">
                {/* PayPal payment option */}
                <div className="relative p-5 rounded-xl border-2 border-blue-500/50 bg-blue-950/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="font-bold text-white">P</span>
                    </div>
                    <span className="font-semibold">PayPal</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-6">
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
                      >
                        <DollarSign className="w-5 h-5" />
                        <span>Pay with PayPal</span>
                      </div>
                      
                      <div style={{ display: 'none' }}>
                        <PayPalButton 
                          amount={product.price?.toString() || '59.99'} 
                          currency="USD" 
                          intent="CAPTURE" 
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  <p className="flex items-start gap-2 mb-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Secure payment processing</span>
                  </p>
                  
                  <p className="flex items-start gap-2 mb-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>Instant digital delivery after payment</span>
                  </p>
                  
                  <p className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>30-day satisfaction guarantee</span>
                  </p>
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}