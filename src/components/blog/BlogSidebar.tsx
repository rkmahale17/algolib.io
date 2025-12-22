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
        { title: "Climbing Stairs", link: "/problem/climbing-stairs", description: "Classic DP problem" },
        { title: "House Robber", link: "/problem/house-robber", description: "Decision-making DP" },
        { title: "Coin Change", link: "/problem/coin-change", description: "Unbounded knapsack" }
      ];
    } else if (category?.toLowerCase().includes("graph")) {
      return [
        ...baseLinks,
        { title: "Graph DFS", link: "/problem/graph-dfs", description: "Depth-first search" },
        { title: "Graph BFS", link: "/problem/graph-bfs", description: "Breadth-first search" },
        { title: "Dijkstra's Algorithm", link: "/problem/dijkstras", description: "Shortest path" }
      ];
    } else if (category?.toLowerCase().includes("array")) {
      return [
        ...baseLinks,
        { title: "Two Sum", link: "/problem/two-sum", description: "Hash map technique" },
        { title: "Two Pointers", link: "/problem/two-pointers", description: "Efficient array traversal" },
        { title: "Kadane's Algorithm", link: "/problem/kadanes", description: "Maximum subarray" }
      ];
    }

    return baseLinks;
  };

  const relatedLinks = getRelatedLinks();

  return (
    <aside className="blog-sidebar space-y-4">
      {/* Games Promotion Card */}
      <Card className="blog-sidebar-card border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-primary" />
            Play & Learn
          </CardTitle>
          <CardDescription className="text-xs">
            Master algorithms through games
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.link}
                to={game.link}
                className="block group"
              >
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <Icon className={`w-4 h-4 ${game.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                      {game.title}
                    </h4>
                  </div>
                </div>
              </Link>
            );
          })}
          <Link to="/games">
            <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs mt-2">
              View All Games
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

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
              to={link.link}
              className="block group p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
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
