import { Trophy } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlgorithmList, AlgorithmListItem } from '@/components/AlgorithmList';
import { PremiumLoader } from '@/components/PremiumLoader';
import { ListType, DIFFICULTY_MAP } from "@/types/algorithm";

const Blind75 = () => {
  const [algorithms, setAlgorithms] = useState<AlgorithmListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats derived from fetched algorithms
  const stats = {
    total: algorithms.length,
    easy: algorithms.filter(p => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Easy').length,
    medium: algorithms.filter(p => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Medium').length,
    hard: algorithms.filter(p => DIFFICULTY_MAP[p.difficulty?.toLowerCase()] === 'Hard').length,
  };

  const faqItems = [
    {
      question: "What is the Blind 75 list?",
      answer: "The Blind 75 is a curated collection of 75 essential LeetCode problems selected by a former Facebook engineer. These problems cover fundamental data structures and algorithms commonly asked in technical interviews at top tech companies like Google, Amazon, Facebook, Apple, and Microsoft (FAANG)."
    },
    {
      question: "How long does it take to complete all 75 problems?",
      answer: "On average, it takes 4-8 weeks to complete all 75 problems if you practice 2-3 problems per day. The time varies based on your current skill level and the complexity of each problem. Focus on understanding the concepts rather than rushing through the list."
    },
    {
      question: "Are solutions provided in multiple programming languages?",
      answer: "Yes! Each problem includes complete solutions in Python, Java, C++, and TypeScript. All solutions include detailed explanations, time/space complexity analysis, and interactive visualizations to help you understand the algorithm."
    },
    {
      question: "Do I need to solve problems in order?",
      answer: "No, you don't have to solve them in order. However, we recommend starting with easier problems and progressing to harder ones. You can also filter by category (Arrays, Strings, Trees, etc.) to focus on specific data structures first."
    },
    {
      question: "How do I track my progress?",
      answer: "You can filter problems by difficulty and category to organize your practice. We recommend keeping a personal log of completed problems and revisiting challenging ones periodically to reinforce your understanding."
    }
  ];

  useEffect(() => {
    const fetchBlind75Algorithms = async () => {
      if (!supabase) return;
      
      try {
        // Using correct column name 'list_type' (snake_case standard in Supabase)
        const { data, error } = await supabase
          .from('algorithms')
          .select('*')
          .or('list_type.eq.blind75,list_type.eq.core+blind75');

        if (error) {
          console.error('Error fetching Blind 75 algorithms:', error);
          return;
        }

        if (data) {
           const mappedAlgorithms: AlgorithmListItem[] = data.map((algo: any) => ({
             id: algo.id,
             title: algo.title || algo.name,
             name: algo.name,
             category: algo.category,
             difficulty: algo.difficulty,
             description: algo.description || algo.explanation?.problemStatement || '',
             timeComplexity: algo.timeComplexity || algo.time_complexity || algo.metadata?.timeComplexity,
             spaceComplexity: algo.spaceComplexity || algo.space_complexity || algo.metadata?.spaceComplexity,
             slug: algo.slug || algo.id,
             companies: algo.companyTags || algo.company_tags,
             listType: algo.list_type,
             serial_no: algo.serial_no
          }));
          setAlgorithms(mappedAlgorithms);
        }
      } catch (error) {
        console.error('Error in fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlind75Algorithms();
  }, []);

  if (loading) {
    return <PremiumLoader text="Loading Blind 75 List..." />;
  }

  return (
    <>
      <Helmet>
        <title>Blind 75 LeetCode Problems - AlgoLib.io | FAANG Interview Preparation Guide</title>
        <meta 
          name="description"
          content="Master the Blind 75 - curated list of 75 essential LeetCode problems for coding interviews. Complete solutions in Python, Java, C++, TypeScript with detailed explanations and visualizations." 
        />
        <meta 
          name="keywords" 
          content="blind 75, leetcode, coding interview, interview preparation, leetcode problems, algorithm interview, FAANG interview, technical interview, coding practice" 
        />
        <meta name="author" content="AlgoLib.io" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://algolib.io/blind75" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AlgoLib.io" />
        <meta property="og:title" content="Blind 75 LeetCode Problems - Complete Interview Guide" />
        <meta property="og:description" content="Master the 75 most important LeetCode problems for coding interviews with detailed solutions and visualizations" />
        <meta property="og:url" content="https://algolib.io/blind75" />
        <meta property="og:image" content="https://algolib.io/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@algolib_io" />
        <meta name="twitter:creator" content="@algolib_io" />
        <meta name="twitter:title" content="Blind 75 LeetCode Problems - Complete Interview Guide" />
        <meta name="twitter:description" content="Master the 75 most important LeetCode problems for coding interviews with detailed solutions and visualizations" />
        <meta name="twitter:image" content="https://algolib.io/og-image.png" />
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
