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
    <Card className="w-full border-none shadow-sm bg-card overflow-hidden sticky top-24">
         <CardContent className="pt-8 pb-8 px-6 flex flex-col items-center text-center">
            {/* Avatar with Ring */}
            <div className="relative mb-4 group">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-sm relative z-10">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || "Profile"} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
                    {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                 {/* Privacy Badge */}
                {isOwnProfile && (
                  <div className="absolute bottom-0 right-0 z-20 translate-y-1/4">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "font-medium shadow-sm border text-[10px] px-1.5 h-5",
                        profile.is_public ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      )}
                    >
                      {profile.is_public ? <Globe className="w-2.5 h-2.5 mr-1" /> : <Lock className="w-2.5 h-2.5 mr-1" />}
                      {profile.is_public ? "Public" : "Private"}
                    </Badge>
                  </div>
                )}
            </div>

            {/* Name & Handle */}
            <h1 className="text-xl font-bold text-foreground mb-1 tracking-tight">
              {profile.full_name || "User"}
            </h1>
            {profile.username && (
              <div className="flex items-center gap-2 justify-center mb-4">
                <p className="text-sm text-muted-foreground font-medium">
                  @{profile.username}
                </p>
                {profile.username.startsWith('user_') && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    Set Username
                  </Badge>
                )}
              </div>
            )}

            {/* Action Button */}
             {isOwnProfile && (
                 <Button onClick={onEdit} className="w-auto px-8 mx-auto mb-6 font-medium text-xs h-9 block" size="sm">
                    Edit Profile
                 </Button>
             )}

            {/* Bio */}
            {profile.bio && (
                 <p className="text-sm text-muted-foreground leading-relaxed mb-6 px-2">
                  {profile.bio}
                </p>
            )}

            <div className="w-full space-y-3 mb-6">
                {(profile.location || profile.company || profile.website_url) && (
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground items-center">
                        {profile.location && (
                        <div className="flex items-center gap-2 w-full justify-center">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{profile.location}</span>
                        </div>
                        )}
                        {profile.company && (
                        <div className="flex items-center gap-2 w-full justify-center">
                            <Building2 className="w-3.5 h-3.5" />
                            <span className="truncate">{profile.company}</span>
                        </div>
                        )}
                        {profile.website_url && (
                        <a href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full justify-center hover:text-primary transition-colors">
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[180px]">Website</span>
                        </a>
                        )}
                    </div>
                )}
            </div>

            {/* Social Links */}
             <div className="flex items-center justify-center gap-3 w-full border-t pt-4 border-border/40">
                {profile.github_url && <SocialLink href={profile.github_url} icon={Github} label="GitHub" />}
                {profile.twitter_url && <SocialLink href={profile.twitter_url} icon={Twitter} label="Twitter" />}
                {profile.linkedin_url && <SocialLink href={profile.linkedin_url} icon={Linkedin} label="LinkedIn" />}
             </div>


             {/* Share Section - Show for all profiles with username */}
            {profile.username && (
                <div className="w-full mt-6 pt-4 border-t border-border/40">
                    <ShareableProfileLink username={profile.username} className="bg-muted/30 border-none shadow-none text-xs p-3" />
                </div>
            )}
         </CardContent>
    </Card>
  );
};
