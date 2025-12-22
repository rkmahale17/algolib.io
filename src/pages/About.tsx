import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Github, Heart, Users } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About RulCode.com - Free Open Source Algorithm Learning Platform</title>
        <meta 
          name="description" 
          content="Learn about RulCode.com's mission to make algorithm learning accessible through interactive visualizations. 100% free, open-source, and community-driven platform for developers and competitive programmers." 
        />
        <meta 
          name="keywords" 
          content="about rulcode, algorithm learning platform, open source algorithms, free coding education, interactive algorithm visualizations" 
        />
        <link rel="canonical" href="https://rulcode.com/about" />
        
        <meta property="og:title" content="About RulCode.com - Free Algorithm Learning Platform" />
        <meta property="og:description" content="100% free and open-source platform for learning algorithms with interactive visualizations" />
        <meta property="og:url" content="https://rulcode.com/about" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About RulCode.com",
            "description": "RulCode.com is an open-source platform designed to make algorithm learning accessible, interactive, and enjoyable for everyone",
            "url": "https://rulcode.com/about",
            "mainEntity": {
              "@type": "EducationalOrganization",
              "name": "RulCode.com",
              "description": "Free and open-source algorithm library for competitive programming and coding interviews",
              "url": "https://rulcode.com"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">About RulCode.com</h1>
            <p className="text-xl text-muted-foreground">
              Learn, visualize, and master algorithms with interactive explanations
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                RulCode.com is an open-source platform designed to make algorithm learning accessible, 
                interactive, and enjoyable for everyone. We provide comprehensive explanations, 
                multi-language implementations, and visual representations of popular algorithms and 
                data structures.
              </p>
              <p className="text-muted-foreground">
                Whether you're preparing for coding interviews, learning computer science fundamentals, 
                or expanding your programming knowledge, RulCode.com offers a structured approach to 
                mastering algorithmic thinking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                100% Free & Open Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                RulCode.com is completely free to use and will remain so forever. Our entire codebase 
                is open source and available on GitHub, allowing developers to contribute, learn from 
                the code, and even fork the project for their own purposes.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <a 
                    href="https://github.com/rkmahale17/algolib.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://github.com/rkmahale17/algolib.io/issues/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Report an Issue
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contribute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We welcome contributions from the community! Help us expand RulCode.com with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>New algorithm implementations and explanations</li>
                <li>Improved visualizations and interactive examples</li>
                <li>Bug fixes and performance improvements</li>
                <li>Documentation and translation improvements</li>
              </ul>
              <p className="text-muted-foreground">
                Check out our GitHub repository to get started. Fork the project, make your changes, 
                and submit a pull request. Every contribution matters!
              </p>
              <Button variant="secondary" asChild>
                <a 
                  href="https://github.com/rkmahale17/algolib.io#-contribute" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Contribution Guidelines
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-muted-foreground">
                <div>⚡ Vite</div>
                <div>💎 TypeScript</div>
                <div>⚛️ React</div>
                <div>🎨 shadcn/ui</div>
                <div>💨 Tailwind CSS</div>
                <div>🔥 Lovable Cloud</div>
              </div>
            </CardContent>
          </Card>
        </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
