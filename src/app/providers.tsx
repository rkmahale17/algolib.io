'use client';

import React, { useEffect } from 'react';
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
import { HelmetProvider } from "react-helmet-async";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog in useEffect to ensure it only runs on the client
    const isProduction =
      window.location.hostname === "rulcode.com" ||
      window.location.hostname === "www.rulcode.com";

    if (isProduction && !posthog.has_opted_out_capturing()) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN || '', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false // Next.js handles this better with its own router events
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <PostHogProvider client={posthog}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <FeatureFlagProvider>
                <TooltipProvider>
                  <SidebarProvider defaultOpen={false}>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="system"
                      enableSystem
                      disableTransitionOnChange
                    >
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
    </HelmetProvider>
  );
}
