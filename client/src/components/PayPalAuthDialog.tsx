import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, ShieldCheck } from 'lucide-react';

interface PayPalAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayPalAuthDialog({ 
  isOpen, 
  onClose, 
  onSuccess 
}: PayPalAuthDialogProps) {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter the admin password to access PayPal functionality",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/paypal-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminPassword: password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      toast({
        title: "Authentication Successful",
        description: "You now have access to PayPal functionality",
        variant: "default"
      });
      
      onSuccess();
      
    } catch (error) {
      console.error('PayPal authorization error:', error);
      
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Invalid password",
        variant: "destructive"
      });
      
    } finally {
      setIsSubmitting(false);
      setPassword('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <DialogTitle className="text-xl text-center">PayPal Access Required</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Enter the admin password to access PayPal payment functionality.
            This helps protect your PayPal integration from unauthorized use.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="bg-gray-900 border-gray-700 text-white"
              autoComplete="off"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-blue-950/30 p-3 rounded-lg border border-blue-900/50">
            <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p>For security, this password is different from your login password and protects access to payment processing.</p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 hover:bg-gray-800 text-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Authorize Access'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}