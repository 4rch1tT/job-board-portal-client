import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice";

const api_domain = import.meta.env.VITE_API_DOMAIN;

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (jobId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { wishlist } = getState();
      const isInWishlist = wishlist.includes(jobId);

      if (isInWishlist) {
        await axios.put(
          `${api_domain}/api/candidate/wishlist/${jobId}`,
          { jobId },
          { withCredentials: true }
        );
        dispatch(removeFromWishlist(jobId));
      } else {
        await axios.post(
          `${api_domain}/api/candidate/wishlist/${jobId}`,
          { jobId },
          { withCredentials: true }
        );
        dispatch(addToWishlist(jobId));
      }
    } catch (error) {
     console.error("Wishlist toggle failed:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
