import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/helper";


export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    generateQuestions: builder.mutation({
      query: (body) => ({
        url: "/api/ai/generate-questions",
        method: "POST",
        body,
      }),
    }),
    generateExplanation: builder.mutation({
      query: (body) => ({
        url: "/api/ai/generate-explanation",
        method: "POST",
        body,
      }),
    }),
    askQuestion: builder.mutation({
      query: (body) => ({
        url: `/api/ai/ask`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGenerateQuestionsMutation,
  useGenerateExplanationMutation,
  useAskQuestionMutation,
} = aiApi;