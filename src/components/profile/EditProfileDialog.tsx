import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Profile, ProfileUpdateData } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";

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
    is_public: profile.is_public,
  });
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameValid, setUsernameValid] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const isPrivateProfileEnabled = useFeatureFlag('profile_private');

  // Debounced username validation
  const checkUsername = useCallback(async (username: string) => {
    if (!username || username === profile.username) {
        setUsernameError(null);
        setUsernameValid(username === profile.username);
        return;
    }

    // Validate format
    if (username.length < 3) {
        setUsernameError("Username must be at least 3 characters");
        setUsernameValid(false);
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameError("Username can only contain letters, numbers, and underscores");
        setUsernameValid(false);
        return;
    }

    setCheckingUsername(true);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .neq('id', profile.id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            setUsernameError("Username is already taken");
            setUsernameValid(false);
        } else {
            setUsernameError(null);
            setUsernameValid(true);
        }
    } catch (err) {
        console.error("Error checking username:", err);
        setUsernameError("Failed to check username availability");
        setUsernameValid(false);
    } finally {
        setCheckingUsername(false);
    }
  }, [profile.username, profile.id]);

  // Debounce username checking
  useEffect(() => {
    if (!formData.username) {
      setUsernameError(null);
      setUsernameValid(false);
      return;
    }

    const timer = setTimeout(() => {
      checkUsername(formData.username!);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, checkUsername]);

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
                                const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                setFormData({...formData, username: value});
                            }}
                            placeholder="johndoe"
                            className={usernameError ? "border-red-500 pr-10" : usernameValid && formData.username ? "border-green-500 pr-10" : "pr-10"}
                        />
                        <div className="absolute right-3 top-2.5">
                            {checkingUsername && (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                            {!checkingUsername && usernameValid && formData.username && formData.username !== profile.username && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {!checkingUsername && usernameError && (
                                <XCircle className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                    </div>
                    {usernameError && (
                        <p className="text-xs text-red-500">{usernameError}</p>
                    )}
                    {usernameValid && formData.username && !usernameError && formData.username !== profile.username && (
                        <p className="text-xs text-green-600">Username is available!</p>
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
                    placeholder="Tell us about yourself..."
                />
            </div>

            {/* Privacy Toggle - Only show if feature flag is enabled */}
            {isPrivateProfileEnabled && (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-0.5">
                        <Label htmlFor="is_public" className="text-base">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                            Allow others to view your profile at /profile/{formData.username || 'username'}
                        </p>
                    </div>
                    <Switch
                        id="is_public"
                        checked={formData.is_public ?? true}
                        onCheckedChange={(checked) => setFormData({...formData, is_public: checked})}
                    />
                </div>
            )}

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
                <Button type="submit" disabled={saving || checkingUsername || (!!formData.username && !!usernameError)}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
