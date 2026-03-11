import { useState, useMemo } from "react";
import { ProblemList } from "@/components/ProblemList";
import { ListType } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { SidebarLayout } from "@/components/SidebarLayout";

const Problems = () => {
  const { data, isLoading } = useAlgorithms();
  const [showCore, setShowCore] = useState(false);

  const allAlgorithms = data?.algorithms ?? [];

  const filteredAlgorithms = useMemo(() => {
    if (showCore) return allAlgorithms;
    return allAlgorithms.filter(algo => algo.listType !== ListType.Core);
  }, [allAlgorithms, showCore]);

  const stats = useMemo(() => {
    const total = filteredAlgorithms.length;
    const easy = filteredAlgorithms.filter(a => a.difficulty?.toLowerCase() === 'easy' || a.difficulty?.toLowerCase() === 'beginner').length;
    const medium = filteredAlgorithms.filter(a => a.difficulty?.toLowerCase() === 'medium' || a.difficulty?.toLowerCase() === 'intermediate').length;
    const hard = filteredAlgorithms.filter(a => a.difficulty?.toLowerCase() === 'hard' || a.difficulty?.toLowerCase() === 'advanced').length;
    return { total, easy, medium, hard };
  }, [filteredAlgorithms]);

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background border-border overflow-y-auto">
        <Helmet>
          <title>All Problems - RulCode | Master Patterns</title>
          <meta name="description" content="Browse our complete list of technical interview problems and algorithms. Filter by difficulty, category, and more." />
        </Helmet>

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col gap-2 mb-8 mt-4">
            <h1 className="text-3xl font-bold mb-2">All Practice Questions</h1>
            <p className="text-sm text-muted-foreground">The largest question bank of 500+ front end interview practice questions</p>
          </div>

          <ProblemList
            algorithms={allAlgorithms}
            isLoading={isLoading}
            emptyMessage="No problems found matching your criteria."
            defaultListType="all"
          />
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Problems;
