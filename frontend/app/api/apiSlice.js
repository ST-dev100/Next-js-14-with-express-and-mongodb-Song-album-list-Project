import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  tagTypes: ['Song'],
  endpoints: (builder) => ({
    getSongs: builder.query({
      query: () => '/songs',
      providesTags: ['Song'],
    }),
    getSong: builder.query({
      query: (id) => `/songs/${id}`,
      providesTags: ['Song'],
    }),
    createSong: builder.mutation({
      query: (newSong) => ({
        url: '/songs',
        method: 'POST',
        body: newSong,
      }),
      invalidatesTags: ['Song'],
    }),
    updateSong: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/songs/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Song'],
    }),
    deleteSong: builder.mutation({
      query: (id) => ({
        url: `/songs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Song'],
    }),
    getSongStatistics: builder.query({
      query: () => '/songs/stats',
      providesTags: ['Song'],
    }),
  }),
});

export const {
  useGetSongsQuery,
  useGetSongQuery,
  useCreateSongMutation,
  useUpdateSongMutation,
  useDeleteSongMutation,
  useGetSongStatisticsQuery,
} = apiSlice;