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
  }),
});

export const { useListUsersMutation } = userAdminApiSlice;
