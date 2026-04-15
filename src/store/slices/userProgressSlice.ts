import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from "@/integrations/supabase/client";
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import { getAllUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';

export type ProgressStatus = 'solved' | 'attempted' | 'none';

interface UserProgressState {
  data: UserAlgorithmData[];
  progressMap: Record<string, ProgressStatus>;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserProgressState = {
  data: [],
  progressMap: {},
  isLoading: false,
  error: null,
};

const calculateProgressMap = (data: UserAlgorithmData[]): Record<string, ProgressStatus> => {
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
};

export const fetchUserProgress = createAsyncThunk(
  'userProgress/fetchProgress',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await getAllUserAlgorithmData(userId);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState,
  reducers: {
    setProgressData(state, action: PayloadAction<UserAlgorithmData[]>) {
      state.data = action.payload;
      state.progressMap = calculateProgressMap(action.payload);
    },
    updateProgressItem(state, action: PayloadAction<UserAlgorithmData>) {
      const idx = state.data.findIndex(item => item.algorithm_id === action.payload.algorithm_id);
      if (idx !== -1) {
        state.data[idx] = action.payload;
      } else {
        state.data.push(action.payload);
      }
      state.progressMap = calculateProgressMap(state.data);
    },
    removeProgressItem(state, action: PayloadAction<string>) {
      state.data = state.data.filter(item => item.algorithm_id !== action.payload);
      state.progressMap = calculateProgressMap(state.data);
    },
    clearProgress(state) {
      state.data = [];
      state.progressMap = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action: PayloadAction<UserAlgorithmData[]>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.progressMap = calculateProgressMap(action.payload);
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProgressData, updateProgressItem, removeProgressItem, clearProgress } = userProgressSlice.actions;
export default userProgressSlice.reducer;
