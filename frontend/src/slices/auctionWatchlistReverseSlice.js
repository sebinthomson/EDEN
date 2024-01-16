import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctionWatchlist: localStorage.getItem("auctionWatchlistReverse")
    ? JSON.parse(localStorage.getItem("auctionWatchlistReverse"))
    : null,
};

const auctionWatchlistSlice = createSlice({
  name: "watchlistReverse",
  initialState,
  reducers: {
    setAuctionWatchlist: (state, action) => {
      state.auctionWatchlist = action.payload;
      localStorage.setItem("auctionWatchlistReverse", JSON.stringify(action.payload));
    },
  },
});

export const { setAuctionWatchlist } = auctionWatchlistSlice.actions;

export default auctionWatchlistSlice.reducer;
