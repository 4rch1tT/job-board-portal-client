import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    setWishlist: (state, action) => action.payload,
    addToWishlist: (state, action) => {
      if (!state.includes(action.payload)) state.push(action.payload);
    },
    removeFromWishlist: (state, action) => {
      return state.filter((id) => id !== action.payload);
    },
    clearWishlist: () => [],
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
