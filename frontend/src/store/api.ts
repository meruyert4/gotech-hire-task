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
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query<{ userId: number; username: string }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
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
    updateRoom: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/rooms/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Room'],
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Room'],
    }),
    getMessages: builder.query<
      {
        id: number;
        content: string;
        userId: number;
        createdAt: string;
        username: string;
        senderName: string;
      }[],
      { roomId: number; limit: number; offset: number }
    >({
      query: ({ roomId, limit, offset }) =>
        `/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.roomId;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.offset === 0) {
          return newItems;
        }
        currentCache.unshift(...newItems);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.offset !== previousArg?.offset;
      },
      providesTags: (result, error, { roomId }) => [{ type: 'Message', id: roomId }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetMessagesQuery,
} = api;
