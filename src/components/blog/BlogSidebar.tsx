import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Code2, Layers, Target } from "lucide-react";

const relatedLinks = [
  {
    title: "Algorithm Visualizations",
    link: "/algorithms",
    icon: Code2,
  },
  {
    title: "Blind 75 List",
    link: "/dsa/blind-75",
    icon: Target,
  },
  {
    title: "Learning Roadmap",
    link: "/dsa/get-started",
    icon: Layers,
  },
];

export const BlogSidebar = ({ category }: BlogSidebarProps) => {
  return (
    <aside className="blog-sidebar space-y-4">
      {/* Related Links Card */}
      <Card className="blog-sidebar-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Related Resources</CardTitle>
          <CardDescription className="text-xs">
            Continue learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {relatedLinks.map((link) => (
            <Link
              key={link.link}
              href={link.link}
              className="block group p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <link.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                    {link.title}
                  </h4>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};
