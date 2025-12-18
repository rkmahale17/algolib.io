import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const Games = () => {
  const navigate = useNavigate();
  
  const games = [
    {
      id: "sort-hero",
      name: "Sort Hero",
      description: "Learn sorting algorithms through interactive gameplay",
      icon: Brain,
      difficulty: "Beginner to Advanced",
      category: "Algorithms"
    },
    {
      id: "graph-explorer",
      name: "Graph Explorer",
      description: "Traverse mazes and learn BFS/DFS graph algorithms visually",
      icon: Brain,
      difficulty: "Intermediate",
      category: "Graph Algorithms"
    },
    {
      id: "stack-master",
      name: "Stack Master",
      description: "Master stack operations with fast-paced symbol matching",
      icon: Brain,
      difficulty: "All Levels",
      category: "Data Structures"
    },
    {
      id: "dp-puzzle",
      name: "DP Puzzle Grid",
      description: "Master Dynamic Programming by filling tables for Fibonacci, Knapsack, LCS, and more",
      icon: Brain,
      difficulty: "Intermediate to Advanced",
      category: "Dynamic Programming"
    },
    {
      id: "sliding-window",
      name: "Sliding Window Ninja",
      description: "Master the sliding window technique by expanding and shrinking to find optimal subarrays",
      icon: Brain,
      difficulty: "Beginner to Advanced",
      category: "Two Pointers"
    },
    {
      id: "two-pointer",
      name: "Two Pointer Race",
      description: "Find valid pairs using two pointers moving from opposite ends of the array",
      icon: Brain,
      difficulty: "Beginner to Intermediate",
      category: "Two Pointers"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Algorithmic Games - Learn Algorithms Interactively | Rulcode.com</title>
        <meta
          name="description"
          content="Master data structures and algorithms through interactive games. Play Sort Hero, Graph Explorer, Stack Master, DP Puzzle, Sliding Window Ninja, and Two Pointer Race. Free educational games for coding interview preparation."
        />
        <meta name="keywords" content="algorithm games, coding games, interactive learning, data structures games, competitive programming practice, sorting algorithms game, graph algorithms game" />
        <link rel="canonical" href="https://rulcode.com/games" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Algorithmic Games - Learn Through Play" />
        <meta property="og:description" content="Master algorithms through interactive games and challenges." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/games" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Algorithmic Games - Interactive Learning" />
        <meta name="twitter:description" content="Master algorithms through fun, interactive games." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Algorithmic Games",
            "description": "Interactive algorithm learning games",
            "url": "https://rulcode.com/games",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": games.map((game, index) => ({
                "@type": "Game",
                "position": index + 1,
                "name": game.name,
                "description": game.description,
                "gamePlatform": "Web Browser",
                "educationalLevel": game.difficulty
              }))
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            ALGORITHMIC GAMES
          </h1>
          <p className="text-muted-foreground">Master algorithms through interactive challenges</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link key={game.id} to={`/games/${game.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>{game.name}</CardTitle>
                    </div>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{game.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <span className="font-medium">{game.difficulty}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <Link to="/games/leaderboard">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>Global Leaderboard</CardTitle>
                    <CardDescription>See how you rank against other players</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
        </div>
      </div>
    </>
  );
};

export default Games;
