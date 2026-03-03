import { useState, useMemo } from "react";
import { ProblemList } from "@/components/ProblemList";
import { ListType } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Terminal, BrainCircuit } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>All Problems - RulCode | Master Patterns</title>
        <meta name="description" content="Browse our complete list of technical interview problems and algorithms. Filter by difficulty, category, and more." />
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
               <Terminal className="w-3.5 h-3.5" />
               Practice Lab
            </div>
            <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Solve Problems
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg font-medium leading-relaxed">
               Master coding patterns by solving curated technical interview problems from top tech companies.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground tracking-tighter">
                +2k
              </div>
            </div>
            <div className="text-sm font-bold text-muted-foreground/60 tracking-tight">
              Join 2,000+ developers
            </div>
          </div>
        </div>

        <ProblemList 
          algorithms={allAlgorithms} 
          isLoading={isLoading} 
          emptyMessage="No problems found matching your criteria."
          defaultListType="all"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Problems;
