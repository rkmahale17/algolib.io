import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SubmissionHeatmap } from "@/components/profile/SubmissionHeatmap";
import { ProgressStats } from "@/components/profile/ProgressStats";
import { RecentSubmissions } from "@/components/profile/RecentSubmissions";
import { PremiumLoader } from "@/components/PremiumLoader";
import type { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalQuestions: 0, 
    easySolved: 0,
    easyTotal: 0, // Need to calculate
    mediumSolved: 0,
    mediumTotal: 0,
    hardSolved: 0,
    hardTotal: 0,
    heatmapData: [] as { date: string; count: number }[],
    recentSubmissions: [] as any[]
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/auth');
            return;
        }

        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        // 2. Fetch User Algorithm Data (Stats)
        const { data: algoData, error: algoError } = await supabase
            .from('user_algorithm_data')
            .select('*')
            .eq('user_id', user.id);

        if (algoError) throw algoError;

        // 3. Fetch All Algorithms Metadata (for totals and names)
        const { data: allAlgorithms, error: metaError } = await supabase
            .from('algorithms')
            .select('id, name, difficulty');
        
        if (metaError) throw metaError;

        // Process Stats
        let easy = 0, med = 0, hard = 0;
        let heatmapRaw: Record<string, number> = {};
        let recents: any[] = [];

        // Create a map for quick lookup of algo details
        const algoMap = new Map();
        allAlgorithms?.forEach(a => algoMap.set(a.id, a));
        
        // Count solved
        algoData?.forEach(entry => {
            if (entry.completed) {
                // Find algo difficulty from DB metadata
                const algo = algoMap.get(entry.algorithm_id);
                const diff = algo?.difficulty?.toLowerCase();
                if (diff === 'easy') easy++;
                else if (diff === 'medium') med++;
                else if (diff === 'hard') hard++;
            }

            // Process submissions for heatmap and recents
            const subs = (entry.submissions as any[]) || [];
            subs.forEach(s => {
                const date = s.timestamp.split('T')[0];
                heatmapRaw[date] = (heatmapRaw[date] || 0) + 1;
                
                recents.push({
                    id: s.id,
                    algorithmId: entry.algorithm_id,
                    algorithmName: algoMap.get(entry.algorithm_id)?.name || entry.algorithm_id, 
                    status: s.status,
                    timestamp: s.timestamp,
                    language: s.language
                });
            });
        });

        // Calculate Totals from DB metadata
        const totalEasy = allAlgorithms?.filter(a => a.difficulty.toLowerCase() === 'easy').length || 0;
        const totalMed = allAlgorithms?.filter(a => a.difficulty.toLowerCase() === 'medium').length || 0;
        const totalHard = allAlgorithms?.filter(a => a.difficulty.toLowerCase() === 'hard').length || 0;

        setStats({
            totalSolved: easy + med + hard,
            totalQuestions: allAlgorithms?.length || 0,
            easySolved: easy,
            easyTotal: totalEasy,
            mediumSolved: med,
            mediumTotal: totalMed,
            hardSolved: hard,
            hardTotal: totalHard,
            heatmapData: Object.entries(heatmapRaw).map(([date, count]) => ({ date, count })),
            recentSubmissions: recents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <PremiumLoader text="Loading Profile..." />;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <ProfileHeader 
            profile={profile} 
            onEdit={() => setIsEditOpen(true)} 
            isOwnProfile={true} 
        />

        {/* Edit Dialog (Lazy loaded or conditional) */}
        {isEditOpen && (
            <EditProfileDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                profile={profile} 
                onSave={() => {
                    fetchProfileData(); // Reload data
                    setIsEditOpen(false);
                }}
            />
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Submission Heatmap (Spans 2 cols on large) */}
            <div className="lg:col-span-2">
                <SubmissionHeatmap submissions={stats.heatmapData} />
            </div>

            {/* Right Col: Progress Stats */}
            <div className="lg:col-span-1">
                <ProgressStats 
                    totalSolved={stats.totalSolved}
                    totalQuestions={stats.totalQuestions}
                    easySolved={stats.easySolved}
                    easyTotal={stats.easyTotal}
                    mediumSolved={stats.mediumSolved}
                    mediumTotal={stats.mediumTotal}
                    hardSolved={stats.hardSolved}
                    hardTotal={stats.hardTotal}
                />
            </div>

            {/* Full Width: Recent Activity */}
            <div className="lg:col-span-3">
                <RecentSubmissions submissions={stats.recentSubmissions} />
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
