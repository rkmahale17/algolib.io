import {
  Sparkles,
  Coffee,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FAQ } from "@/components/FAQ";
import { FeaturedSection } from "@/components/FeaturedSection";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { PremiumLoader } from "@/components/PremiumLoader";
import { appStatus } from "@/utils/appStatus";
import { FeatureGuard } from "@/components/FeatureGuard";
import { AlgorithmList } from "@/components/AlgorithmList";
import { ListType, AlgorithmListItem } from "@/types/algorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  // Fetch algorithms using React Query
  const { data, isLoading: loading } = useAlgorithms();
  const algorithms = data?.algorithms ?? [];

  // Check authentication status
  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not available, skipping authentication');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Extract categories for SEO from fetched data or use defaults if empty
  const categories = Array.from(new Set(algorithms.map(a => a.category).filter(Boolean))).sort();

  return (
    <>
      <Helmet>
        <title>
          Rulcode.com - Master 200+ Algorithms with Interactive Visualizations |
          Free & Open Source
        </title>
        <meta
          name="description"
          content="Learn data structures and algorithms with step-by-step visualizations across 20 categories. 200+ algorithm animations, Blind 75 problems, interactive games, and tutorials. Perfect for coding interviews, LeetCode practice, and competitive programming. 100% free and open source."
        />
        <meta
          name="keywords"
          content="algorithms, data structures, leetcode, coding interviews, blind 75, competitive programming, algorithm visualization, learn algorithms, DSA, python algorithms, java algorithms, c++ algorithms, typescript algorithms, free algorithm library, interactive games"
        />
        <link rel="canonical" href="https://rulcode.com/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Rulcode.com - Master 200+ Algorithms with Interactive Visualizations"
        />
        <meta
          property="og:description"
          content="Free open-source algorithm library with 200+ interactive visualizations across 20 categories. Learn DSA for coding interviews with Blind 75, games, and tutorials."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Rulcode.com - Master 200+ Algorithms Visually"
        />
        <meta
          name="twitter:description"
          content="Free interactive algorithm visualizations with 20 categories, Blind 75, and games for coding interviews"
        />
        <meta name="twitter:image" content="https://rulcode.com/og-image.png" />

        {/* Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Rulcode.com",
            url: "https://rulcode.com",
            description:
              "Free and open-source algorithm library with interactive visualizations for learning data structures and algorithms",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://rulcode.com/?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Rulcode.com",
            url: "https://rulcode.com",
            logo: {
              "@type": "ImageObject",
              url: "https://rulcode.com/android-chrome-512x512.png",
              width: 512,
              height: 512,
            },
            sameAs: [
              "https://x.com/rulcode_io",
              "https://github.com/rkmahale17/algolib.io",
            ],
            description:
              "Rulcode.com is a free and open-source algorithm library that helps developers learn and visualize algorithms with interactive animations and clean code snippets in multiple programming languages.",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Vertical Buy Me a Coffee Button */}
        <a
          href="https://buymeacoffee.com/jsonmaster"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 px-3 py-4 bg-[#FFDD00] text-[#000000] rounded-r-lg shadow-lg hover:bg-[#FFDD00]/90 hover:pl-4 transition-all font-medium group"
        >
          <Coffee className="w-5 h-5" />
          <span className="writing-mode-vertical text-sm whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
            Buy Me a Coffee
          </span>
        </a>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Master Algorithms Visually
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="gradient-text">
                  All Competitive Algorithms
                </span>
                <br />
                In Your Pocket
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Step-by-step visualizations of all required algorithms. Watch
                code come to life with interactive animations.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="text-center">
                
                    <div className="text-3xl font-bold text-primary">200+</div>
                  
                  <div className="text-sm text-muted-foreground">
                    Algorithms
                  </div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
            
                    <div className="text-3xl font-bold text-secondary">{categories.length || 19}</div>
                  
                  <div className="text-sm text-muted-foreground">
                    Categories
                  </div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">
                    Developer Centric
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <FeaturedSection />

        <FeatureGuard flag="core_algo">
          {/* Main Algorithm List */}
          <div className="container mx-auto px-4 py-8" id="algorithms">
             <div className="max-w-4xl mx-auto space-y-6 mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  Core algorithms
                </h2>
             </div>
             <AlgorithmList 
               algorithms={algorithms} 
               emptyMessage="No algorithms found matching your search." 
               defaultListType={ListType.Core}
               availableListTypes={[ListType.Core, ListType.CoreAndBlind75]}
               hideListSelection={true}
               isLoading={loading}
             />
          </div>
        </FeatureGuard>

        {/* FAQ Section */}
        <FAQ />

        <Footer />
      </div>
    </>
  );
};

export default Home;
