import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
  user: null,
};

export const authenticationSlice = createSlice({
  name: "isAuthenticated",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.value = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
