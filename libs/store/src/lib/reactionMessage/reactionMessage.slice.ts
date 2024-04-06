import { EmojiDataOptionals, EmojiPlaces, IEmoji } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const REACTION_FEATURE_KEY = 'reaction';

export const mapReactionToEntity = (reaction: UpdateReactionMessageArgs) => {
	return reaction;
};

export interface ReactionEntity extends IEmoji {
	id: string;
}

export type UpdateReactionMessageArgs = {
	id: string;
	channel_id?: string;
	message_id?: string;
	emoji?: string;
	count?: number;
	sender_id?: string;
	action?: boolean;
};

export interface ReactionState extends EntityState<ReactionEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	// activeGifsStickerEmojiTab: TabNamePopup;
	reactionPlaceActive: EmojiPlaces;
	reactionBottomState: boolean;
	// emojiMessBoxState: boolean;
	reactionRightState: boolean;
	// emojiOpenEditState: boolean;
	// messageReplyState: boolean;
	// emojiSelectedMess: boolean;
	reactionDataSocket: EmojiDataOptionals;
	reactionDataServerAndSocket: EmojiDataOptionals[];
	grandParentWidthState: number;
	// Emoji Suggestion state
	// emojiPicked: string;
	// isEmojiListShowed: boolean;
	// isFocusEditor: boolean;
	// textToSearchEmojiSuggestion: string;
}

export const reactionAdapter = createEntityAdapter({
	selectId: (emo: ReactionEntity) => emo.id || emo.name || '',
});

// export const fetchEmoji = createAsyncThunk<any>('emoji/fetchStatus', async (_, thunkAPI) => {
// 	try {
// 		const response = await fetch(`${process.env.NX_CHAT_APP_CDN_META_DATA_EMOJI}`);

// 		if (!response.ok) {
// 			throw new Error('Failed to fetch emoji data');
// 		}
// 		const data = await response.json();
// 		return data;
// 	} catch (error) {
// 		return thunkAPI.rejectWithValue(error);
// 	}
// });

export const updateReactionMessage = createAsyncThunk(
	'messages/updateReactionMessage',

	async ({ id, channel_id, message_id, sender_id, emoji, count, action }: UpdateReactionMessageArgs, thunkAPI) => {
		try {
			await thunkAPI.dispatch(reactionActions.setReactionDataSocket({ id, channel_id, message_id, sender_id, emoji, count, action }));
		} catch (e) {
			console.log(e);
			return thunkAPI.rejectWithValue([]);
		}
	},
);

export const initialReactionState: ReactionState = reactionAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	// activeGifsStickerEmojiTab: TabNamePopup.NONE,
	reactionPlaceActive: EmojiPlaces.EMOJI_REACTION,
	reactionBottomState: false,
	// emojiMessBoxState: false,
	reactionRightState: false,
	// emojiOpenEditState: false,
	// messageReplyState: false,
	// emojiSelectedMess: false,
	reactionDataSocket: {
		action: undefined,
		id: '',
		emoji: '',
		senders: [{ sender_id: '', count: 0, emojiIdList: [], sender_name: '', avatar: '' }],
		channel_id: '',
		message_id: '',
	},
	reactionDataServerAndSocket: [],
	grandParentWidthState: 0,

	// emojiPicked: '',
	// isEmojiListShowed: false,
	// isFocusEditor: false,
	// textToSearchEmojiSuggestion: '',
});

export const reactionSlice = createSlice({
	name: REACTION_FEATURE_KEY,
	initialState: initialReactionState,
	reducers: {
		add: reactionAdapter.addOne,
		remove: reactionAdapter.removeOne,

		// setActiveGifsStickerEmojiTab(state, action) {
		// 	state.activeGifsStickerEmojiTab = action.payload;
		// },
		setReactionPlaceActive(state, action) {
			state.reactionPlaceActive = action.payload;
		},
		setReactionBottomState(state, action) {
			state.reactionBottomState = action.payload;
		},
		// setEmojiMessBoxState(state, action) {
		// 	state.emojiMessBoxState = action.payload;
		// },
		setReactionRightState(state, action) {
			state.reactionRightState = action.payload;
		},
		// setEmojiOpenEditState(state, action) {
		// 	state.emojiOpenEditState = action.payload;
		// },
		// setMessageReplyState(state, action) {
		// 	state.messageReplyState = action.payload;
		// },

		setGrandParentWidthState(state, action) {
			state.grandParentWidthState = action.payload;
		},

		setReactionDataSocket: (state, action: PayloadAction<UpdateReactionMessageArgs>) => {
			state.reactionDataSocket = {
				action: action.payload.action,
				id: action.payload.id ?? '',
				emoji: action.payload.emoji ?? '',
				senders: [
					{
						sender_id: action.payload.sender_id || '',
						count: action.payload.action ? action.payload.count && action.payload.count : 1,
						emojiIdList: [],
						sender_name: '',
						avatar: '',
					},
				],
				channel_id: action.payload.channel_id ?? '',
				message_id: action.payload.message_id ?? '',
			};
			if (!action.payload.action) {
				state.reactionDataServerAndSocket.push(state.reactionDataSocket);
			} else if (action.payload.action) {
				const { action, ...newStateReaction } = state.reactionDataSocket;
				const removedReactionData = state.reactionDataServerAndSocket.filter(
					(item) =>
						item.emoji !== newStateReaction.emoji ||
						item.channel_id !== newStateReaction.channel_id ||
						item.message_id !== newStateReaction.message_id ||
						item.senders[0].sender_id !== newStateReaction.senders[0].sender_id,
				);
				state.reactionDataServerAndSocket = removedReactionData;
			}
		},

		setDataReactionFromServe(state, action) {
			state.reactionDataServerAndSocket = action.payload;
		},

		// ...
		// setEmojiPicked: (state, action: PayloadAction<string>) => {
		// 	state.emojiPicked = action.payload;
		// },

		// setStatusEmojiList: (state, action: PayloadAction<boolean>) => {
		// 	state.isEmojiListShowed = action.payload;
		// },
		// setIsFocusEditor: (state, action: PayloadAction<boolean>) => {
		// 	state.isFocusEditor = action.payload;
		// },
		// setTextToSearchEmojiSuggestion: (state, action: PayloadAction<string>) => {
		// 	state.textToSearchEmojiSuggestion = action.payload;
		// },
	},
	// extraReducers: (builder) => {
	// 	builder
	// 		.addCase(fetchEmoji.pending, (state: ReactionState) => {
	// 			state.loadingStatus = 'loading';
	// 		})
	// 		.addCase(fetchEmoji.fulfilled, (state: ReactionState, action: PayloadAction<ReactionEntity[]>) => {
	// 			reactionAdapter.setAll(state, action.payload);
	// 			state.loadingStatus = 'loaded';
	// 		})
	// 		.addCase(fetchEmoji.rejected, (state: ReactionState, action) => {
	// 			state.loadingStatus = 'error';
	// 			state.error = action.error.message;
	// 		});
	// },
});

export const reactionReducer = reactionSlice.reducer;

export const reactionActions = {
	...reactionSlice.actions,
	// fetchEmoji,
	updateReactionMessage,
};

const { selectAll, selectEntities } = reactionAdapter.getSelectors();

export const getReactionState = (rootState: { [REACTION_FEATURE_KEY]: ReactionState }): ReactionState => rootState[REACTION_FEATURE_KEY];

export const selectAllEmojiReaction = createSelector(getReactionState, selectAll);

export const selectEmojiReactionEntities = createSelector(getReactionState, selectEntities);

// export const selectEmojiMessBoxState = createSelector(getReactionState, (state: ReactionState) => state.emojiMessBoxState);

// export const selectEmojiOpenEditState = createSelector(getReactionState, (state: ReactionState) => state.emojiOpenEditState);

export const selectReactionPlaceActive = createSelector(getReactionState, (state: ReactionState) => state.reactionPlaceActive);

export const selectReactionBottomState = createSelector(getReactionState, (state: ReactionState) => state.reactionBottomState);

export const selectReactionRightState = createSelector(getReactionState, (state: ReactionState) => state.reactionRightState);

// export const selectActiceGifsStickerEmojiTab = createSelector(getReactionState, (state: ReactionState) => state.activeGifsStickerEmojiTab);

// export const selectMessageReplyState = createSelector(getReactionState, (state: ReactionState) => state.messageReplyState);

// export const selectEmojiSelectedMess = createSelector(getReactionState, (state: ReactionState) => state.emojiSelectedMess);

export const selectMessageReacted = createSelector(getReactionState, (state) => state.reactionDataSocket);

export const selectDataReactionCombine = createSelector(getReactionState, (state) => state.reactionDataServerAndSocket);

export const selectGrandParentWidthState = createSelector(getReactionState, (state) => state.grandParentWidthState);

//// Suggestions Emoji

// export const selectEmojiSuggestion = createSelector(getReactionState, (emojisState) => emojisState.emojiPicked);

// export const getEmojiListStatus = createSelector(getReactionState, (emojisState) => emojisState.isEmojiListShowed);

// export const getIsFocusEditor = createSelector(getReactionState, (emojisState) => emojisState.isFocusEditor);

// export const getTextToSearchEmojiSuggestion = createSelector(getReactionState, (emojisState) => emojisState.textToSearchEmojiSuggestion);
