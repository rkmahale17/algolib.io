import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import algorithmsReducer from './slices/algorithmsSlice';
import userProgressReducer from './slices/userProgressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    algorithms: algorithmsReducer,
    userProgress: userProgressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
