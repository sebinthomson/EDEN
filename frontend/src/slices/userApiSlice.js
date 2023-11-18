import { USERS_URL } from "../constants/constants";
import { apiSlice } from "./apiSlice";

export const userAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendVerifyMail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendVerifyMail`,
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/registerUser`,
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/loginUser`,
        method: "POST",
        body: data,
      }),
    }),
    oAuthLoginUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/oAuthLoginUser`,
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/logoutUser`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendVerifyMailMutation, useRegisterUserMutation, useLoginUserMutation, useOAuthLoginUserMutation, useLogoutUserMutation } =
  userAdminApiSlice;
