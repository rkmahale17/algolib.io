import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PremiumLoader } from "@/components/PremiumLoader";
import type { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

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
            .single();
        
        if (profileError) throw profileError;
        setProfile({ ...profileData, is_public: true } as Profile);

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
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
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
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Profile!</h2>
            <p className="text-muted-foreground mb-6">
              Set up your username to make your profile shareable and start tracking your progress.
            </p>
            <Button onClick={() => setIsEditOpen(true)} size="lg">
              Set Up Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;
