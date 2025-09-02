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
    updateUser: (state, action) => {
      state.user = {...state.user,...action.payload}
    }
  },
});

export const { login, logout, updateUser } = authenticationSlice.actions;
export default authenticationSlice.reducer;
