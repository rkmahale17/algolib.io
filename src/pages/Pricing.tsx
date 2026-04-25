"use client";
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Check, Info, Calendar, CreditCard, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { pricingData } from '@/data/pricing-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRouter } from 'next/navigation';
import { usePostHog } from '@posthog/react';

const Pricing: React.FC = () => {
  const { profile, user } = useApp();
  const router = useRouter();
  const posthog = usePostHog();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { refreshProfile } = useApp();

  React.useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const sessionId = urlParams.get('checkout_session_id');

      if (status || sessionId) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);

        if (status === 'succeeded') {
          toast.success("Payment successful! Updating your account...");
          setTimeout(() => refreshProfile(), 2000);
        } else if (status === 'failed') {
          toast.error("Payment failed. Please try again or contact support.");
        } else if (status === 'cancelled') {
          toast.info("Payment was cancelled.");
        } else if (status === 'processing' || sessionId) {
          toast.loading("Payment is processing on Dodo's side. If you are stuck there, please ensure you selected 'Success' in the sandbox screen.", {
            duration: 10000,
            id: 'processing-toast'
          });
          const timer = setTimeout(() => {
            refreshProfile();
            toast.dismiss('processing-toast');
          }, 8000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [mounted, refreshProfile]);

  const handleUpgrade = async (planType: string) => {
    if (!user) {
      toast.error("Please sign in to continue with your purchase");
      router.push("/login");
      return;
    }

    posthog?.capture('checkout_initiated', { plan_type: planType });
    try {
      setIsUpgrading(true);
      setActivePlanId(planType);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planType: planType,
          userId: user?.id,
          email: user?.email,
          returnUrl: `${window.location.origin}/pricing`,
          isLocal: window.location.hostname === 'localhost',
        }
      });

      if (error) throw error;

      if (data?.checkout_url) {
        // Using direct redirect instead of SDK overlay (iframe) to avoid browser security restrictions
        // like "Permissions policy violation" (accelerometer, bluetooth) which often block the form in iframes.
        console.log('Using direct redirect for maximum compatibility');
        window.location.href = data.checkout_url;
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
  const isCancelled = profile?.cancel_at_period_end;

  const handleCancel = async () => {
    posthog?.capture('subscription_cancelled');
    try {
      setIsUpgrading(true);
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          isLocal: window.location.hostname === 'localhost'
        }
      });
      if (error) throw error;
      toast.success('Subscription cancellation initiated. Access will continue until period ends.');
      // The context refresh is handled by the webhook or manual reload, but let's refresh here too if possible
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel subscription');
    } finally {
      setIsUpgrading(false);
    }
  };

  const formatPeriodEnd = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return 'N/A';
    return date.toLocaleDateString();
  };

  const isLocal = mounted && typeof window !== 'undefined' && window.location.hostname === 'localhost';

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 px-4 font-sans text-foreground">
      <div className="container mx-auto max-w-6xl">

        {isLocal && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col gap-3 text-amber-600">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="w-4 h-4" />
              <span>Test Mode Active: Using Dodo Test environment.</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-amber-500/5 p-3 rounded border border-amber-500/10">
              <div>
                <p className="font-bold mb-1 uppercase tracking-wider opacity-70">Success Card</p>
                <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-700">4242 4242 4242 4242</code>
              </div>
              <div>
                <p className="font-bold mb-1 uppercase tracking-wider opacity-70">UPI Success</p>
                <code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-700">success@upi</code>
              </div>
            </div>
            <p className="text-[10px] opacity-70 italic">Use any future expiry (12/30) and CVC (123).</p>
          </div>
        )}

        {/* Pro Status Banner */}
        {isPremium && (
          <div className="mb-12 p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Pro Subscription</h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    isCancelled
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-green-500/10 text-green-600 border-green-500/20"
                  )}>
                    {isCancelled ? 'Cancelling' : 'Active'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {isCancelled ? (
                    <>Your subscription will not renew. Access until <span className="text-foreground font-medium">{formatPeriodEnd(profile.current_period_end)}</span></>
                  ) : (
                    <>Next billing is at <span className="text-foreground font-medium">{formatPeriodEnd(profile.current_period_end)}</span></>
                  )}
                </p>
              </div>
            </div>
            {!isCancelled && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded-full h-9 px-6"
                onClick={() => setShowCancelConfirm(true)}
                disabled={isUpgrading}
              >
                {isUpgrading ? 'Processing...' : 'Unsubscribe'}
              </Button>
            )}
            {isCancelled && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-500/5 px-4 py-2 rounded-lg border border-amber-500/10 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                We will ask for payment after {formatPeriodEnd(profile.current_period_end)}
              </div>
            )}
          </div>
        )}

        {/* Header Section */}
        <div className="text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl text-foreground mt-4">
            {isPremium ? "Manage your subscription" : "Save time, ace interviews, and secure high-paying roles"}
          </h1>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {pricingData.subscriptionPlans.map((plan) => {
            const isCurrentPlan = isPremium && profile?.subscription_duration === plan.productId;

            return (
              <div key={plan.id} className={cn(
                "border rounded-2xl bg-card p-8 flex flex-col relative group transition-all",
                isCurrentPlan ? "border-primary ring-1 ring-primary shadow-lg scale-[1.02] z-10" : "border-border hover:border-border/80"
              )}>
                {plan.badge && !isCurrentPlan && (
                  <div className="absolute -top-[14px] right-6 bg-[#dcf65b] text-[#558600] text-[10px] tracking-wider font-bold px-2 py-1.5 rounded shadow-sm uppercase z-10">
                    {plan.badge}
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-[14px] right-6 bg-primary text-primary-foreground text-[10px] tracking-wider font-bold px-3 py-1.5 rounded-full shadow-md uppercase z-20 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Current Plan
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-lg">{plan.title}</div>
                </div>

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
                  variant={isCurrentPlan ? "secondary" : "outline"}
                  className={cn(
                    "w-full rounded-full py-6 font-bold mb-8 transition-all flex items-center justify-center gap-2",
                    isCurrentPlan
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 cursor-default"
                      : "hover:bg-muted"
                  )}
                  onClick={() => !isCurrentPlan && handleUpgrade(plan.productId)}
                  disabled={isUpgrading || isCurrentPlan}
                >
                  {isUpgrading && activePlanId === plan.productId
                    ? "Processing..."
                    : isCurrentPlan
                      ? (
                        <>
                          <Check className="w-5 h-5 stroke-[3]" />
                          Active Plan
                        </>
                      )
                      : plan.buttonText}
                </Button>

                <ul className="space-y-4 mb-auto">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-snug">{feature} </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
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

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel your subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to premium features at the end of the current period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Pricing;
