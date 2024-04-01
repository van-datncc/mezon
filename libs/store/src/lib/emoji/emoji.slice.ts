import { EmojiPlaces, TabNamePopup } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { MessageReactionEvent } from '@mezon/mezon-js';

export const EMOJI_FEATURE_KEY = 'emoji';

//TODO: do not convert here, use the mapReactionToEntity
export const mapReactionToEntity = (reaction: MessageReactionEvent) => {
	return reaction;
}

/*
 * Update these interfaces according to your requirements.
 */
export interface EmojiEntity {
	id: string;
}

export type UpdateReactionMessageArgs = {
	id: string;
	channelId?: string;
	messageId?: string;
	emoji?: string;
	count?: number;
	userId?: string;
	action_delete?: boolean;
	actionRemove?: boolean;
};

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
	emojiChatBoxSuggestionSate: boolean;
	emojiSelectedReacted: string;
	emojiSelectedMess: boolean;
	reactionMessageData: UpdateReactionMessageArgs;
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


export const updateReactionMessage = createAsyncThunk(
	'messages/updateReactionMessage',

	async ({ id, channelId, messageId, userId, emoji, count, actionRemove }: UpdateReactionMessageArgs, thunkAPI) => {
		try {
			await thunkAPI.dispatch(emojiActions.setReactionMessage({ id, channelId, messageId, userId, emoji, count, actionRemove }));
		} catch (e) {
			console.log(e);
			return thunkAPI.rejectWithValue([]);
		}
	},
);

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
	emojiChatBoxSuggestionSate: false,
	emojiSelectedReacted: '',
	emojiSelectedMess: false,
	reactionMessageData: { id: '', channelId: '', messageId: '', userId: '', emoji: '', count: 0, actionRemove: false },
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
		},
		setEmojiChatBoxSuggestionSate(state, action) {
			state.emojiChatBoxSuggestionSate = action.payload;
		},
		setEmojiSelectedReacted(state, action) {
			state.emojiSelectedReacted = action.payload;
		},
		setReactionMessage: (state, action: PayloadAction<UpdateReactionMessageArgs>) => {
			state.reactionMessageData = {
				id: action.payload.id,
				channelId: action.payload.channelId,
				messageId: action.payload.messageId,
				userId: action.payload.userId,
				emoji: action.payload.emoji,
				count: action.payload.count,
				actionRemove: action?.payload?.actionRemove,
			};
		},
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
export const emojiActions = {
	...emojiSlice.actions,
	updateReactionMessage,
}

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

export const selectMessageReplyState = createSelector(getEmojiState, (state: EmojiState) => state.messageReplyState);

export const selectEmojiChatBoxSuggestionSate = createSelector(getEmojiState, (state: EmojiState) => state.emojiChatBoxSuggestionSate);

export const selectEmojiSelectedReacted = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedReacted);

export const selectEmojiSelectedMess = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedMess);

export const selectMessageReacted = createSelector(getEmojiState, (state) => state.reactionMessageData);