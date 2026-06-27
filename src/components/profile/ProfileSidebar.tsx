import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Globe,
  Lock,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Flame,
  Trophy,
  CalendarDays,
  Zap,
  ExternalLink,
} from "lucide-react";
import type { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { ShareableProfileLink } from "./ShareableProfileLink";

interface ProfileSidebarProps {
  profile: Profile;
  onEdit: () => void;
  isOwnProfile: boolean;
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={label}
    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 group"
  >
    <Icon className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
    <span className="truncate">{label}</span>
  </a>
);

const StatRow = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <span>{label}</span>
    </div>
    <span className={cn("text-sm font-semibold tabular-nums", color)}>
      {value}
      <span className="text-[10px] font-normal text-muted-foreground ml-1">
        {label.toLowerCase().includes("day") ? "days" : ""}
      </span>
    </span>
  </div>
);

export const ProfileSidebar = ({
  profile,
  onEdit,
  isOwnProfile,
  currentStreak,
  longestStreak,
  totalActiveDays,
}: ProfileSidebarProps) => {
  const tierLabel =
    profile.subscription_tier === "pro"
      ? "Pro"
      : profile.subscription_tier === "ultra"
      ? "Ultra"
      : "Free";

  const tierColors =
    profile.subscription_tier === "ultra"
      ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
      : profile.subscription_tier === "pro"
      ? "bg-[#E5FF7F]/15 text-[#c8e44a] border-[#E5FF7F]/30"
      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  const initials =
    profile.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    profile.username?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Avatar + Identity */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative group">
          {/* Glow ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 via-violet-500/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary/60 to-violet-500/40 opacity-30" />
          <Avatar className="w-20 h-20 border-2 border-background shadow-xl relative z-10">
            <AvatarImage
              src={profile.avatar_url || ""}
              alt={profile.full_name || "Profile"}
              className="object-cover"
            />
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {isOwnProfile && (
            <Button
              onClick={onEdit}
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 z-20 w-7 h-7 rounded-full shadow-lg border border-border/60 hover:bg-primary hover:text-black transition-all duration-200"
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Name + Badge */}
        <div className="space-y-1">
          <h1 className="text-base font-bold text-foreground leading-tight">
            {profile.full_name || profile.username || "User"}
          </h1>
          {profile.username && (
            <p className="text-xs text-muted-foreground">@{profile.username}</p>
          )}

          <div className="flex items-center justify-center gap-2 mt-1.5">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-2 h-5 font-semibold border",
                tierColors
              )}
            >
              <Zap className="w-2.5 h-2.5 mr-1" />
              {tierLabel}
            </Badge>

            {isOwnProfile && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-2 h-5 font-medium border",
                  profile.is_public
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                )}
              >
                {profile.is_public ? (
                  <Globe className="w-2.5 h-2.5 mr-1" />
                ) : (
                  <Lock className="w-2.5 h-2.5 mr-1" />
                )}
                {profile.is_public ? "Public" : "Private"}
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 text-left w-full">
            {profile.bio}
          </p>
        )}

        {/* Edit button for own profile */}
        {isOwnProfile && (
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-border/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
          >
            <Edit className="w-3 h-3 mr-1.5" />
            Edit Profile
          </Button>
        )}

        {/* Shareable profile capsule — shown for public profiles */}
        {profile.username && profile.is_public && (
          <ShareableProfileLink
            username={profile.username}
            className="w-full mt-1"
          />
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      {/* Info Links */}
      <div className="space-y-2.5">
        {profile.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
            <span>{profile.location}</span>
          </div>
        )}
        {profile.website_url && (
          <SocialLink
            href={profile.website_url}
            icon={ExternalLink}
            label={profile.website_url.replace(/^https?:\/\//, "")}
          />
        )}
        {profile.github_url && (
          <SocialLink
            href={profile.github_url}
            icon={Github}
            label={
              profile.github_url.replace(/^https?:\/\/(www\.)?github\.com\//, "") ||
              "GitHub"
            }
          />
        )}
        {profile.linkedin_url && (
          <SocialLink
            href={profile.linkedin_url}
            icon={Linkedin}
            label={
              profile.linkedin_url.replace(
                /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                ""
              ) || "LinkedIn"
            }
          />
        )}
        {profile.twitter_url && (
          <SocialLink
            href={profile.twitter_url}
            icon={Twitter}
            label={
              profile.twitter_url.replace(
                /^https?:\/\/(www\.)?twitter\.com\//,
                "@"
              ) || "Twitter"
            }
          />
        )}
      </div>

      {/* Divider */}
      {(currentStreak > 0 || longestStreak > 0 || totalActiveDays > 0) && (
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      )}

      {/* Activity Stats */}
      <div className="space-y-0 rounded-xl bg-muted/20 border border-border/30 px-4 py-2 divide-y divide-border/20">
        <StatRow
          icon={Flame}
          label="Current Streak"
          value={currentStreak}
          color="text-orange-400"
        />
        <StatRow
          icon={Trophy}
          label="Max Streak"
          value={longestStreak}
          color="text-amber-400"
        />
        <StatRow
          icon={CalendarDays}
          label="Active Days"
          value={totalActiveDays}
          color="text-primary"
        />
      </div>
    </div>
  );
};
