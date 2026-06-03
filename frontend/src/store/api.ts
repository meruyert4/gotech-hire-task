import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include', // Important for HttpOnly cookies
  }),
  tagTypes: ['Room', 'Message', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getRooms: builder.query({
      query: () => '/rooms',
      providesTags: ['Room'],
    }),
    createRoom: builder.mutation({
      query: (room) => ({
        url: '/rooms',
        method: 'POST',
        body: room,
      }),
      invalidatesTags: ['Room'],
    }),
    getMessages: builder.query({
      query: (roomId) => `/chat/rooms/${roomId}/messages`,
      providesTags: (result, error, roomId) => [{ type: 'Message', id: roomId }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetRoomsQuery,
  useCreateRoomMutation,
  useGetMessagesQuery,
} = api;
