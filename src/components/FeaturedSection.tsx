import {
  ArrowRight,
  BookOpen,
  Code2,
  Gamepad2,
  ListChecks,
  Layers,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from 'react';
import { Link } from "react-router-dom";
import { FeatureGuard } from "./FeatureGuard";
import { useApp } from "@/contexts/AppContext";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { Badge as UiBadge} from "@/components/ui/badge";

const features = [
  {
    id: "core-patterns",
    title: "Core Patterns",
    description: "Fundamental building blocks of algorithms and data structures.",
    icon: Layers,
    link: "/core-patterns",
    action: "Master Patterns",
    flag: "core_algo",
  },
  {
    id: "blind-75",
    title: "Blind 75",
    description:
      "Master the most important 75 LeetCode problems curated for technical interviews.",
    icon: null,
    badge: "75",
    link: "/blind75",
    action: "Start Learning",
    flag: "blind_75",
  },
  {
    id: "blog",
    title: "Blog & Tutorials",
    description:
      "Deep dive into algorithm patterns, problem-solving strategies, and coding techniques.",
    icon: BookOpen,
    link: "/blog",
    action: "Read Articles",
  },
  {
    id: "games",
    title: "Algo Games",
    description:
      "Practice algorithms through fun, interactive games that reinforce your understanding.",
    icon: Gamepad2,
    link: "/games",
    action: "Play Now",
    flag: "algo_games",
  },
];

export const FeaturedSection = () => {
  const { hasPremiumAccess } = useApp();
  const isPaywallEnabled = useFeatureFlag('paywall_enabled');

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-stretch">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            const cardContent = (
              <Link
                key={feature.id}
                to={feature.link}
                className="group block h-full mx-auto w-full max-w-[300px]"
              >
                <Card className="h-full overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card flex flex-col">
                  <div className="relative h-32 bg-gradient-to-br from-primary/40 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {feature.badge ? (
                      <div className="text-6xl font-bold text-primary/80 group-hover:text-primary/60 transition-all duration-500 group-hover:scale-110 ">
                        {feature.badge}
                      </div>
                    ) : (
                      Icon && (
                        <Icon className="w-16 h-16 text-primary/80 group-hover:text-primary/60 transition-colors duration-300 group-hover:scale-110 transform" />
                      )
                    )}

                    {isPaywallEnabled && feature.id !== 'core-patterns' && feature.id !== 'blog' && !hasPremiumAccess && (
                      <div className="absolute top-2 right-2">
                        <UiBadge variant="secondary" className="bg-background/80 backdrop-blur-sm border-amber-500/50 text-amber-600 gap-1 text-[10px] font-bold">
                          <Lock className="w-3 h-3" />
                          PREMIUM
                        </UiBadge>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>

                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                      {feature.description}
                    </p>

                    <div className="flex justify-end mt-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 gap-1 p-0 h-auto font-semibold hover:bg-transparent"
                      >
                        {feature.action}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );

            if (feature.flag) {
              return (
                <FeatureGuard key={feature.id} flag={feature.flag}>
                  {cardContent}
                </FeatureGuard>
              );
            }

            return <React.Fragment key={feature.id}>{cardContent}</React.Fragment>;
          })}
        </div>
      </div>
    </section>
  );
};
