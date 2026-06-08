import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from "@/integrations/supabase/client";
import { AlgorithmListItem } from "@/types/algorithm";

interface AlgorithmsState {
  items: AlgorithmListItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const CACHE_KEY = 'rulcode_algorithms_cache_v1';
// How long we consider cached data fresh before refetching from Supabase
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getCachedAlgorithms = (): AlgorithmListItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

const initialState: AlgorithmsState = {
  // Pre-populate from localStorage so the list is immediately available on
  // page load without waiting for the Supabase round-trip.
  items: getCachedAlgorithms(),
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const fetchAllAlgorithms = createAsyncThunk(
  'algorithms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("algorithms").select(`
          id, name, title, difficulty, category, categories, list_type, list_types, published, description, time_complexity, space_complexity, serial_no, metadata, problem_type
      `).order("serial_no", { ascending: true, nullsFirst: false });

      if (error) throw error;

      const mappedData = (data || []).map((algo: any) => ({
        id: algo.id,
        title: algo.title || algo.name,
        name: algo.name,
        category: algo.category,
        categories: algo.categories || (algo.category ? algo.category.split(',').map((c: string) => c.trim()) : []),
        difficulty: algo.difficulty,
        description: algo.description,
        timeComplexity: algo.time_complexity,
        spaceComplexity: algo.space_complexity,
        slug: algo.id,
        listType: algo.list_type || (algo.list_types?.[0]) || 'core',
        listTypes: algo.list_types || (algo.list_type ? [algo.list_type] : ['core']),
        published: algo.published,
        problemType: algo.problem_type,
        serial_no: algo.serial_no,
        metadata: algo.metadata,
      }));

      // Cache the result
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(mappedData));
      }

      return mappedData;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { algorithms: AlgorithmsState };
      const { isLoading, items, lastFetched } = state.algorithms;
      // Never run two fetches concurrently
      if (isLoading) return false;
      // Skip if data is still fresh (within TTL), even after a remount
      if (items.length > 0 && lastFetched && Date.now() - lastFetched < CACHE_TTL_MS) return false;
      return true;
    }
  }
);

const algorithmsSlice = createSlice({
  name: 'algorithms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAlgorithms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAlgorithms.fulfilled, (state, action: PayloadAction<AlgorithmListItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAllAlgorithms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default algorithmsSlice.reducer;
