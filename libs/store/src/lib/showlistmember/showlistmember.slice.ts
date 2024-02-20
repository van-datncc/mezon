import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const uiSlice = createSlice({
  name: 'isshow',
  initialState: {
    isShow: true,
  },
  reducers: {
    toggleIsShow: (state) => {
      state.isShow = !state.isShow;
    },
  },
});

export const IsShowReducer= uiSlice.reducer;

export const { toggleIsShow } = uiSlice.actions;

const selectIsShow = (state: RootState) => state.isshow.isShow;

export const getIsShow = createSelector(
  selectIsShow,
  (isshow) => isshow
);