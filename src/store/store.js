import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../store/slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    isAuthenticated: authenticationReducer,
    wishlist: wishlistReducer
  },
});
