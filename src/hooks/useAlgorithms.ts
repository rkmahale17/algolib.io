import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Algorithm {
    id: string;
    title: string;
    name: string;
    category: string;
    difficulty: string;
    description: string;
    explanation: any;
    implementations: any;
    problems_to_solve: any;
    test_cases: any;
    input_schema: any;
    tutorials: any;
    list_type?: string;
    metadata: any;
    created_at?: string;
    updated_at?: string;
}

// Fetch all algorithms
export function useAlgorithms(searchQuery?: string, categoryFilter?: string) {
    return useQuery({
        queryKey: ['algorithms', searchQuery, categoryFilter],
        queryFn: async () => {
            if (!supabase) {
                console.warn('Supabase not available, returning empty algorithms list');
                return [];
            }

            let query = supabase
                .from('algorithms')
                .select('*')
                .order('name', { ascending: true });

            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
            }

            if (categoryFilter) {
                query = query.eq('category', categoryFilter);
            }

            const { data, error } = await query;

            if (error) {
                toast.error('Failed to fetch algorithms');
                throw error;
            }

            return data as Algorithm[];
        },
    });
}

// Fetch single algorithm
export function useAlgorithm(id: string) {
    return useQuery({
        queryKey: ['algorithm', id],
        queryFn: async () => {
            if (!supabase) {
                console.warn('Supabase not available, cannot fetch algorithm');
                return null;
            }

            const { data, error } = await supabase
                .from('algorithms')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                toast.error('Failed to fetch algorithm');
                throw error;
            }

            return data as Algorithm;
        },
        enabled: !!id && !!supabase,
    });
}

// Create algorithm
export function useCreateAlgorithm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (algorithm: Omit<Algorithm, 'created_at' | 'updated_at'>) => {
            if (!supabase) {
                throw new Error('Supabase not available');
            }

            const { data, error } = await supabase
                .from('algorithms')
                .insert([algorithm as any])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['algorithms'] });
            toast.success('Algorithm created successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to create algorithm: ${error.message}`);
        },
    });
}

// Update algorithm (only updates provided fields)
export function useUpdateAlgorithm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Algorithm> }) => {
            if (!supabase) {
                throw new Error('Supabase not available');
            }

            // Remove id from updates to avoid updating the primary key
            const { id: _, ...updateData } = updates as any;

            const { data, error } = await supabase
                .from('algorithms')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['algorithms'] });
            queryClient.invalidateQueries({ queryKey: ['algorithm', variables.id] });
            toast.success('Algorithm updated successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to update algorithm: ${error.message}`);
        },
    });
}

// Delete algorithm
export function useDeleteAlgorithm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!supabase) {
                throw new Error('Supabase not available');
            }

            const { error } = await supabase
                .from('algorithms')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['algorithms'] });
            toast.success('Algorithm deleted successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to delete algorithm: ${error.message}`);
        },
    });
}

// Get unique categories
export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            if (!supabase) {
                console.warn('Supabase not available, returning empty categories');
                return [];
            }

            const { data, error } = await supabase
                .from('algorithms')
                .select('category')
                .order('category');

            if (error) throw error;

            const uniqueCategories = [...new Set(data.map(d => d.category))];
            return uniqueCategories;
        },
    });
}
