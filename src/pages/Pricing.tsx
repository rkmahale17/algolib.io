import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { DodoPayments } from 'dodopayments-checkout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { pricingData } from '@/data/pricing-data';

const Pricing: React.FC = () => {
  const { profile, user } = useApp();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const handleUpgrade = async (productId: string) => {
    try {
      setIsUpgrading(true);
      setActivePlanId(productId);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          productId: productId,
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
      setActivePlanId(null);
    }
  };

  const isPremium = profile?.subscription_status === 'active';

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 px-4 font-sans text-foreground">
      <div className="container mx-auto max-w-6xl">

        {/* Header Section */}
        <div className="text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl text-foreground mt-4">
            Save time, ace interviews, and secure high-paying roles
          </h1>
        </div>

        {/* Lifetime Plan Card */}
        <div className="mb-8 border border-border rounded-2xl bg-card overflow-hidden">
          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">

            {/* Left Side */}
            <div className="md:w-[45%] lg:w-1/3 flex flex-col items-start gap-4 border-b md:border-b-0 md:border-r border-border pb-8 md:pb-0 md:pr-10">
              <div className="w-full flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{pricingData.lifetimePlan.title}</span>
                {pricingData.lifetimePlan.badge && (
                  <span className="bg-[#eefadc] text-[#558600] text-xs px-3 py-1 rounded-full font-medium">
                    {pricingData.lifetimePlan.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                {pricingData.lifetimePlan.originalPrice && (
                  <div className="text-muted-foreground text-sm line-through">
                    {pricingData.lifetimePlan.originalPrice} {pricingData.lifetimePlan.periodSubLabel}
                    {pricingData.lifetimePlan.discountText && ` ${pricingData.lifetimePlan.discountText}`}
                  </div>
                )}
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-5xl font-semibold tracking-tight">{pricingData.lifetimePlan.price}</span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {pricingData.lifetimePlan.period}
                  </span>
                </div>
              </div>

              <div className="mt-auto w-full pt-8">
                <Button
                  className="w-full bg-[#dcf65b] hover:bg-[#cbf056] text-black font-semibold rounded-full py-6 text-lg"
                  onClick={() => handleUpgrade(pricingData.lifetimePlan.productId)}
                  disabled={isUpgrading || isPremium}
                >
                  {isUpgrading && activePlanId === pricingData.lifetimePlan.productId ? "Processing..." : pricingData.lifetimePlan.buttonText}
                </Button>
              </div>
            </div>

            {/* Right Side */}
            <div className="md:w-[55%] lg:w-2/3 flex flex-col justify-center">
              <h3 className="font-semibold text-lg mb-6 pr-4 leading-tight">
                Get full access to the interviews platform forever, including future updates and new content
              </h3>
              <ul className="space-y-4 mb-8">
                {pricingData.lifetimePlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature} <Info className="inline w-4 h-4 ml-1 opacity-50" /></span>
                  </li>
                ))}
              </ul>

              {pricingData.lifetimePlan.includedForFree && (
                <div className="pt-6 border-t border-border mt-auto">
                  <div className="text-sm text-muted-foreground mb-3 font-medium">Included for free</div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 group cursor-default">
                    <div className="flex gap-4 items-center">
                      <div className="bg-[#ee3e54] text-white font-bold px-2 py-1 rounded text-sm min-w-12 text-center shadow-sm">
                        FTL
                      </div>
                      <div className="text-sm font-medium pr-4 leading-tight group-hover:text-primary transition-colors">
                        {pricingData.lifetimePlan.includedForFree.title}
                      </div>
                    </div>
                    <div className="sm:ml-auto pl-[4.5rem] sm:pl-0 font-semibold text-lg whitespace-nowrap">
                      {pricingData.lifetimePlan.includedForFree.value}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {pricingData.subscriptionPlans.map((plan) => (
            <div key={plan.id} className="border border-border rounded-2xl bg-card p-8 flex flex-col relative group hover:border-border/80 transition-all">
              {plan.badge && (
                <div className="absolute -top-[14px] right-6 bg-[#dcf65b] text-[#558600] text-[10px] tracking-wider font-bold px-2 py-1.5 rounded shadow-sm uppercase z-10">
                  {plan.badge}
                </div>
              )}

              <div className="font-semibold text-lg mb-4">{plan.title}</div>

              <div className="flex flex-col gap-1 min-h-[72px]">
                {plan.originalPrice ? (
                  <div className="text-muted-foreground text-sm line-through">
                    {plan.originalPrice} {plan.period} {plan.discountText}
                  </div>
                ) : (
                  <div className="h-5"></div>
                )}

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground font-medium text-sm">{plan.period}</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-8 mt-2 h-5">
                {plan.periodSubLabel}
              </div>

              <Button
                variant="outline"
                className="w-full rounded-full py-6 font-semibold mb-8 hover:bg-muted"
                onClick={() => handleUpgrade(plan.productId)}
                disabled={isUpgrading || isPremium}
              >
                {isUpgrading && activePlanId === plan.productId ? "Processing..." : plan.buttonText}
              </Button>

              <ul className="space-y-4 mb-auto">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-snug">{feature} <Info className="inline w-3.5 h-3.5 ml-1 opacity-40 hover:opacity-100 cursor-help" /></span>
                  </li>
                ))}
              </ul>

              {plan.includedForFree && (
                <div className="pt-6 border-t border-border mt-8">
                  <div className="text-xs text-muted-foreground mb-3 font-medium">Included for free</div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#ee3e54] text-white font-bold px-1.5 py-0.5 rounded text-xs min-w-9 text-center shadow-sm">
                      FTL
                    </div>
                    <div className="text-xs font-medium leading-tight">
                      {plan.includedForFree.title}
                    </div>
                    <div className="ml-auto font-bold whitespace-nowrap">
                      {plan.includedForFree.value}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-semibold tracking-tight mb-16">{pricingData.featuresSection.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16">
            {pricingData.featuresSection.features.map((feature, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card shadow-sm">
                  <feature.icon className="w-5 h-5 text-foreground opacity-80" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-8">
          <ul className="space-y-1">
            {pricingData.footerNotes.map((note, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span>*</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
