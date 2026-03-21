import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PremiumLoader } from "@/components/PremiumLoader";
import type { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { SidebarLayout } from '@/components/SidebarLayout';
import { cn } from "@/lib/utils";

const ProfileEdit = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile({ ...profileData, is_public: true } as any as Profile);

      // If user has username, redirect to public view
      if (profileData?.username) {
        navigate(`/profile/${profileData.username}`);
      }
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
    <SidebarLayout>
      <div className="min-h-screen bg-background pt-8 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <ProfileHeader
            profile={profile}
            onEdit={() => setIsEditOpen(true)}
            isOwnProfile={true}
          />

          {/* Edit Dialog */}
          {isEditOpen && (
            <EditProfileDialog
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              profile={profile}
              onSave={() => {
                fetchProfileData();
                setIsEditOpen(false);
              }}
            />
          )}

          {/* Message to set username */}
          {!profile.username && (
            <div className="text-center py-12">
              <h2 className="text-2xl font- mb-4">Welcome to Your Profile!</h2>
              <p className="text-muted-foreground mb-6">
                Set up your username to make your profile shareable and start tracking your progress.
              </p>
              <Button onClick={() => setIsEditOpen(true)} size="lg">
                Set Up Profile
              </Button>
            </div>
          )}

          {/* Billing Section */}
          <div id="billing" className="border border-border rounded-2xl bg-card p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Subscription & Billing</h3>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                {profile.subscription_status === 'active' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Current Plan:</span>
                      <span className={cn(
                        "px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border",
                        profile.cancel_at_period_end
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-green-500/10 text-green-600 border-green-500/20"
                      )}>
                        {profile.subscription_tier || 'Pro'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground tracking-tight">Status: </span>
                      <span className={cn(
                        "font-semibold",
                        profile.cancel_at_period_end ? "text-amber-600" : "text-green-500"
                      )}>
                        {profile.cancel_at_period_end ? 'CANCELLED (Active until end)' : 'ACTIVE'}
                      </span>
                    </div>
                    {profile.current_period_end && (
                      <div className="text-sm text-muted-foreground italic">
                        {profile.cancel_at_period_end ? 'Access ends on: ' : 'Next billing date: '}
                        <span className="text-foreground font-medium">{(() => {
                          const date = new Date(profile.current_period_end);
                          if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return 'N/A';
                          return date.toLocaleDateString();
                        })()}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">No active plan.</p>
                    <p className="text-lg font-medium">Get a plan to unlock all features</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/pricing')}
                  className={cn(
                    "font-semibold",
                    profile.subscription_status === 'active' ? "bg-muted text-foreground hover:bg-muted/80" : "bg-[#E5FF7F] text-black hover:bg-[#d6f555]"
                  )}
                >
                  {profile.subscription_status === 'active' ? 'Manage Subscription' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ProfileEdit;
