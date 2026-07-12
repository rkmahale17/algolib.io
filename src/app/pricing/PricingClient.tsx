'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Check, Info, Calendar, CreditCard, AlertCircle, ArrowRight, Sparkles, HelpCircle, Copy, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { pricingData } from '@/data/pricing-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { trackEvent } from '@/lib/analytics';

const PricingClient = () => {
  const { profile, user } = useApp();
  const router = useRouter();
  const posthog = usePostHog();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { refreshProfile } = useApp();

  // Track pricing page view
  React.useEffect(() => {
    if (!mounted) return;
    const trialEnd = profile?.trial_end_date ? new Date(profile.trial_end_date) : null;
    const trialDaysLeft = trialEnd
      ? Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;
    trackEvent(posthog, 'pricing_page_viewed', {
      is_premium: !!isPremium,
      subscription_status: profile?.subscription_status ?? undefined,
      trial_days_left: trialDaysLeft,
      is_trial: !!(profile?.subscription_status === 'on_trial' || profile?.subscription_status === 'trialing'),
      is_past_due: profile?.subscription_status === 'past_due',
      is_cancelled: profile?.cancel_at_period_end === true || profile?.subscription_status === 'canceled',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  React.useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order_id');
      const status = urlParams.get('status');

      if (orderId || status) {
        // Clean up URL immediately
        window.history.replaceState({}, '', window.location.pathname);

        if (orderId || status === 'succeeded') {
          toast.success('Payment successful! Syncing your account...');
          trackEvent(posthog, 'checkout_completed', { status: 'completed', order_id: orderId });

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
          toast.error('Payment failed. Please try again or contact support.');
          trackEvent(posthog, 'checkout_failed', { status: 'failed', order_id: orderId });
        } else if (status === 'cancelled') {
          toast.info('Payment was cancelled.');
          trackEvent(posthog, 'checkout_cancelled', { status: 'cancelled', order_id: orderId });
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

    // Find plan metadata for richer tracking
    const planMeta = pricingData.subscriptionPlans.find(p => p.productId === planType);
    trackEvent(posthog, 'checkout_initiated', {
      plan_type: planType,
      plan_title: planMeta?.title,
      plan_price: String(planMeta?.price ?? ''),
    });
    try {
      setIsUpgrading(true);
      setActivePlanId(planType);
      const { data, error } = await supabase.functions.invoke('lemon-create-checkout', {
        body: {
          planType: planType,
          userId: user?.id,
          email: user?.email,
          customerName: profile?.full_name,
          returnUrl: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '',
          isLocal: typeof window !== 'undefined' && window.location.hostname === 'localhost',
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
      console.error('Upgrade error:', error);
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
  const isCancelled = profile?.cancel_at_period_end === true || profile?.subscription_status === 'canceled';

  const trialEnd = profile?.trial_end_date ? new Date(profile.trial_end_date) : null;
  const trialDaysLeft = trialEnd ? Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const isTrialEndingSoon = isTrial && trialDaysLeft !== null && trialDaysLeft >= 0 && trialDaysLeft <= 2;

  const handleCancel = async () => {
    trackEvent(posthog, 'subscription_cancelled', { confirmed: true });
    try {
      setIsUpgrading(true);
      const { error } = await supabase.functions.invoke('lemon-cancel-subscription', {
        body: {
          isLocal: typeof window !== 'undefined' && window.location.hostname === 'localhost'
        }
      });
      if (error) throw error;
      toast.success('Subscription cancellation initiated. Access will continue until period ends.');
      router.refresh(); // Instead of window.location.reload()
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel subscription');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Fetches a fresh LS-signed magic link — users don't have a LemonSqueezy account/login,
  // so we can't send them to /my-orders. The signed URL lets them update payment directly.
  const handleUpdatePayment = async () => {
    try {
      setIsLoadingPortal(true);
      const { data, error } = await supabase.functions.invoke('lemon-get-portal-url');
      if (error || !data?.url) throw new Error(error?.message || 'Could not open billing portal');
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      toast.error(err.message || 'Could not open billing portal. Try again.');
    } finally {
      setIsLoadingPortal(false);
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
    <>
      <div className="w-full max-w-[1600px] mx-auto px-4">

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
                    <>Your subscription has been cancelled. You will continue to have access until <span className="text-foreground font-medium">{formatPeriodEnd(profile?.current_period_end || null)}</span></>
                  ) : isPastDue ? (
                    <>We couldn't process your payment. We are retrying, but please{' '}
                      <button
                        onClick={handleUpdatePayment}
                        disabled={isLoadingPortal}
                        className="text-foreground font-medium underline cursor-pointer disabled:opacity-50"
                      >
                        {isLoadingPortal ? 'Opening...' : 'update your payment method'}
                      </button>
                      {' '}to avoid interruption.
                    </>
                  ) : isTrialEndingSoon ? (
                    <>Your trial ends in {trialDaysLeft} days. <span className="text-foreground font-medium underline cursor-pointer">Upgrade now</span> to continue uninterrupted access.</>
                  ) : isTrial ? (
                    <>Your free trial ends on <span className="text-foreground font-medium">{formatPeriodEnd(profile?.current_period_end || null)}</span>. You will not be billed until then.</>
                  ) : (
                    <>Next billing is at <span className="text-foreground font-medium">{formatPeriodEnd(profile?.current_period_end || null)}</span></>
                  )}
                </p>
              </div>
            </div>
            {!isCancelled && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded-full h-9 px-6"
                onClick={() => {
                  trackEvent(posthog, 'subscription_cancel_dialog_opened', {});
                  setShowCancelConfirm(true);
                }}
                disabled={isUpgrading}
              >
                {isUpgrading ? 'Processing...' : 'Unsubscribe'}
              </Button>
            )}
            {isCancelled && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-500/5 px-4 py-2 rounded-lg border border-amber-500/10 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                We will ask for payment after {formatPeriodEnd(profile?.current_period_end || null)}
              </div>
            )}
          </div>
        )}

        {/* Header Section */}
        <div className="text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight max-w-2xl text-foreground mt-4">
            {isPremium ? "Manage your subscription" : "Save time, ace interviews, and secure high-paying roles"}
          </h1>
        </div>

        {/* Career Investment Message Card */}
        {!isPremium && (
          <div className="mb-12 p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-foreground">An Investment in Your Future</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                There is nothing more valuable than preparing yourself to secure a role at a top-tier company. <br className="hidden md:block" /> High-quality preparation is the ultimate multiplier for your career—making this purchase a negligible, high-yield investment compared to the career return and growth you will secure.
              </p>
            </div>
          </div>
        )}

        {/* Subscriptions Grid */}
        <div id="pricing-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-center">
          {pricingData.subscriptionPlans.map((plan) => {
            const isFreePlan = plan.productId === "free";
            const isCurrentPlan = isPremium && profile?.subscription_duration === plan.productId;
            const isAnnual = plan.id === "annual";

            return (
              <div key={plan.id} className={cn(
                "rounded-2xl p-8 flex flex-col relative group transition-all duration-300",
                isAnnual 
                  ? "border-[3px] border-green-500 bg-card/90 shadow-2xl z-10 bg-gradient-to-b from-green-500/5 to-transparent" 
                  : "border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 z-0",
                isCurrentPlan && !isAnnual ? "border-2 border-primary shadow-xl shadow-primary/5 z-10" : ""
              )}>
                {plan.badge && !isCurrentPlan && (
                  <div className="absolute -top-3 right-6 bg-[#dcf65b] text-zinc-950 text-[10px] tracking-wider font-bold px-2.5 py-1 rounded shadow-sm uppercase z-10 subpixel-antialiased">
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
                  <div className="flex flex-col gap-1.5">
                    {(plan as any).trustedText && (
                      <div className="text-[11px] font-bold text-amber-500 tracking-wider uppercase">
                        {(plan as any).trustedText}
                      </div>
                    )}
                    <div className="font-semibold text-lg">{plan.title}</div>
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
                    <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground font-medium text-sm">{plan.period}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-4 mt-2 h-5 flex items-center gap-2">
                  <span>{plan.periodSubLabel}</span>
                  {(plan as any).saveText && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-wide">
                      {(plan as any).saveText}
                    </span>
                  )}
                </div>

                 {plan.hasTrial && !hasBoughtBefore && (
                  <div className="mb-6 flex flex-col gap-1">
                    <div className="text-xs font-bold text-green-600 bg-green-500/5 px-2 py-1 rounded border border-green-500/10 w-fit">
                      Includes 14-day free trial
                    </div>
                    <div className="text-[10px] text-muted-foreground italic">
                      Cancel anytime before 14 days and you will not be charged.
                    </div>
                  </div>
                )}

                <Button
                  variant={isCurrentPlan ? "secondary" : "default"}
                  className={cn(
                    "w-full rounded-xl py-6 font-bold mb-8 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group shadow-md border-b-4 border-black/20",
                    isCurrentPlan
                      ? "bg-secondary text-secondary-foreground border-transparent cursor-default hover:bg-secondary"
                      : "bg-gradient-to-r from-primary to-primary/95 text-primary-foreground border-t-transparent border-x-transparent shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] active:border-b-2 transition-all"
                  )}
                  onClick={() => {
                    if (isFreePlan) {
                      router.push('/problems');
                    } else if (!isCurrentPlan) {
                      handleUpgrade(plan.productId);
                    }
                  }}
                  disabled={isUpgrading || (isCurrentPlan && !isFreePlan)}
                >
                  {isUpgrading && activePlanId === plan.productId ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      Processing...
                    </span>
                  ) : isCurrentPlan && !isFreePlan ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      Active Plan
                    </>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="font-semibold tracking-wide">
                        {isFreePlan 
                          ? "Start Learning"
                          : hasBoughtBefore
                            ? (profile?.subscription_duration === plan.productId ? "Renew" : "Get Pro")
                            : (plan.hasTrial ? "Start 14-day free trial" : "Get Pro")}
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                    </span>
                  )}
                </Button>

                <ul className="space-y-4 mb-auto">
                  {plan.features.map((feature, fidx) => {
                    const isExcluded = feature.startsWith("x ");
                    const text = isExcluded ? feature.substring(2) : feature;
                    
                    return (
                      <li key={fidx} className={cn("flex items-start gap-3", isExcluded ? "opacity-60" : "")}>
                        {isExcluded ? (
                          <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        ) : (
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm text-muted-foreground leading-snug">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Section */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 px-4 py-2 rounded-full shadow-sm">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 px-4 py-2 rounded-full shadow-sm">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 px-4 py-2 rounded-full shadow-sm">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>Instant access after payment</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 px-4 py-2 rounded-full shadow-sm">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>New problems added every week</span>
          </div>
        </div>

        {/* Mini Promo Cards (Below Pricing) */}
        {!isPremium && (
          <div className="flex flex-col sm:flex-row gap-6 mb-24 max-w-4xl mx-auto">
            {/* Flash Sale Mini Card */}
            <div className="flex-1 border border-border rounded-2xl bg-card/50 p-6 flex flex-col justify-center hover:border-primary/50 transition-colors">
              <div className="w-fit bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-red-500/20">
                🔥 Limited Time
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-5xl font-bold tracking-tight">10%</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">OFF</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium mb-6">Valid till July 31</div>
              <div 
                className="flex items-center gap-2 text-[15px] font-semibold cursor-pointer hover:opacity-80 transition-opacity w-fit" 
                onClick={() => { 
                  navigator.clipboard.writeText('FLASH10'); 
                  toast.success('Coupon code copied!'); 
                }}
              >
                FLASH10 <Copy className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Student Mini Card */}
            <div className="flex-1 border border-border rounded-2xl bg-card/50 p-6 flex flex-col justify-center hover:border-primary/50 transition-colors">
              <div className="w-fit bg-muted text-foreground text-sm font-bold px-3 py-1 rounded-full mb-6 border border-border">
                🎓 Student?
              </div>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-2xl font-bold tracking-tight mr-1">Get</span>
                <span className="text-5xl font-bold tracking-tight">30%</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">OFF</span>
              </div>
              <a href="mailto:support@rulcode.com" className="flex items-center gap-2 text-[15px] font-semibold hover:text-primary transition-colors w-fit">
                Verify your college email <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Social Proof Banner */}
        {!isPremium && (
          <div className="mb-24 p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background text-center flex flex-col items-center gap-4">
            <div className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Limited Time Access
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold max-w-xl text-foreground">
              Over 100+ developers have already purchased this course—now it's your turn to ace your interviews!
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Don't get left behind. Start practicing today with our premium tools, solution explanations, and interactive visualizers.
            </p>
            <Button 
              onClick={() => {
                const element = document.getElementById('pricing-grid');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="mt-2 rounded-full px-8 py-6 font-semibold"
            >
              Get Premium Access Now
            </Button>
          </div>
        )}

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

        {/* FAQ Section */}
        <div className="mb-24 border-t border-border pt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-10 flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-primary" />
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary text-base">
                  What is included in the premium subscription?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  You get unlimited access to all premium coding problems, step-by-step solutions with multiple optimal approaches, interactive visualizers that show algorithm execution step-by-step, structured interview preparation tracks, in-browser compilation/execution, and future content updates.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary text-base">
                  What should I do if my payment fails?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  If your transaction fails or the premium features are not activated immediately after payment, please check your network connection and billing details. If you continue to experience issues, send us an email at{" "}
                  <a href="mailto:support@rulcode.com" className="text-primary hover:underline font-medium">
                    support@rulcode.com
                  </a>{" "}
                  with your details, and we will activate your premium subscription manually as soon as possible.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary text-base">
                  What if I don't have the money to buy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  We believe that premium education should be accessible to everyone. If you cannot afford the subscription due to genuine financial constraints, job loss, or regional pricing disparities, please reach out to us at{" "}
                  <a href="mailto:support@rulcode.com" className="text-primary hover:underline font-medium">
                    support@rulcode.com
                  </a>{" "}
                  explaining your situation, and we will do our best to provide financial aid or discounts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary text-base">
                  Can I cancel my subscription at any time?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  Yes, absolutely! You can cancel your subscription at any time. If you unsubscribe, you will retain full access to all premium content and features until the end of your current billing period, and no further payments will be charged.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary text-base">
                  Will my subscription renew automatically?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  Yes, to ensure uninterrupted access, your subscription will automatically renew at the end of each billing cycle (every 3 months, 6 months, or 12 months) depending on the plan you chose. You can easily turn off auto-renewal at any time by cancelling your subscription before the next billing date.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-border">
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary text-base">
                  Have other queries or need more information?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  We are here to help! For any questions, feedback, partnership opportunities, or billing issues, feel free to email our support team at{" "}
                  <a href="mailto:support@rulcode.com" className="text-primary hover:underline font-medium">
                    support@rulcode.com
                  </a>
                  . We typically respond within 24 hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-8 pb-24">
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
    </>
  );
};

export default PricingClient;
