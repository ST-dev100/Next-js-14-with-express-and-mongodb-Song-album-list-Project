import { configureStore } from '@reduxjs/toolkit';
import songs from './features/songs';
import { apiSlice } from './api/apiSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here
    song:songs,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;