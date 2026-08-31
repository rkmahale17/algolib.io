'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppProvider } from "@/contexts/AppContext";
import { FeatureFlagProvider } from "@/contexts/FeatureFlagContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import PostHogIdentify from "./PostHogIdentify";
import SidebarController from "./SidebarController";

// Defer PostHog initialization to after the critical rendering path.
// PostHog queues events internally, so nothing is lost during the deferral window.
if (typeof window !== 'undefined') {
  const initPostHog = () => {
    const isProduction =
      window.location.hostname === "rulcode.com" ||
      window.location.hostname === "www.rulcode.com";

    if (isProduction && !posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN || '', {
        api_host: `${window.location.origin}/p`,
        person_profiles: 'identified_only',
        ui_host: 'https://app.posthog.com',
        capture_pageview: false, // Next.js handles this via PostHogPageView
      });
    }
  };

  // Use requestIdleCallback to defer until browser is idle, with a 3s timeout fallback
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(initPostHog, { timeout: 3000 });
  } else {
    setTimeout(initPostHog, 1500);
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <FeatureFlagProvider>
              <TooltipProvider>
                {/*
                 * SidebarProvider is controlled by SidebarController (a child).
                 * Keeping defaultOpen=false here; SidebarController opens it
                 * reactively on DSA routes — this avoids re-rendering the whole
                 * provider tree on every pathname change.
                 */}
                <SidebarProvider defaultOpen={false}>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    {/* Reactively identifies the user in PostHog using Redux auth state.
                        No extra Supabase calls — avoids lock contention. */}
                    <PostHogIdentify />
                    {/* Reactively manages sidebar open state per route */}
                    <SidebarController />
                    {children}
                    <Toaster />
                    <Sonner />
                  </ThemeProvider>
                </SidebarProvider>
              </TooltipProvider>
            </FeatureFlagProvider>
          </AppProvider>
        </QueryClientProvider>
      </Provider>
    </PostHogProvider>
  );
}