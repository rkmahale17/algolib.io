import {
  ArrowRight,
  BookOpen,
  Code2,
  Gamepad2,
  ListChecks,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from 'react';
import { Link } from "react-router-dom";
import { FeatureGuard } from "./FeatureGuard";

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

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isFirstCard = index === 0;

            const cardContent = (
              <Link
                key={feature.id}
                to={feature.link}
                className="group block w-full"
              >
                <Card className="overflow-hidden  border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card max-w-72">
                  <div className="relative h-32 bg-gradient-to-br from-primary/40 to-primary/5 flex items-center justify-center overflow-hidden">
                    {feature.badge ? (
                      <div className="text-6xl font-bold text-primary/80 group-hover:text-primary/60 transition-all duration-500 group-hover:scale-110 ">
                        {feature.badge}
                      </div>
                    ) : (
                      Icon && (
                        <Icon className="w-16 h-16 text-primary/80 group-hover:text-primary/60 transition-colors duration-300 group-hover:scale-110 transform" />
                      )
                    )}
                  </div>

                  <div className="p-5">
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary hover:bg-primary/10 gap-1"
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
