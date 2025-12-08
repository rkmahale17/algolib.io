import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Profile, ProfileUpdateData } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onSave: () => void;
}

export const EditProfileDialog = ({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState<ProfileUpdateData>({
    full_name: profile.full_name,
    username: profile.username,
    bio: profile.bio,
    company: profile.company,
    location: profile.location,
    website_url: profile.website_url,
    github_url: profile.github_url,
    twitter_url: profile.twitter_url,
    linkedin_url: profile.linkedin_url,
  });
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check username availability
  const checkUsername = async (username: string) => {
    if (!username || username === profile.username) {
        setUsernameError(null);
        return;
    }

    if (username.length < 3) {
        setUsernameError("Username must be at least 3 characters");
        return;
    }

    setCheckingUsername(true);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .neq('id', profile.id) // Exclude current user
            .maybeSingle();

        if (error) throw error;

        if (data) {
            setUsernameError("Username is already taken");
        } else {
            setUsernameError(null);
        }
    } catch (err) {
        console.error("Error checking username:", err);
    } finally {
        setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError || checkingUsername) return;

    setSaving(true);
    try {
        const { error } = await supabase
            .from('profiles')
            .update(formData)
            .eq('id', profile.id);

        if (error) throw error;
        toast.success("Profile updated successfully");
        onSave();
    } catch (error) {
        toast.error("Failed to update profile");
        console.error(error);
    } finally {
        setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input 
                        id="full_name" 
                        value={formData.full_name || ''} 
                        onChange={e => setFormData({...formData, full_name: e.target.value})} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                        <Input 
                            id="username" 
                            value={formData.username || ''} 
                            onChange={e => {
                                setFormData({...formData, username: e.target.value});
                                setUsernameError(null); // Clear error while typing
                            }}
                            onBlur={(e) => checkUsername(e.target.value)}
                            className={usernameError ? "border-red-500" : ""}
                        />
                        {checkingUsername && (
                            <div className="absolute right-3 top-2.5">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    {usernameError && (
                        <p className="text-xs text-red-500">{usernameError}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                    id="bio" 
                    value={formData.bio || ''} 
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    rows={3} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                        id="company" 
                        value={formData.company || ''} 
                        onChange={e => setFormData({...formData, company: e.target.value})} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                        id="location" 
                        value={formData.location || ''} 
                        onChange={e => setFormData({...formData, location: e.target.value})} 
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                            id="website" 
                            placeholder="https://"
                            value={formData.website_url || ''} 
                            onChange={e => setFormData({...formData, website_url: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input 
                            id="github" 
                            placeholder="https://github.com/..."
                            value={formData.github_url || ''} 
                            onChange={e => setFormData({...formData, github_url: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <Input 
                            id="twitter" 
                            placeholder="https://x.com/..."
                            value={formData.twitter_url || ''} 
                            onChange={e => setFormData({...formData, twitter_url: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                            id="linkedin" 
                            placeholder="https://linkedin.com/in/..."
                            value={formData.linkedin_url || ''} 
                            onChange={e => setFormData({...formData, linkedin_url: e.target.value})} 
                        />
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
