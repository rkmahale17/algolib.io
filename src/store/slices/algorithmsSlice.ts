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
          id, name, title, difficulty, category, list_type, description, time_complexity, space_complexity, serial_no, metadata
      `).order("serial_no", { ascending: true, nullsFirst: false });

      if (error) throw error;

      const mappedData = (data || []).map((algo: any) => ({
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
      const { isLoading } = state.algorithms;
      // Fetch if not already loading. We allow re-fetching even if we have items (SWR)
      return !isLoading;
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
