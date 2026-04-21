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
    subscription_status: 'trialing' | 'active' | 'canceled' | 'none' | null;
    subscription_id: string | null;
    subscription_tier: 'free' | 'pro' | 'ultra' | null;
    subscription_duration: string | null;
    subscription_plan_id: string | null;
    trial_end_date: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
    role: 'user' | 'admin';
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
    subscription_status?: 'trialing' | 'active' | 'canceled' | 'none' | null;
    subscription_id?: string | null;
    subscription_tier?: 'free' | 'pro' | 'ultra' | null;
    subscription_duration?: string | null;
    subscription_plan_id?: string | null;
    trial_end_date?: string | null;
    current_period_end?: string | null;
    cancel_at_period_end?: boolean;
    role?: 'user' | 'admin';
}
