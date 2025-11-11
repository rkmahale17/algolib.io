import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  level: number;
  moves: number;
  grade: string;
  completed_at: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [allTimeData, setAllTimeData] = useState<LeaderboardEntry[]>([]);
  const [todayData, setTodayData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    
    // All-time leaderboard
    const { data: allTime } = await supabase
      .from('game_sessions')
      .select('id, user_id, score, level, moves, grade, completed_at')
      .eq('game_type', 'sort_hero')
      .order('score', { ascending: false })
      .limit(100);

    // Today's leaderboard
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const { data: today } = await supabase
      .from('game_sessions')
      .select('id, user_id, score, level, moves, grade, completed_at')
      .eq('game_type', 'sort_hero')
      .gte('completed_at', todayStart.toISOString())
      .order('score', { ascending: false })
      .limit(100);

    setAllTimeData(allTime || []);
    setTodayData(today || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_sessions'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-700" />;
    return <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>;
  };

  const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => (
    <div className="space-y-2">
      {data.map((entry, index) => (
        <div
          key={entry.id}
          className="flex items-center gap-4 p-4 bg-card/50 rounded-lg hover:bg-card transition-colors"
        >
          <div className="flex-shrink-0">{getRankIcon(index)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">Player {entry.user_id.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground">Level {entry.level} • {entry.moves} moves</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{entry.score}</p>
            <p className="text-sm text-muted-foreground">Grade: {entry.grade}</p>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No data yet. Be the first to play!</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">Top players - Sort Hero</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/games')}>
            Back to Games
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="alltime" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="alltime">All Time</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
              </TabsList>
              <TabsContent value="alltime" className="mt-4">
                {loading ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : (
                  <LeaderboardTable data={allTimeData} />
                )}
              </TabsContent>
              <TabsContent value="today" className="mt-4">
                {loading ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : (
                  <LeaderboardTable data={todayData} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
