import {
  Sparkles,
  Coffee,
  Zap,
  Terminal,
  Play,
  ArrowRight,
  Github,
  Globe,
  Eye,
  Lightbulb,
  Trophy,
  Keyboard,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FAQ } from "@/components/FAQ";
import { FeaturedSection } from "@/components/FeaturedSection";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  
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

  return (
    <>
      <Helmet>
        <title>
          RulCode - Master Competitive Programming & Technical Interviews |
          Free & Open Source
        </title>
        <meta
          name="description"
          content="Accelerate your FAANG preparation with interactive visualizations, code execution in 4+ languages, and multi-approach solutions. Master Blind 75 and 200+ algorithms visually."
        />
        <meta
          name="keywords"
          content="competitive programming, leetcode, coding interviews, faang preparation, algorithm visualization, code runner, open source coding"
        />
        <link rel="canonical" href="https://rulcode.com/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="RulCode - Master Competitive Programming & Technical Interviews"
        />
        <meta
          property="og:description"
          content="Interactive visualizations, integrated code runner, and multi-approach solutions in 4+ languages. Master Blind 75 and 200+ algorithms visually."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="RulCode - Master Algorithms & Solve Visually"
        />
        <meta
          name="twitter:description"
          content="Free interactive algorithm visualizations and integrated code runner for FAANG interview preparation."
        />
        <meta name="twitter:image" content="https://rulcode.com/og-image.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RulCode",
            url: "https://rulcode.com",
            description: "Interactive competitive coding and algorithm visualization platform",
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
        <div className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="container mx-auto px-4 py-20 relative lg:py-32">
            <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Cracking FAANG Interviews Made Simple
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  Don't Just Solve Problems.
                  <br />
                  <span className="gradient-text">Understand the Patterns.</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed opacity-90">
                  Visualize algorithms, uncover recurring patterns, check different approaches and build the intuition needed to crack real interview questions — not just sample ones.
                </p>
              </div>

              {/* Feature Markers */}
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <Keyboard className="w-4 h-4 text-primary/60" />
                  </div>
                  <span>Practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary/60" />
                  </div>
                  <span>Code faster</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary/60" />
                  </div>
                  <span>Crack Interview</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="rounded-full px-8 gap-2 bg-primary hover:bg-primary/90 shadow-glow" asChild>
                    <Link to="/problems">
                      Explore Problems
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary hover:text-primary-foreground" asChild>
                    <Link to="/core-patterns">
                      <Layers className="w-4 h-4" />
                      Core Patterns
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="rounded-full px-8 gap-2 border hover:border-primary/10" asChild>
                    <a href="https://github.com/rkmahale17/algolib.io" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      Contribute
                         <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground/60 italic">
                  Completely free. No hidden charges for learning.
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-60">
                 <div className="flex flex-col items-center">
                    <span className="text-xl font-bold">200+</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Problems</span>
                 </div>
                 <div className="h-6 w-px bg-border" />
                 <div className="flex flex-col items-center">
                    <span className="text-xl font-bold">4+</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Languages</span>
                 </div>
                 <div className="h-6 w-px bg-border" />
                 <div className="flex flex-col items-center text-primary opacity-100 grayscale-0">
                    <Globe className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Open Source</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl  text-center mb-12">Learning Paths</h2>
          <FeaturedSection />
        </div>

        {/* FAQ Section */}
        <FAQ />

        <Footer />
      </div>
    </>
  );
};

export default Home;
