import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Globe, Lock, MapPin, Link as LinkIcon, Building2, Github, Linkedin, Twitter } from "lucide-react";
import type { Profile } from "@/types/profile";
import { ShareableProfileLink } from "./ShareableProfileLink";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
  profile: Profile;
  onEdit: () => void;
  isOwnProfile: boolean;
}

const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
    title={label}
  >
    <Icon className="w-4 h-4" />
    <span className="sr-only">{label}</span>
  </a>
);

export const ProfileHeader = ({ profile, onEdit, isOwnProfile }: ProfileHeaderProps) => {
  return (
    <Card className="w-full h-full border border-border/40 shadow-sm bg-card overflow-hidden sticky top-24 flex flex-col justify-center">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Main Identity Row: Avatar + Name/Badge/Username (Centrally Aligned) */}
          <div className="flex items-center gap-6">
            {/* Avatar Section with Edit Button */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <Avatar className="w-24 h-24 border-2 border-background shadow-md relative z-10">
                <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || "Profile"} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
                  {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {/* Edit Button Overlay on Photo */}
              {isOwnProfile && (
                <Button
                  onClick={onEdit}
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 z-20 w-8 h-8 rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 translate-x-1/4"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Info Section - Vertically Centered with Avatar */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-foreground leading-tight truncate">
                  {profile.full_name || "User"}
                </h1>

                {/* Privacy Badge - Bigger & Prominent */}
                {isOwnProfile && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-bold text-[10px] px-2.5 h-6 border shadow-sm shrink-0",
                      profile.is_public ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    )}
                  >
                    {profile.is_public ? <Globe className="w-3 h-3 mr-1.5" /> : <Lock className="w-3 h-3 mr-1.5" />}
                    {profile.is_public ? "Public Profile" : "Private Profile"}
                  </Badge>
                )}
              </div>

              {profile.username && (
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    @{profile.username}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info & Public Card (Shareable Link) Section */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Shareable Profile Link (The "Public Card") - Only for Public Profiles */}
            {profile.username && profile.is_public && (
              <div className="shrink-0 w-full sm:w-auto">
                <ShareableProfileLink
                  username={profile.username}
                  className="bg-muted/10 hover:bg-muted/20 border border-border/20 shadow-sm p-4 rounded-xl transition-all duration-300"
                />
              </div>
            )}

            {/* Bio & Footer Info */}
            <div className="flex-1 w-full space-y-3">
              {profile.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">
                  "{profile.bio}"
                </p>
              )}

              {/* Footer Info: Location/Company */}
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                {profile.location && (
                  <div className="flex items-center gap-1 shrink-0">
                    <MapPin className="w-2.5 h-2.5 text-primary/70" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.company && (
                  <div className="flex items-center gap-1 shrink-0 border-l border-border/40 pl-4">
                    <Building2 className="w-2.5 h-2.5 text-primary/70" />
                    <span>{profile.company}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
