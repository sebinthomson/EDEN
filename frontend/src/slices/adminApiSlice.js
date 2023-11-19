import { ADMIN_URL } from "../constants/constants";
import { apiSlice } from "./apiSlice";

export const userAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/listUsers`,
        method: "GET",
        body: data,
      }),
    }),
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/loginAdmin`,
        method: "POST",
        body: data,
      }),
    }),
    blockUnblockUser: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/blockUnblockUser`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useListUsersMutation, useLoginAdminMutation, useBlockUnblockUserMutation } = userAdminApiSlice;
