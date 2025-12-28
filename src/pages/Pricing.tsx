import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Lock, Timer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DodoPayments } from 'dodopayments-checkout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Pricing: React.FC = () => {
  const { profile, activateTrial, user } = useApp();
  const pricingPageEnabled = useFeatureFlag('pricing_page_enabled');
  const navigate = useNavigate();
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  if (!pricingPageEnabled) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
                <h1 className="text-2xl font-bold">Pricing coming soon!</h1>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        </div>
    );
  }

  const handleYearlyUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          productId: 'pdt_0NV36FeTxOWDylUeDQQQS',
          customerEmail: user?.email || '',
          returnUrl: window.location.href,
        }
      });

      if (error) throw error;
      
      if (data?.checkout_url) {
        DodoPayments.Checkout.open({
          checkoutUrl: data.checkout_url,
        });
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

  const hasUsedTrial = !!profile?.trial_end_date;
  const isTrialActive = profile?.subscription_status === 'trialing';
  const isPremium = profile?.subscription_status === 'active';

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
            Premium Access
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Elevate Your Coding Skills
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Master algorithm patterns with high-quality interactive visualizations and expert problem-solving strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Free Tier / Trial */}
          <Card className="glass-card bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Free Trial
              </CardTitle>
              <CardDescription>Experience full premium features for 10 days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/10 days</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Access all Blind 75 problems",
                  "Unlock premium visualizations",
                  "Expert strategy breakdowns",
                  "Save your progress",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={isTrialActive ? "outline" : "default"}
                disabled={hasUsedTrial || isPremium}
                onClick={activateTrial}
              >
                {hasUsedTrial ? "Trial Used" : isTrialActive ? "Trial Active" : "Start 10-Day Free Trial"}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Yearly */}
          <Card className="glass-card bg-card/60 backdrop-blur-xl border-primary/40 shadow-2xl shadow-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
              <Crown className="w-6 h-6 text-primary animate-pulse" />
            </div>
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Premium Pro
              </CardTitle>
              <CardDescription>Lifetime mastery with our yearly plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Everything in Trial",
                  "NEW algorithms added weekly",
                  "Priority support",
                  "Advanced interview prep paths",
                  "Early access to new features",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                disabled={isPremium || isUpgrading}
                onClick={handleYearlyUpgrade}
              >
                {isUpgrading ? "Starting Checkout..." : isPremium ? "Active Subscription" : "Upgrade to Pro"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-20 text-center">
            <h3 className="text-xl font-semibold mb-8 flex items-center justify-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                <div className="p-4 rounded-xl bg-card/30 border border-border/40">
                    <p className="font-semibold mb-2">Can I cancel my subscription?</p>
                    <p className="text-sm text-muted-foreground">Yes, you can cancel at any time through your profile settings.</p>
                </div>
                <div className="p-4 rounded-xl bg-card/30 border border-border/40">
                    <p className="font-semibold mb-2">What happens after 10 days?</p>
                    <p className="text-sm text-muted-foreground">You will lose access to premium content but keep your solved status on core patterns.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
