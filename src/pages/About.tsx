import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Github, Heart, Users, ExternalLink, Layers, BarChart, Database } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function About() {
  return (
    <>
      <Helmet>
        <title>About AlgoLib.io - Free Open Source Algorithm Learning Platform</title>
        <meta 
          name="description" 
          content="Learn about AlgoLib.io's mission to make algorithm learning accessible through interactive visualizations. 100% free, open-source, and community-driven platform for developers and competitive programmers." 
        />
        <meta 
          name="keywords" 
          content="about algolib, algorithm learning platform, open source algorithms, free coding education, interactive algorithm visualizations, hotjar, google analytics" 
        />
        <link rel="canonical" href="https://algolib.io/about" />
        
        <meta property="og:title" content="About AlgoLib.io - Free Algorithm Learning Platform" />
        <meta property="og:description" content="100% free and open-source platform for learning algorithms with interactive visualizations" />
        <meta property="og:url" content="https://algolib.io/about" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About AlgoLib.io",
            "description": "AlgoLib.io is an open-source platform designed to make algorithm learning accessible, interactive, and enjoyable for everyone",
            "url": "https://algolib.io/about",
            "mainEntity": {
              "@type": "EducationalOrganization",
              "name": "AlgoLib.io",
              "description": "Free and open-source algorithm library for competitive programming and coding interviews",
              "url": "https://algolib.io"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <main className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {/* Header Section */}
            <motion.div variants={item} className="text-center space-y-6 py-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                About AlgoLib.io
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We are on a mission to democratize computer science education by transforming complex algorithmic concepts into intuitive, interactive visual experiences.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Mission Card */}
              <motion.div variants={item} className="h-full">
                <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Code2 className="w-6 h-6" />
                      </div>
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Learning algorithms shouldn't feel like deciphering an ancient language. At AlgoLib.io, we believe that <strong className="text-foreground">visualization is the key to understanding</strong>. Our platform bridges the gap between abstract theory and practical application.
                    </p>
                    <p>
                      By providing step-by-step interactive animations, we help developers build a deep, intuitive mental model of how data structures really work—essential for aceing technical interviews and building efficient software.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Open Source Card */}
              <motion.div variants={item} className="h-full">
                <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <Heart className="w-6 h-6" />
                      </div>
                      100% Free & Open Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      We believe that high-quality educational resources should be accessible to everyone, regardless of their background or budget. That's why AlgoLib.io is committed to remaining <strong>forever free</strong>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      As an open-source project, we thrive on community collaboration. Developers from around the world contribute code, translations, and new visualizations, making this a true community-led platform.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <Button asChild className="gap-2">
                        <a 
                          href="https://github.com/rkmahale17/algolib.io" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4" />
                          Star on GitHub
                        </a>
                      </Button>
                      <Button variant="outline" asChild className="gap-2">
                        <a 
                          href="https://github.com/rkmahale17/algolib.io/issues/new" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Report Issue
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Tech Stack Section */}
            <motion.div variants={item}>
              <h2 className="text-3xl font-bold text-center mb-8">Built With Modern Tech</h2>
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Frontend */}
                <Card className="bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Layers className="w-5 h-5 text-blue-400" />
                      Frontend Core
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {["React 18", "TypeScript", "Vite", "Tailwind CSS", "Shadcn/UI", "Framer Motion"].map((tech) => (
                        <li key={tech} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Backend & Data */}
                <Card className="bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="w-5 h-5 text-green-400" />
                      Backend & Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {["Supabase (Auth & DB)", "Node.js (Server)", "Cloud Run (Hosting)", "Docker"].map((tech) => (
                        <li key={tech} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400/50" />
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Analytics & Tools */}
                <Card className="bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart className="w-5 h-5 text-orange-400" />
                      Analytics & Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {["Google Analytics 4", "Lovable (AI Assistant)", "GitHub Actions (CI/CD)"].map((tech) => (
                        <li key={tech} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400/50" />
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

              </div>
            </motion.div>

            {/* Contribute CTA */}
            <motion.div variants={item}>
              <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Join the Community</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    We welcome contributions! Whether it's adding new algorithms, fixing bugs, or improving documentation.
                  </p>
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <a 
                      href="https://github.com/rkmahale17/algolib.io#-contribute" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Start Contributing
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
