import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentItem: null,
  error: null,
  loading: false,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    updateItemStart: (state) => {
      state.loading = true;
    },
    updateItemSuccess: (state, action) => {
      state.currentItem = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateItemFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    deleteItemStart: (state) => {
      state.loading = true;
    },
    deleteItemSuccess: (state, action) => {
      state.currentItem = null;
      state.loading = false;
      state.error = null;
    },
    deleteItemFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  updateItemFailure,
  updateItemStart,
  updateItemSuccess,
  deleteItemStart,
  deleteItemSuccess,
  deleteItemFailure,
  
} = itemSlice.actions;

export default itemSlice.reducer;
