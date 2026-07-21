"use client";
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Check, Info, Calendar, CreditCard, AlertCircle, XCircle, ArrowRight, Briefcase } from 'lucide-react';
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

        if (status === 'succeeded' || urlParams.get('order_id')) {
          toast.success("Payment successful! Syncing your account...");

          // Poll for status update (up to 5 times, every 3 seconds)
          let attempts = 0;
          const pollInterval = setInterval(async () => {
            attempts++;
            await refreshProfile();
            if (attempts >= 5) {
              clearInterval(pollInterval);
            }
          }, 3000);

          return () => clearInterval(pollInterval);
        } else if (status === 'failed') {
          toast.error("Payment failed. Please try again or contact support.");
        } else if (status === 'cancelled') {
          toast.info("Payment was cancelled.");
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
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsUpgrading(false);
      setActivePlanId(null);
    }
  };

  const isPremium = useApp().hasPremiumAccess;
  const hasBoughtBefore = !!(
    profile?.subscription_status &&
    ['active', 'paid', 'past_due', 'canceled', 'cancelled', 'expired', 'unpaid', 'paused'].includes(profile.subscription_status)
  );
  const isTrial = profile?.subscription_status === 'on_trial' ||
    profile?.subscription_status === 'trialing' ||
    (profile?.trial_end_date && new Date(profile.trial_end_date) > new Date());
  const isPastDue = profile?.subscription_status === 'past_due';
  const isCancelled = profile?.cancel_at_period_end || profile?.subscription_status === 'canceled';

  const trialEnd = profile?.trial_end_date ? new Date(profile.trial_end_date) : null;
  const trialDaysLeft = trialEnd ? Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const isTrialEndingSoon = isTrial && trialDaysLeft !== null && trialDaysLeft >= 0 && trialDaysLeft <= 2;

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
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : isPastDue
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : isTrial
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-green-500/10 text-green-600 border-green-500/20"
                  )}>
                    {isCancelled ? 'Subscription Cancelled' : isPastDue ? 'Payment Pending' : isTrial ? 'Free Trial' : 'Active'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {isCancelled ? (
                    <>Your subscription has been cancelled. You will continue to have access until <span className="text-foreground font-medium">{formatPeriodEnd(profile.current_period_end)}</span></>
                  ) : isPastDue ? (
                    <>We couldn't process your payment. We are retrying, but please <a href={profile?.customer_portal_url || "https://app.lemonsqueezy.com/my-orders"} target="_blank" rel="noopener noreferrer" className="text-foreground font-medium underline cursor-pointer">update your payment method</a> to avoid interruption.</>
                  ) : isTrialEndingSoon ? (
                    <>Your trial ends in {trialDaysLeft} days. <span className="text-foreground font-medium underline cursor-pointer">Upgrade now</span> to continue uninterrupted access.</>
                  ) : isTrial ? (
                    <>Your free trial ends on <span className="text-foreground font-medium">{formatPeriodEnd(profile.current_period_end)}</span>. You will not be billed until then.</>
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
        <div className={cn("mb-16", !isPremium ? "flex flex-col items-center text-center" : "text-left")}>
          {!isPremium && (
            <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> Career Investment
            </span>
          )}
          <h1 className={cn("tracking-tight text-foreground mb-8", !isPremium ? "font-medium text-4xl md:text-5xl lg:text-5xl max-w-3xl" : "font-bold text-4xl md:text-5xl max-w-2xl")}>
            {isPremium ? "Manage your subscription" : "The Best Investment You'll Make for Your Next Interview."}
          </h1>
          {!isPremium && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Master DSA with interactive visualizations, AI guidance, and structured practice, all designed to help you succeed in coding interviews.
            </p>
          )}
        </div>

        {!isPremium && (
          <div className="w-full max-w-[1000px] mx-auto rounded-2xl bg-gradient-to-br from-orange-500/5 via-card to-card border border-orange-500/10 shadow-lg shadow-orange-500/5 p-8 md:p-12 mb-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 relative">
              {/* Divider for desktop */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border/60 -translate-x-1/2" />
              
              {/* Left Column */}
              <div className="flex flex-col lg:pr-16 max-w-[600px]">
                <span className="text-sm font-medium text-muted-foreground mb-3">
                  Why it's worth it
                </span>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  An investment in your future
                </h3>
                <div className="space-y-6 text-muted-foreground/90 leading-relaxed text-[15px] md:text-base">
                  <p>
                    There's nothing more valuable than preparing yourself to secure a role at a top tier company.
                  </p>
                  <p>
                    High quality preparation is the ultimate multiplier for your career, a negligible cost against the return and growth it unlocks.
                  </p>
                  <div className="pt-6 mt-2 border-t border-border/50">
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Join engineers cracking interviews at top tech companies like:
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center">
                        <img src="/icons/companies/google.svg" alt="Google" className="w-4 h-4 object-contain dark:invert opacity-60" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center">
                        <img src="/icons/companies/meta.svg" alt="Meta" className="w-4 h-4 object-contain dark:invert opacity-60" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center">
                        <img src="/icons/companies/amazon.svg" alt="Amazon" className="w-4 h-4 object-contain dark:invert opacity-60" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center">
                        <img src="/icons/companies/netflix.svg" alt="Netflix" className="w-4 h-4 object-contain dark:invert opacity-60" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center">
                        <img src="/icons/companies/microsoft.svg" alt="Microsoft" className="w-4 h-4 object-contain dark:invert opacity-60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col lg:pl-16">
                <span className="text-sm font-medium text-muted-foreground mb-8">
                  Offers don't lie
                </span>
                
                <div className="flex flex-col gap-8 max-h-[320px] overflow-y-auto pr-2 pb-2 hover-scrollbar">
                  {/* Testimonial 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      R
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-foreground text-[15px] md:text-base leading-snug">
                        "Cleared my Amazon SDE2 loop, the interactive visualizations were a game changer."
                      </p>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        Rahul S., @rahul_codes
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-border/60 shrink-0" />

                  {/* Testimonial 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      J
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-foreground text-[15px] md:text-base leading-snug">
                        "Instead of the solution, it guided me with hints until I found the DP approach myself."
                      </p>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        James T., @jamestech
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-border/60 shrink-0" />

                  {/* Testimonial 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      S
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-foreground text-[15px] md:text-base leading-snug">
                        "Practicing with Rulo AI felt exactly like a real interview. It pinpointed the edge cases I missed and helped me optimize my approach perfectly."
                      </p>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        Sarah M., @sarah_dev
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Grid */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-start gap-6 lg:gap-8 mb-24">
          {pricingData.subscriptionPlans.map((plan) => {
            const isCurrentPlan = isPremium && profile?.subscription_duration === plan.productId;

            return (
              <div key={plan.id} className={cn(
                "border rounded-2xl bg-card p-8 flex flex-col relative group transition-all duration-300 w-full max-w-[380px]",
                isCurrentPlan ? "border-2 border-primary shadow-xl shadow-primary/5 z-10" : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 z-0"
              )}>
                {plan.badge && !isCurrentPlan && (
                  <div className="absolute -top-3 right-6 bg-[#dcf65b] text-[#558600] text-[10px] tracking-wider font-bold px-2.5 py-1 rounded shadow-sm uppercase z-10 subpixel-antialiased">
                    {plan.badge}
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] tracking-wider font-bold px-3 py-1 rounded-full shadow-md uppercase z-20 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300 subpixel-antialiased">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Current Plan
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col gap-1.5 h-[44px]">
                    {(plan as any).trustedText ? (
                      <div className="text-[11px] font-bold text-amber-500 tracking-wider uppercase leading-none">
                        {(plan as any).trustedText}
                      </div>
                    ) : (
                      <div className="h-[11px]" />
                    )}
                    <div className="font-semibold text-lg leading-none">{plan.title}</div>
                  </div>
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
                    <span className="text-neutral-900 dark:text-neutral-100 text-pretty xl:text-5xl xl:-tracking-3 text-4xl -tracking-2 font-medium flex items-start mt-1">
                      {plan.price.startsWith('$') && <span className="text-2xl xl:text-3xl mr-0.5 mt-1">$</span>}
                      {plan.price.startsWith('$') ? plan.price.slice(1) : plan.price}
                    </span>
                    <span className="text-muted-foreground font-medium text-sm">{plan.period}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-4 mt-2 h-5">
                  {plan.periodSubLabel}
                </div>

                {plan.hasTrial && !hasBoughtBefore ? (
                  <div className="mb-6 flex flex-col gap-1 h-[44px]">
                    <div className="text-xs font-bold text-green-600 bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10 w-fit leading-tight">
                      Includes 14-day free trial
                    </div>
                    <div className="text-[10px] text-muted-foreground italic leading-tight">
                      Cancel anytime before 14 days and you will not be charged.
                    </div>
                  </div>
                ) : plan.productId === "free" ? (
                  <div className="mb-6 flex flex-col gap-1 h-[44px]">
                    <div className="text-xs font-bold text-zinc-300 bg-zinc-500/10 px-2.5 py-0.5 rounded-full border border-zinc-500/20 w-fit leading-tight">
                      Run, Submit, Solution
                    </div>
                    <div className="text-[10px] text-muted-foreground italic leading-tight">
                      Includes visualization for free problems.
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 h-[44px]" />
                )}

                <Button
                  variant={isCurrentPlan ? "secondary" : "default"}
                  className={cn(
                    "w-full rounded-xl py-6 font-bold mb-8 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group shadow-md border-b-4 border-black/20",
                    isCurrentPlan
                      ? "bg-secondary text-secondary-foreground border-transparent cursor-default hover:bg-secondary"
                      : "bg-gradient-to-r from-primary to-primary/95 text-primary-foreground border-t-transparent border-x-transparent shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] active:border-b-2 transition-all"
                  )}
                  onClick={() => !isCurrentPlan && handleUpgrade(plan.productId)}
                  disabled={isUpgrading || isCurrentPlan}
                >
                  {isUpgrading && activePlanId === plan.productId ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      Processing...
                    </span>
                  ) : isCurrentPlan ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      Active Plan
                    </>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="font-semibold tracking-wide">
                        {plan.productId === "free"
                          ? "Continue Learning"
                          : hasBoughtBefore
                          ? (profile?.subscription_duration === plan.productId ? "Renew" : "Buy Now")
                          : (plan.hasTrial ? "Start 14-day free trial" : "Buy Now")}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                    </span>
                  )}
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
        <div className="pt-8 max-w-[1200px] mx-auto">
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
