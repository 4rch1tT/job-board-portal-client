import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRegisterPage: false,
};

export const uiSlice = createSlice({
  name: "isRegisterPage",
  initialState,
  reducers: {
    updateIsRegisterPage: (state) => {
      state.value = true;
    },
  },
});

export const { updateIsRegisterPage } = uiSlice.actions;
export default uiSlice.reducer;
