import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlgorithmListItem } from "@/types/algorithm";
import { getAllUserAlgorithmData } from "@/utils/userAlgorithmDataHelpers";

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export interface PaginatedAlgorithmsResult {
    algorithms: AlgorithmListItem[];
    totalCount: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
}

export const useAlgorithms = (
    search?: string,
    category?: string,
    page: number = 1,
    pageSize: number = 20
) => {
    const { items, isLoading, error } = useAppSelector(state => state.algorithms);

    const data = useMemo(() => {
        if (!items || items.length === 0) return null;

        let filtered = items;
        
        if (search) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(lowerSearch) || 
                item.name.toLowerCase().includes(lowerSearch)
            );
        }

        if (category && category !== 'all') {
            filtered = filtered.filter(item => item.category === category);
        }

        return {
            algorithms: filtered,
            totalCount: filtered.length,
            hasMore: false,
            currentPage: 1,
            totalPages: 1
        };
    }, [items, search, category]);

    return {
        data,
        isLoading,
        error
    };
};


export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("algorithms")
                .select("category")
                .not("category", "is", null);

            if (error) throw error;
            // Unique categories
            const uniqueCats = Array.from(new Set(data.map((d: any) => d.category))).sort();
            return uniqueCats;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export type ProgressStatus = 'solved' | 'attempted' | 'none';




export const useDeleteAlgorithm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("algorithms").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["algorithms"] });
        },
    });
};

export const useCreateAlgorithm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newAlgorithm: any) => {
            const { error } = await supabase.from("algorithms").insert(newAlgorithm);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["algorithms"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export const useUpdateAlgorithm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
            const { error } = await supabase
                .from("algorithms")
                .update(updates)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["algorithms"] });
            queryClient.invalidateQueries({ queryKey: ["algorithm", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export const useBulkUpdateAlgorithms = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ids, is_pro, companies }: { ids: string[]; is_pro?: boolean; companies?: string[] }) => {
            // First precisely query active algorithms resolving complex JSONB metadata scopes dynamically
            const { data, error: fetchError } = await supabase
                .from("algorithms")
                .select("id, metadata")
                .in("id", ids);

            if (fetchError) throw fetchError;
            
            // Iterate synchronously sequentially applying exact overwrites explicitly keeping JSON states perfectly nested.
            const promises = data.map(async (algo) => {
                const updates: any = {};
                
                // Track metadata payload cleanly handling potential null state explicitly
                let patchedMetadata = typeof algo.metadata === 'string' 
                    ? JSON.parse(algo.metadata) 
                    : (algo.metadata || {});
                
                let metadataChanged = false;

                if (companies !== undefined) {
                    patchedMetadata.companies = companies;
                    metadataChanged = true;
                }
                
                if (is_pro !== undefined) {
                    patchedMetadata.is_pro = is_pro;
                    metadataChanged = true;
                }
                
                if (metadataChanged) {
                    updates.metadata = patchedMetadata;
                }
                
                // Execute only if we accumulated actual changes targeting explicit algorithm.
                if (Object.keys(updates).length > 0) {
                    const { error } = await supabase.from('algorithms').update(updates).eq('id', algo.id);
                    if (error) throw error;
                }
            });

            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["algorithms"] });
        },
    });
};

export const useBatchStagedUpdates = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (stagedUpdates: { id: string; is_pro?: boolean; companies?: string[] }[]) => {
            if (stagedUpdates.length === 0) return;
            const ids = stagedUpdates.map(u => u.id);
            const { data, error: fetchError } = await supabase
                .from("algorithms")
                .select("id, metadata")
                .in("id", ids);

            if (fetchError) throw fetchError;
            
            const promises = stagedUpdates.map(async (updateState) => {
                const algo = data.find(d => d.id === updateState.id);
                if (!algo) return;

                const updates: any = {};
                let patchedMetadata = typeof algo.metadata === 'string' 
                    ? JSON.parse(algo.metadata) 
                    : (algo.metadata || {});
                
                let metadataChanged = false;

                if (updateState.companies !== undefined) {
                    patchedMetadata.companies = updateState.companies;
                    metadataChanged = true;
                }
                
                if (updateState.is_pro !== undefined) {
                    patchedMetadata.is_pro = updateState.is_pro;
                    metadataChanged = true;
                }
                
                if (metadataChanged) {
                    updates.metadata = patchedMetadata;
                    const { error } = await supabase.from('algorithms').update(updates).eq('id', algo.id);
                    if (error) throw error;
                }
            });

            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["algorithms"] });
        },
    });
};
