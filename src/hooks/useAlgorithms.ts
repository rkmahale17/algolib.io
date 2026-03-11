import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlgorithmListItem } from "@/types/algorithm";
import { getAllUserAlgorithmData } from "@/utils/userAlgorithmDataHelpers";

export interface PaginatedAlgorithmsResult {
    algorithms: AlgorithmListItem[];
    totalCount: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
}

export const fetchAlgorithms = async (search?: string, category?: string): Promise<PaginatedAlgorithmsResult> => {
    // Build query params for edge function
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);

    // Call edge function via fetch (GET with query params)
    const response = await fetch(
        `https://dkebbjneobjtmuzzrsdo.supabase.co/functions/v1/fetch-algorithms?${params.toString()}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch algorithms');
    }

    const result = await response.json();

    return {
        algorithms: result.algorithms || [],
        totalCount: result.totalCount || 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 1
    };
};

export const useAlgorithms = (
    search?: string,
    category?: string,
    page: number = 1,
    pageSize: number = 20
) => {
    return useQuery({
        queryKey: ["algorithms", search, category],
        queryFn: () => fetchAlgorithms(search, category),
        staleTime: 1000 * 60 * 60 * 12, // 12 hours
        gcTime: 1000 * 60 * 60 * 12, // 12 hours
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });
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

export const useUserProgressMap = (userId?: string) => {
    return useQuery({
        queryKey: ["userProgressMap", userId],
        queryFn: async (): Promise<Record<string, ProgressStatus>> => {
            if (!userId) return {};

            const data = await getAllUserAlgorithmData(userId);
            const map: Record<string, ProgressStatus> = {};

            data.forEach(item => {
                if (item.completed) {
                    map[item.algorithm_id] = 'solved';
                } else if (item.submissions && Array.isArray(item.submissions) && item.submissions.length > 0) {
                    map[item.algorithm_id] = 'attempted';
                } else {
                    map[item.algorithm_id] = 'none';
                }
            });

            return map;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};



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
