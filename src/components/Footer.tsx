import { Link } from "react-router-dom";
import { Github, Heart, ExternalLink, Coffee } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">AlgoLib.io</h3>
            <p className="text-sm text-muted-foreground">
              Open-source platform to learn, visualize, and master algorithms.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span>100% Free Forever</span>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/rkmahale17/algolib.io#-algorithm-index" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Algorithm Index
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Community</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/rkmahale17/algolib.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/rkmahale17/algolib.io/issues/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Report Issue
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/rkmahale17/algolib.io#-contribute" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contribute
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/content-rights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Content Rights
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} AlgoLib.io. Open source and free forever.
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-xs text-muted-foreground">
                <a 
                  href="https://neetcode.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  With Neetcode videos
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="hidden sm:inline">•</span>
                <a 
                  href="https://jsonmaster.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Recommended: JSONMaster.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://github.com/rkmahale17/algolib.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Star on GitHub
                </a>
              </Button>
              <Button size="sm" asChild className="bg-[#FFDD00] text-[#000000] hover:bg-[#FFDD00]/90">
                <a 
                  href="https://www.buymeacoffee.com/yourusername" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  Buy Me a Coffee
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
