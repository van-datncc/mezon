import { EmojiPlaces, TabNamePopup } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';

export const EMOJI_FEATURE_KEY = 'emoji';

/*
 * Update these interfaces according to your requirements.
 */
export interface EmojiEntity {
	id: string;
}

export interface EmojiState extends EntityState<EmojiEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	activeGifsStickerEmojiTab: TabNamePopup;
	emojiPopupState: boolean; // close | open
	emojiPlaceActive: EmojiPlaces;
	emojiReactedBottomState: boolean;
	emojiMessBoxState: boolean;
	emojiReactedState: boolean;
	emojiOpenEditState: boolean;
	messageReplyState: boolean;
<<<<<<< Updated upstream
=======
	emojiChatBoxSuggestionSate: boolean;
	emojiSelectedReacted: string;
	emojiSelectedMess: boolean;
>>>>>>> Stashed changes
}

export const emojiAdapter = createEntityAdapter<EmojiEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchEmoji())
 * }, [dispatch]);
 * ```
 */
export const fetchEmoji = createAsyncThunk<EmojiEntity[]>('emoji/fetchStatus', async (_, thunkAPI) => {
	/**
	 * Replace this with your custom fetch call.
	 * For example, `return myApi.getEmojis()`;
	 * Right now we just return an empty array.
	 */
	return Promise.resolve([]);
});

export const initialEmojiState: EmojiState = emojiAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,	
	activeGifsStickerEmojiTab: TabNamePopup.NONE,
	emojiPopupState: false,
	emojiPlaceActive: EmojiPlaces.EMOJI_REACTION,
	emojiReactedBottomState: false,
	emojiMessBoxState: false,
	emojiReactedState: false,
	emojiOpenEditState: false,
	messageReplyState: false,
<<<<<<< Updated upstream
=======
	emojiChatBoxSuggestionSate: false,
	emojiSelectedReacted: '',
	emojiSelectedMess: false,
>>>>>>> Stashed changes
});

export const emojiSlice = createSlice({
	name: EMOJI_FEATURE_KEY,
	initialState: initialEmojiState,
	reducers: {
		add: emojiAdapter.addOne,
		remove: emojiAdapter.removeOne,
		setEmojiPopupState(state, action) {
			state.emojiPopupState = action.payload;
		},
		setActiveGifsStickerEmojiTab(state, action) {
			state.activeGifsStickerEmojiTab = action.payload;
		},
		setEmojiPlaceActive(state, action) {
			state.emojiPlaceActive = action.payload;
		},
		setEmojiReactedBottomState(state, action) {
			state.emojiReactedBottomState = action.payload;
		},
		setEmojiMessBoxState(state, action) {
			state.emojiMessBoxState = action.payload;
		},
		setEmojiReactedState(state, action) {
			state.emojiReactedState = action.payload;
		},
		setEmojiOpenEditState(state, action) {
			state.emojiOpenEditState = action.payload;
		},
		setMessageReplyState(state, action) {
			state.messageReplyState = action.payload;
		}
		// ...
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEmoji.pending, (state: EmojiState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchEmoji.fulfilled, (state: EmojiState, action: PayloadAction<EmojiEntity[]>) => {
				emojiAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchEmoji.rejected, (state: EmojiState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const emojiReducer = emojiSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(emojiActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const emojiActions = emojiSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllEmoji);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = emojiAdapter.getSelectors();

export const getEmojiState = (rootState: { [EMOJI_FEATURE_KEY]: EmojiState }): EmojiState => rootState[EMOJI_FEATURE_KEY];

export const selectAllEmoji = createSelector(getEmojiState, selectAll);

export const selectEmojiEntities = createSelector(getEmojiState, selectEntities);

export const selectEmojiState = createSelector(getEmojiState, (state: EmojiState) => state.emojiPopupState);

export const selectEmojiMessBoxState = createSelector(getEmojiState, (state: EmojiState) => state.emojiMessBoxState);

export const selectEmojiOpenEditState = createSelector(getEmojiState, (state: EmojiState) => state.emojiOpenEditState);

export const selectEmojiPlaceActive = createSelector(getEmojiState, (state: EmojiState) => state.emojiPlaceActive);

export const selectEmojiReactedBottomState = createSelector(getEmojiState, (state: EmojiState) => state.emojiReactedBottomState);

export const selectEmojiReactedState = createSelector(getEmojiState, (state: EmojiState) => state.emojiReactedState);

export const selectActiceGifsStickerEmojiTab = createSelector(getEmojiState, (state: EmojiState) => state.activeGifsStickerEmojiTab);

<<<<<<< Updated upstream
export const selectMessageReplyState = createSelector(getEmojiState, (state: EmojiState) => state.messageReplyState);
=======
export const selectMessageReplyState = createSelector(getEmojiState, (state: EmojiState) => state.messageReplyState);

export const selectEmojiChatBoxSuggestionSate = createSelector(getEmojiState, (state: EmojiState) => state.emojiChatBoxSuggestionSate);

export const selectEmojiSelectedReacted = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedReacted);

export const selectEmojiSelectedMess = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedMess);
>>>>>>> Stashed changes
