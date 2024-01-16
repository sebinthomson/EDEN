import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctionWatchlist: localStorage.getItem("auctionWatchlistEnglish")
    ? JSON.parse(localStorage.getItem("auctionWatchlistEnglish"))
    : null,
};

const auctionWatchlistSlice = createSlice({
  name: "watchlistEnglish",
  initialState,
  reducers: {
    setAuctionWatchlist: (state, action) => {
      state.auctionWatchlist = action.payload;
      localStorage.setItem("auctionWatchlistEnglish", JSON.stringify(action.payload));
    },
  },
});

export const { setAuctionWatchlist } = auctionWatchlistSlice.actions;

export default auctionWatchlistSlice.reducer;
