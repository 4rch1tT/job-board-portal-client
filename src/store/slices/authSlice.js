import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const authenticationSlice = createSlice({
  name: "isAuthenticated",
  initialState,
  reducers: {
    updateIsAuthenticated: (state, action) => {
      state.value = action.payload
    },
  },
});

export const { updateIsAuthenticated } = authenticationSlice.actions;
export default authenticationSlice.reducer;
