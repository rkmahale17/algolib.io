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
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
               <Terminal className="w-3 h-3" />
               Practice Lab
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Solve Problems</h1>
            <p className="text-muted-foreground max-w-xl">
               Master coding patterns by solving curated technical interview problems.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
             <div className="flex flex-col items-end mr-2">
                <Label htmlFor="core-switch" className="text-sm font-bold cursor-pointer">Include Core Patterns</Label>
                <span className="text-[10px] text-muted-foreground italic">Bubble Sort, BFS, etc.</span>
             </div>
             <Switch 
                id="core-switch" 
                checked={showCore} 
                onCheckedChange={setShowCore}
                className="data-[state=checked]:bg-primary"
             />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Easy', value: stats.easy, color: 'text-green-500' },
            { label: 'Medium', value: stats.medium, color: 'text-yellow-500' },
            { label: 'Hard', value: stats.hard, color: 'text-red-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <ProblemList 
          algorithms={filteredAlgorithms} 
          isLoading={isLoading} 
          emptyMessage="No problems found matching your criteria."
          hideListSelection={true}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Problems;
