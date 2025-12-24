import { Layers } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProblemList } from '@/components/ProblemList';
import { ListType, DIFFICULTY_MAP, type AlgorithmListItem } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";

const faqItems = [
  {
    question: "What are Core Patterns?",
    answer: "Core Patterns are the fundamental building blocks of computer science and technical interviews. This collection includes essential sorting, searching, graph, and dynamic programming patterns that every developer should master."
  },
  {
    question: "Why should I learn these first?",
    answer: "These patterns form the basis for solving more complex problems. Understanding these fundamentals makes it much easier to recognize patterns in LeetCode-style questions and system design interviews.",
  },
  {
    question: "How are these different from Blind 75?",
    answer: "While Blind 75 is focused on specific common interview problems, Core Patterns focus on the theoretical foundations and standard implementations of classic algorithms.",
  },
  {
    question: "Are visualizations available for all of them?",
    answer: "Yes! Every core pattern on Rulcode comes with a step-by-step interactive visualization and clean implementations in multiple programming languages.",
  }
];

const CorePatterns = () => {
  // Fetch algorithms using the shared hook to utilize cache
  const { data, isLoading } = useAlgorithms();
  const allAlgorithms = data?.algorithms ?? [];

  // Filter for Core patterns
  const algorithms = allAlgorithms.filter((algo: AlgorithmListItem) => 
    !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75
  );

  // Stats derived from filtered algorithms
  const stats = {
    total: algorithms.length,
    easy: algorithms.filter((p: AlgorithmListItem) => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Easy').length,
    medium: algorithms.filter((p: AlgorithmListItem) => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Medium').length,
    hard: algorithms.filter((p: AlgorithmListItem) => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Hard').length,
  };

  return (
    <>
      <Helmet>
        <title>Core Patterns - Master the Fundamentals | Rulcode.com</title>
        <meta 
          name="description"
          content="Master essential core patterns with interactive visualizations. Learn sorting, searching, graphs, and dynamic programming with step-by-step animations and clean code in 4+ languages." 
        />
        <meta 
          name="keywords" 
          content="core patterns, algorithm fundamentals, sorting patterns, search patterns, graph patterns, dynamic programming, DSA basics, computer science fundamentals" 
        />
        <link rel="canonical" href="https://rulcode.com/core-patterns" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Core Patterns - Master the Fundamentals of DSA" />
        <meta property="og:description" content="Interactive visualizations and step-by-step guides for essential core patterns" />
        <meta property="og:url" content="https://rulcode.com/core-patterns" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Master the Foundations</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="gradient-text">Core Patterns</span>
                <br /> Library
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Step-by-step visualizations of essential patterns. Build a rock-solid foundation for interviews and software engineering.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Patterns</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{stats.easy}</div>
                  <div className="text-sm text-muted-foreground">Easy</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{stats.medium}</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{stats.hard}</div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm List with Filters */}
        <div className="container mx-auto px-4 py-8">
           <ProblemList 
               algorithms={allAlgorithms} 
               isLoading={isLoading}
               emptyMessage="No core patterns found."
               defaultListType={ListType.Core}
               availableListTypes={[ListType.Core, ListType.CoreAndBlind75]} 
               hideListSelection={true}
            />
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
            <p className="text-center text-muted-foreground mb-8">
              Everything you need to know about the Core Patterns list
            </p>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      
        <Footer />
      </div>
    </>
  );
};

export default CorePatterns;
