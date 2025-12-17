import { Trophy } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlgorithmList } from '@/components/AlgorithmList';
import { PremiumLoader } from '@/components/PremiumLoader';
import { ListType, DIFFICULTY_MAP } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";


const faqItems = [
  {
    question: "What is Blind 75?",
    answer: "Blind 75 is a curated list of the 75 most essential LeetCode questions. These problems cover all major patterns and data structures you need to know for technical interviews at FAANG and top tech companies."
  },
  {
    question: "Is this enough for interviews?",
    answer: "For most roles, yes. Mastering these 75 problems gives you the pattern recognition skills needed to solve similar unseen problems. Many candidates have cracked FAANG interviews doing just these.",
  },
  {
    question: "How should I practice them?",
    answer: "Don't just memorize solutions. Focus on understanding the underlying patterns (Sliding Window, DFS, etc.). Try to solve them in order of difficulty, or by category.",
  },
  {
    question: "Are these solutions available in multiple languages?",
    answer: "Yes! All problems on Rulcode include solutions and explanations in Python, Java, C++, and TypeScript.",
  }
];

const Blind75 = () => {
  // Fetch algorithms using the shared hook to utilize cache
  const { data, isLoading } = useAlgorithms();
  const allAlgorithms = data?.algorithms ?? [];

  // Filter for Blind 75 algorithms
  const algorithms = allAlgorithms.filter(algo => 
    algo.listType === ListType.Blind75 || algo.listType === ListType.CoreAndBlind75
  );

  // Stats derived from filtered algorithms
  const stats = {
    total: algorithms.length,
    easy: algorithms.filter(p => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Easy').length,
    medium: algorithms.filter(p => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Medium').length,
    hard: algorithms.filter(p => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Hard').length,
  };

  if (isLoading) {
    // Return with isLoading prop tailored for AlgorithmList instead of blocking
  }

  return (
    <>
      <Helmet>
        <title>Blind 75 LeetCode Problems - Rulcode.com | FAANG Interview Preparation Guide</title>
        <meta 
          name="description"
          content="Master the Blind 75 - curated list of 75 essential LeetCode problems for coding interviews. Complete solutions in Python, Java, C++, TypeScript with detailed explanations and visualizations." 
        />
        <meta 
          name="keywords" 
          content="blind 75, leetcode, coding interview, interview preparation, leetcode problems, algorithm interview, FAANG interview, technical interview, coding practice" 
        />
        <meta name="author" content="Rulcode.com" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://rulcode.com/blind75" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rulcode.com" />
        <meta property="og:title" content="Blind 75 LeetCode Problems - Complete Interview Guide" />
        <meta property="og:description" content="Master the 75 most important LeetCode problems for coding interviews with detailed solutions and visualizations" />
        <meta property="og:url" content="https://rulcode.com/blind75" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rulcode_io" />
        <meta name="twitter:creator" content="@rulcode_io" />
        <meta name="twitter:title" content="Blind 75 LeetCode Problems - Complete Interview Guide" />
        <meta name="twitter:description" content="Master the 75 most important LeetCode problems for coding interviews with detailed solutions and visualizations" />
        <meta name="twitter:image" content="https://rulcode.com/og-image.png" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Ace Your Interviews</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="gradient-text">Blind 75</span>
                <br />
                LeetCode Problems
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Master the 75 most important coding interview problems. Curated by top engineers at FAANG companies.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Problems</div>
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
           <AlgorithmList 
              algorithms={algorithms} 
              isLoading={isLoading}
              emptyMessage="No Blind 75 problems found."
              defaultListType={ListType.Blind75}
              availableListTypes={[ListType.Blind75, ListType.CoreAndBlind75]} 
              hideListSelection={true}
           />
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
            <p className="text-center text-muted-foreground mb-8">
              Everything you need to know about the Blind 75 list
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

export default Blind75;
