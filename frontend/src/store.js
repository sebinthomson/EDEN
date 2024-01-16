import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/userAuthSlice.js";
import adminAuthReducer from "./slices/adminAuthSlice.js";
import auctionWatchlistReducerEnglish from "./slices/auctionWatchlistEnglishSlice.js";
import auctionWatchlistReducerReverse from "./slices/auctionWatchlistReverseSlice.js";
import { apiSlice } from "./slices/apiSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  adminAuth: adminAuthReducer,
  watchlistEnglish: auctionWatchlistReducerEnglish,
  watchlistReverse: auctionWatchlistReducerReverse,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
