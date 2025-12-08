import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Link as LinkIcon, Github, Twitter, Linkedin, Building2, Edit } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  onEdit: () => void;
  isOwnProfile: boolean;
}

export const ProfileHeader = ({ profile, onEdit, isOwnProfile }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Avatar Section */}
      <div className="shrink-0 relative group">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
          <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || "Profile"} className="object-cover" />
          <AvatarFallback className="text-4xl bg-primary/10 text-primary">
            {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info Section */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {profile.full_name || "Anonymous User"}
            </h1>
            {profile.username && (
              <Badge variant="secondary" className="text-sm font-mono opacity-70">
                @{profile.username}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground bio-text max-w-2xl text-lg leading-relaxed">
            {profile.bio || "No bio yet."}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {profile.company && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{profile.company}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <LinkIcon className="w-4 h-4" />
              <span>Website</span>
            </a>
          )}
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {profile.twitter_url && (
            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>

        {/* Actions */}
        {isOwnProfile && (
          <div className="pt-2">
             <Button onClick={onEdit} variant="outline" className="gap-2">
               <Edit className="w-4 h-4" />
               Edit Profile
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};
