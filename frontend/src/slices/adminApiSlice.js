import { ADMIN_URL } from "../constants/constants";
import { apiSlice } from "./apiSlice";

export const userAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/listUsers`,
        method: "GET",
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
    listEnglishAuctionsAdmin: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/listEnglishAuctionsAdmin`,
        method: "GET",
      }),
    }),
    listReverseAuctionsAdmin: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/listReverseAuctionsAdmin`,
        method: "GET",
      }),
    }),
    listAuctioneers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/listAuctioneers`,
        method: "GET",
      }),
    }),
    approveAuctions: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/approveAuctions`,
        method: "GET",
      }),
    }),
    approveAuction: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/approveAuction`,
        method: "POST",
        body: data,
      }),
    }),
    adminDashboard: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/adminDashboard`,
        method: "GET",
      }),
    }),
    allAuctionsSalesReport: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/allAuctionsSalesReport`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useListUsersQuery,
  useLoginAdminMutation,
  useBlockUnblockUserMutation,
  useListEnglishAuctionsAdminQuery,
  useListReverseAuctionsAdminQuery,
  useListAuctioneersQuery,
  useApproveAuctionsQuery,
  useApproveAuctionMutation,
  useAdminDashboardQuery,
  useAllAuctionsSalesReportQuery,
  useDownloadSalesReportMutation,
} = userAdminApiSlice;
