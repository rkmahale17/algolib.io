export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    company: string | null;
    location: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    github_url: string | null;
    website_url: string | null;
    username: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdateData {
    full_name?: string | null;
    bio?: string | null;
    company?: string | null;
    location?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
    github_url?: string | null;
    website_url?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    is_public?: boolean;
}
