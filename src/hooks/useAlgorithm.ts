import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAlgorithm = (algorithmIdOrSlug: string | undefined) => {
    return useQuery({
        queryKey: ["algorithm", algorithmIdOrSlug],
        queryFn: async () => {
            if (!algorithmIdOrSlug) return null;

            let query = supabase.from('algorithms').select('*');

            // Basic check if it looks like a UUID or a slug
            const isSlug = algorithmIdOrSlug.includes('-') && !algorithmIdOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

            // If we could determine it's a slug, we might use .eq('slug', ...) 
            // but current implementation mostly relies on ID being primary.
            // However, if the user passes a slug, we need to handle it.
            // The previous implementation in AlgorithmDetail.tsx just did .eq('id', algorithmIdOrSlug) 
            // which implies the routing passes ID even for slug routes OR the ID column holds slugs? 
            // Looking at `AlgorithmDetail.tsx`, it uses `id || slug`.
            // Let's mirror the existing logic:
            query = query.eq('id', algorithmIdOrSlug);

            const { data, error } = await query.single();

            if (error) throw error;

            // Transform metadata same as before
            const metadata = data.metadata || {};
            const metadataObj = (typeof metadata === 'object' && metadata !== null ? metadata : {}) as Record<string, any>;
            const transformedData = {
                ...data,
                ...metadataObj,
                metadata: data.metadata,
                slug: data.id, // Map ID to slug since we don't have a slug column
            };

            return transformedData;
        },
        enabled: !!algorithmIdOrSlug,
        // Fetch fresh data every time to support immediate updates from Admin panel
    });
};
