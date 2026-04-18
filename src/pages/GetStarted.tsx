"use client";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ListType } from "@/types/algorithm";
import { Rocket, Layers, ChevronRight, Target, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProblemsList } from "@/components/listing/ProblemsList";

const ListCard = ({ title, description, icon: Icon, badge, link, color, isFirst, isLast }: any) => (
  <Link to={link} className="group block relative w-full">
    <div className={cn(
      "flex items-center gap-4 sm:gap-6 p-5 transition-all duration-300",
      "bg-card hover:bg-muted/15",
      "border-x border-t border-border/40",
      isFirst && "rounded-t-xl",
      isLast && "rounded-b-xl border-b",
      !isFirst && !isLast && "rounded-none",
      "shadow-sm hover:shadow-md relative overflow-hidden"
    )}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", color)}>
        {Icon ? <Icon className="w-6 h-6" /> : <span className="text-xl font-medium">{badge}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[16px] mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-[13px] text-muted-foreground leading-snug line-clamp-1">{description}</p>
      </div>
      <div className="shrink-0 flex items-center justify-center w-8 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all">
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </div>
    </div>
  </Link>
);


const GetStarted = () => {
  const { data, isLoading } = useAlgorithms();

  const allAlgorithms = data?.algorithms ?? [];
  const coreAlgorithms = useMemo(() => 
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  return (
    <>
      <Helmet>
        <title>DSA Roadmap - RulCode | Master Patterns</title>
        <meta name="description" content="Master essential recurring algorithm patterns with our curated DSA roadmap." />
      </Helmet>

      <ProblemsList
        algorithms={coreAlgorithms}
        title="DSA Roadmap"
        description="Kickstart your DSA journey with a structured roadmap. Learn to break down complex problems into recurring patterns, systematically building the intuition needed to tackle any interview with confidence."
        listType="core"
        progressTitle="Your Roadmap Progress"
        isLoading={isLoading}
        showRecommendation={true}
        initialCategoryWise={true}
        icon={Rocket}
        headerSlot={
          <div className="w-full max-w-[700px] mx-auto flex flex-col mb-12">
            <ListCard
              title="All Practice"
              description="Browse the complete bank of 150+ problems."
              icon={Layers}
              link="/dsa/problems"
              color="bg-blue-500/10 text-blue-500"
              isFirst={true}
            />
            <ListCard
              title="Core Patterns"
              description="Learn essential recurring logic patterns."
              icon={Target}
              link="/dsa/core"
              color="bg-purple-500/10 text-purple-500"
            />
            <ListCard
              title="Blind 75"
              description="The curated list of must-do FAANG questions."
              icon={Brain}
              badge="75"
              link="/dsa/blind-75"
              color="bg-amber-500/10 text-amber-500"
              isLast={true}
            />
          </div>
        }
      />
    </>
  );
};

export default GetStarted;
