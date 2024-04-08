import { SubPanelName } from '@mezon/utils';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export const GIFS_STICKERS_EMOJIS_FEATURE_KEY = 'gifsStickersEmojis';

export interface gifsStickersEmojisState {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	subPanelActive: SubPanelName;
}

export const initialGifsStickersEmojisState: gifsStickersEmojisState = {
	loadingStatus: 'not loaded',
	error: null,
	subPanelActive: SubPanelName.NONE,
};

export const gifsStickersEmojisSlice = createSlice({
	name: GIFS_STICKERS_EMOJIS_FEATURE_KEY,
	initialState: initialGifsStickersEmojisState,
	reducers: {
		setSubPanelActive: (state, action: PayloadAction<SubPanelName>) => {
			state.subPanelActive = action.payload;
		},
	},
});

export const gifsStickerEmojiReducer = gifsStickersEmojisSlice.reducer;

export const gifsStickerEmojiActions = { ...gifsStickersEmojisSlice.actions };

export const getgifsStickerEmojiState = (rootState: { [GIFS_STICKERS_EMOJIS_FEATURE_KEY]: gifsStickersEmojisState }): gifsStickersEmojisState =>
	rootState[GIFS_STICKERS_EMOJIS_FEATURE_KEY];

export const selectSubPanelActive = createSelector(getgifsStickerEmojiState, (state) => state.subPanelActive);
