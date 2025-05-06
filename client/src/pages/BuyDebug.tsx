import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';

export default function BuyDebug() {
  const [, setLocation] = useLocation();
  const [matched, params] = useRoute('/buy-debug/:id');
  const productId = params?.id || 'none';
  const [debugInfo, setDebugInfo] = useState<any>({
    loading: true,
    productId,
    result: null,
    error: null
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product for debug:", productId);
        
        // Fetch product details
        const response = await fetch(`/api/products/${productId}`);
        const responseData = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: {} // Simplified to avoid TypeScript issues
        };
        
        if (!response.ok) {
          setDebugInfo({
            loading: false,
            productId,
            result: null,
            response: responseData,
            error: `Failed with status: ${response.status}`
          });
          return;
        }
        
        const data = await response.json();
        setDebugInfo({
          loading: false,
          productId,
          result: data,
          response: responseData,
          error: null
        });
      } catch (err: any) {
        setDebugInfo({
          loading: false,
          productId,
          result: null,
          error: err.message || String(err)
        });
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Buy Debug Page</h1>
      <p className="mb-6">Testing route parameters and API calls</p>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Route Info</h2>
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p><span className="text-gray-400">Route matched:</span> {matched ? 'Yes' : 'No'}</p>
          <p><span className="text-gray-400">Product ID:</span> {productId}</p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/buy/1'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
        >
          Test Buy /1
        </button>
        
        <button 
          onClick={() => setLocation('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-2">API Result</h2>
        {debugInfo.loading ? (
          <p>Loading...</p>
        ) : debugInfo.error ? (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg">
            <p className="text-red-400 font-bold">Error:</p>
            <pre className="whitespace-pre-wrap text-sm mt-2">{debugInfo.error}</pre>
            
            {debugInfo.response && (
              <div className="mt-4">
                <p className="text-red-400 font-bold">Response:</p>
                <pre className="whitespace-pre-wrap text-sm mt-2">
                  {JSON.stringify(debugInfo.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg mb-4">
              <p className="text-green-400 font-bold">Success!</p>
              <p className="mt-2"><span className="text-gray-400">Product Name:</span> {debugInfo.result?.name}</p>
              <p><span className="text-gray-400">Price:</span> ${debugInfo.result?.price}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px]">
              <pre className="text-xs">{JSON.stringify(debugInfo.result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}