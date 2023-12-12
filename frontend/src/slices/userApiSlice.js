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
    forgotPasswordOTP: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgotPasswordOTP`,
        method: "POST",
        body: data,
      }),
    }),
    confirmForgotPasswordOTP: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/confirmForgotPasswordOTP`,
        method: "POST",
        body: data,
      }),
    }),
    changePasswordUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/changePasswordUser`,
        method: "PUT",
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
    newEnglishAuctionUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/newEnglishAuctionUser`,
        method: "POST",
        body: data,
      }),
    }),
    newReverseAuctionUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/newReverseAuctionUser`,
        method: "POST",
        body: data,
      }),
    }),
    listAuctionUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/listAuctionUser`,
        method: "GET",
      }),
    }),
    loadAuctioneerProfile: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/loadAuctioneerProfile?userId=${data.userId}`,
        method: "GET",
      }),
    }),
    profileUpdate: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profileUpdate`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSendVerifyMailMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotPasswordOTPMutation,
  useConfirmForgotPasswordOTPMutation,
  useChangePasswordUserMutation,
  useOAuthLoginUserMutation,
  useLogoutUserMutation,
  useNewEnglishAuctionUserMutation,
  useNewReverseAuctionUserMutation,
  useListAuctionUserQuery,
  useLoadAuctioneerProfileQuery,
  useProfileUpdateMutation
} = userAdminApiSlice;
