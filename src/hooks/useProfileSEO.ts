import { useEffect } from "react";
import type { Profile } from "@/types/profile";

export const useProfileSEO = (profile: Profile | null) => {
    useEffect(() => {
        if (!profile) return;

        const siteName = "RulCode";
        const baseUrl = window.location.origin;
        const profileUrl = `${baseUrl}/profile/${profile.username}`;

        // Set document title
        const title = profile.full_name
            ? `${profile.full_name} (@${profile.username}) - ${siteName}`
            : `@${profile.username} - ${siteName}`;
        document.title = title;

        // Helper to set or update meta tag
        const setMetaTag = (property: string, content: string, isName = false) => {
            const attr = isName ? "name" : "property";
            let tag = document.querySelector(`meta[${attr}="${property}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute(attr, property);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        // Basic meta tags
        const description = profile.bio || `Check out ${profile.full_name || profile.username}'s coding profile on RulCode. View their algorithm solutions, progress, and achievements.`;
        setMetaTag("description", description, true);

        // Open Graph tags
        setMetaTag("og:type", "profile");
        setMetaTag("og:title", title);
        setMetaTag("og:description", description);
        setMetaTag("og:url", profileUrl);
        setMetaTag("og:site_name", siteName);
        if (profile.avatar_url) {
            setMetaTag("og:image", profile.avatar_url);
        }

        // Twitter Card tags
        setMetaTag("twitter:card", "summary", true);
        setMetaTag("twitter:title", title, true);
        setMetaTag("twitter:description", description, true);
        if (profile.avatar_url) {
            setMetaTag("twitter:image", profile.avatar_url, true);
        }

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = profileUrl;

        // JSON-LD Structured Data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.full_name || profile.username,
            url: profileUrl,
            ...(profile.avatar_url && { image: profile.avatar_url }),
            ...(profile.bio && { description: profile.bio }),
            ...(profile.company && { worksFor: { "@type": "Organization", name: profile.company } }),
            ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }),
            sameAs: [
                profile.github_url,
                profile.twitter_url,
                profile.linkedin_url,
                profile.website_url,
            ].filter(Boolean),
        };

        let scriptTag = document.querySelector('script[type="application/ld+json"]#profile-schema');
        if (!scriptTag) {
            scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "application/ld+json");
            scriptTag.setAttribute("id", "profile-schema");
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(structuredData);

        // Cleanup function to reset meta tags when component unmounts
        return () => {
            document.title = "RulCode - Master Algorithms & Data Structures";
            const metaToRemove = [
                'meta[property="og:type"]',
                'meta[property="og:title"]',
                'meta[property="og:description"]',
                'meta[property="og:url"]',
                'meta[property="og:image"]',
                'meta[name="twitter:card"]',
                'meta[name="twitter:title"]',
                'meta[name="twitter:description"]',
                'meta[name="twitter:image"]',
                'script#profile-schema',
            ];
            metaToRemove.forEach((selector) => {
                const el = document.querySelector(selector);
                if (el) el.remove();
            });
        };
    }, [profile]);
};
