import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlgorithmListItem } from "@/types/algorithm";

export const useAlgorithms = (search?: string, category?: string) => {
    return useQuery({
        queryKey: ["algorithms", search, category],
        queryFn: async () => {
            // Select ONLY the fields needed for the list view
            let query = supabase
                .from("algorithms")
                .select(`
          id,
          name,
          title,
          difficulty,
          category,
          list_type,
          description,
          time_complexity,
          space_complexity, 
          serial_no,
          metadata
        `);

            if (search) {
                query = query.or(`title.ilike.%${search}%,name.ilike.%${search}%`);
            }
            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Map the raw data to AlgorithmListItem
            const mappedAlgorithms: AlgorithmListItem[] = data.map((algo: any) => ({
                id: algo.id,
                title: algo.title || algo.name,
                name: algo.name,
                category: algo.category,
                difficulty: algo.difficulty,
                description: algo.description,
                timeComplexity: algo.time_complexity,
                spaceComplexity: algo.space_complexity,
                slug: algo.id,
                listType: algo.list_type,
                serial_no: algo.serial_no,
            }));

            return mappedAlgorithms;
        },
        staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus for static content
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
