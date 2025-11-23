import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2, Trophy, Brain, Zap } from "lucide-react";

interface BlogSidebarProps {
  category?: string;
}

export const BlogSidebar = ({ category }: BlogSidebarProps) => {
  const games = [
    {
      title: "Sort Hero",
      description: "Master sorting algorithms through interactive gameplay",
      icon: Trophy,
      link: "/games/sort-hero",
      color: "text-purple-500"
    },
    {
      title: "Graph Explorer",
      description: "Navigate mazes and learn graph traversal",
      icon: Brain,
      link: "/games/graph-explorer",
      color: "text-blue-500"
    },
    {
      title: "Stack Master",
      description: "Practice stack operations with falling symbols",
      icon: Zap,
      link: "/games/stack-master",
      color: "text-orange-500"
    },
    {
      title: "DP Puzzle",
      description: "Solve dynamic programming challenges",
      icon: Gamepad2,
      link: "/games/dp-puzzle",
      color: "text-green-500"
    }
  ];

  const getRelatedLinks = () => {
    const baseLinks = [
      { title: "All Algorithms", link: "/", description: "Explore all algorithm visualizations" },
      { title: "Blind 75", link: "/blind75", description: "Top 75 LeetCode problems" }
    ];

    if (category?.toLowerCase().includes("dynamic")) {
      return [
        ...baseLinks,
        { title: "Climbing Stairs", link: "/algorithm/climbing-stairs", description: "Classic DP problem" },
        { title: "House Robber", link: "/algorithm/house-robber", description: "Decision-making DP" },
        { title: "Coin Change", link: "/algorithm/coin-change", description: "Unbounded knapsack" }
      ];
    } else if (category?.toLowerCase().includes("graph")) {
      return [
        ...baseLinks,
        { title: "Graph DFS", link: "/algorithm/graph-dfs", description: "Depth-first search" },
        { title: "Graph BFS", link: "/algorithm/graph-bfs", description: "Breadth-first search" },
        { title: "Dijkstra's Algorithm", link: "/algorithm/dijkstras", description: "Shortest path" }
      ];
    } else if (category?.toLowerCase().includes("array")) {
      return [
        ...baseLinks,
        { title: "Two Sum", link: "/algorithm/two-sum", description: "Hash map technique" },
        { title: "Two Pointers", link: "/algorithm/two-pointers", description: "Efficient array traversal" },
        { title: "Kadane's Algorithm", link: "/algorithm/kadanes", description: "Maximum subarray" }
      ];
    }

    return baseLinks;
  };

  const relatedLinks = getRelatedLinks();

  return (
    <aside className="blog-sidebar space-y-6">
      {/* Games Promotion Card */}
      <Card className="blog-sidebar-card border-primary/20">
        <CardHeader>
          <CardTitle className="blog-sidebar-title flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            Play & Learn
          </CardTitle>
          <CardDescription>
            Master algorithms through interactive games
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.link}
                to={game.link}
                className="block group"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Icon className={`w-5 h-5 ${game.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {game.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
          <Link to="/games">
            <Button variant="outline" size="sm" className="w-full gap-2">
              View All Games
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Related Links Card */}
      <Card className="blog-sidebar-card">
        <CardHeader>
          <CardTitle className="blog-sidebar-title">Related Resources</CardTitle>
          <CardDescription>
            Continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {relatedLinks.map((link) => (
            <Link
              key={link.link}
              to={link.link}
              className="block group p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};
