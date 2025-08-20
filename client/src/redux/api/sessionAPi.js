import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/helper";


export const sessionApi = createApi({
  reducerPath: "sessionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Session"],
  endpoints: (builder) => ({
    getAllSessions: builder.query({
      query: () => "/api/sessions/my-sessions",
      providesTags: ["Session"],
    }),
    getOneSession: builder.query({
      query: (id) => `/api/sessions/${id}`,
      providesTags: (result, error, id) => [{ type: "Session", id }],
    }),
    createSession: builder.mutation({
      query: (body) => ({
        url: "/api/sessions/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Session"],
    }),
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/api/sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Session",
        { type: "Session", id },
      ],
    }),
    addQuestionToSession: builder.mutation({
      query: ({ sessionId, questions }) => ({
        url: `/api/questions/add`,
        method: "POST",
        body: { sessionId, questions },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Session", id: sessionId },
      ],
    }),
    pinQuestion: builder.mutation({
      query: ({ questionId, sessionId }) => ({
        url: `/api/questions/${questionId}/pin`,
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Session", id: sessionId },
      ],
    }),
  }),
});

export const {
  useGetAllSessionsQuery,
  useGetOneSessionQuery,
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useAddQuestionToSessionMutation,
  usePinQuestionMutation,
} = sessionApi;
