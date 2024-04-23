import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IMessageWithUser } from '@mezon/utils';
export const popupForwardSlice = createSlice({
	name: 'forwardmessage',
	initialState: {
	  openPopupForward: false,
    message: {} as IMessageWithUser
	  
	},
	reducers: {
        toggleIsShowPopupForwardTrue: (state) => {
            state.openPopupForward = true;
          },
        toggleIsShowPopupForwardFalse: (state) => {
          state.openPopupForward = false;
        },
        setSelectedMessage: (state, action) => {
          state.message = action.payload;
          },
	},
  });

export const popupForwardReducer = popupForwardSlice.reducer;


export const getIsShowPopupForward = (state: RootState) => state.forwardmessage.openPopupForward;
export const getSelectedMessage = (state: RootState) => state.forwardmessage.message;
export const { toggleIsShowPopupForwardTrue, toggleIsShowPopupForwardFalse, setSelectedMessage } = popupForwardSlice.actions;