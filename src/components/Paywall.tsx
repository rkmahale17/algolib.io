import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { DodoPayments } from 'dodopayments-checkout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaywallProps {
  onUpgrade?: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onUpgrade }) => {
  const { user } = useApp();
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          productId: 'pdt_0NV36FeTxOWDylUeDQQQS',
          customerEmail: user?.email || '',
        }
      });

      if (error) throw error;
      
      if (data?.checkout_url) {
        DodoPayments.Checkout.open({
          checkoutUrl: data.checkout_url,
        });
        if (onUpgrade) onUpgrade();
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 bg-background/50 backdrop-blur-md relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-xl w-full bg-card/40 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-primary/10 p-4 rounded-2xl ring-1 ring-primary/20 animate-pulse">
            <Crown className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              Unlock Premium Patterns
            </h2>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Master the most advanced algorithms and ace your technical interviews with full access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full py-6">
            {[
              "Complete Blind 75 List",
              "Advanced Visualizations",
              "Video Tutorials (Coming Soon)",
              "Priority Support",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4">
             <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">Yearly Plan</p>
                  <p className="text-2xl font-bold">$29.99<span className="text-sm text-muted-foreground font-normal">/year</span></p>
                </div>
                <div className="text-right">
                  <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">Save 40%</span>
                </div>
             </div>
             <Button 
                className="w-full h-12 text-lg font-bold gap-2 group shadow-lg shadow-primary/20" 
                onClick={handleUpgrade}
                disabled={isUpgrading}
             >
                {isUpgrading ? "Loading..." : "Upgrade Now"}
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Button>
             <p className="text-[10px] text-muted-foreground">
               Secure payment powered by Dodo Payments. Cancel anytime.
             </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-60">
             <Lock className="w-3 h-3" />
             <span>Access restricted content immediately after payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
