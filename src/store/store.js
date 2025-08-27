import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../store/slices/authSlice";

export const store = configureStore({
  reducer: {
    isAuthenticated: authenticationReducer,
  },
});
