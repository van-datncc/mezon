import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const uiSlice = createSlice({
  name: 'isshow',
  initialState: {
    isWhite: false,
  },
  reducers: {
    toggleIsShow: (state) => {
      state.isWhite = !state.isWhite;
    },
  },
});

export const IsShowReducer= uiSlice.reducer;

export const { toggleIsShow } = uiSlice.actions;

const selectIsWhite = (state: RootState) => state.isshow.isWhite;

export const getIsShow = createSelector(
  selectIsWhite,
  (isshow) => isshow
);