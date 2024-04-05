import { EmojiDataOptionals, EmojiPlaces, IEmoji, TabNamePopup } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const EMOJI_FEATURE_KEY = 'emoji';

//TODO: do not convert here, use the mapReactionToEntity
export const mapReactionToEntity = (reaction: UpdateReactionMessageArgs) => {
	return reaction;
};

export interface EmojiEntity extends IEmoji {
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

export interface EmojiState extends EntityState<EmojiEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	activeGifsStickerEmojiTab: TabNamePopup;
	emojiPlaceActive: EmojiPlaces;
	emojiReactedBottomState: boolean;
	emojiMessBoxState: boolean;
	emojiReactedState: boolean;
	emojiOpenEditState: boolean;
	messageReplyState: boolean;
	emojiSelectedMess: boolean;
	reactionMessageData: EmojiDataOptionals;
	reactionDataServerAndSocket: EmojiDataOptionals[];
	grandParentWidthState: number;
	// Emoji Suggestion state
	emojiPicked: string;
	isEmojiListShowed: boolean;
	isFocusEditor: boolean;
	textToSearchEmojiSuggestion: string;
}

export const emojiAdapter = createEntityAdapter({
	selectId: (emo: EmojiEntity) => emo.id || emo.name || '',
});

export const fetchEmoji = createAsyncThunk<any>('emoji/fetchStatus', async (_, thunkAPI) => {
	try {
		const response = await fetch(`${process.env.NX_CHAT_APP_CDN_META_DATA_EMOJI}`);

		if (!response.ok) {
			throw new Error('Failed to fetch emoji data');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const updateReactionMessage = createAsyncThunk(
	'messages/updateReactionMessage',

	async ({ id, channel_id, message_id, sender_id, emoji, count, action }: UpdateReactionMessageArgs, thunkAPI) => {
		try {
			await thunkAPI.dispatch(emojiActions.setReactionMessage({ id, channel_id, message_id, sender_id, emoji, count, action }));
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
	emojiPlaceActive: EmojiPlaces.EMOJI_REACTION,
	emojiReactedBottomState: false,
	emojiMessBoxState: false,
	emojiReactedState: false,
	emojiOpenEditState: false,
	messageReplyState: false,
	emojiSelectedMess: false,
	reactionMessageData: {
		action: undefined,
		id: '',
		emoji: '',
		senders: [{ sender_id: '', count: 0, emojiIdList: [], sender_name: '', avatar: '' }],
		channel_id: '',
		message_id: '',
	},
	reactionDataServerAndSocket: [],
	grandParentWidthState: 0,

	emojiPicked: '',
	isEmojiListShowed: false,
	isFocusEditor: false,
	textToSearchEmojiSuggestion: '',
});

export const emojiSlice = createSlice({
	name: EMOJI_FEATURE_KEY,
	initialState: initialEmojiState,
	reducers: {
		add: emojiAdapter.addOne,
		remove: emojiAdapter.removeOne,

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

		setGrandParentWidthState(state, action) {
			state.grandParentWidthState = action.payload;
		},

		setReactionMessage: (state, action: PayloadAction<UpdateReactionMessageArgs>) => {
			state.reactionMessageData = {
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
				state.reactionDataServerAndSocket.push(state.reactionMessageData);
			} else if (action.payload.action) {
				const { action, ...newStateReaction } = state.reactionMessageData;
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
		setEmojiPicked: (state, action: PayloadAction<string>) => {
			state.emojiPicked = action.payload;
		},

		setStatusEmojiList: (state, action: PayloadAction<boolean>) => {
			state.isEmojiListShowed = action.payload;
		},
		setIsFocusEditor: (state, action: PayloadAction<boolean>) => {
			state.isFocusEditor = action.payload;
		},
		setTextToSearchEmojiSuggestion: (state, action: PayloadAction<string>) => {
			state.textToSearchEmojiSuggestion = action.payload;
		},
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

export const emojiReducer = emojiSlice.reducer;

export const emojiActions = {
	...emojiSlice.actions,
	fetchEmoji,
	updateReactionMessage,
};

const { selectAll, selectEntities } = emojiAdapter.getSelectors();

export const getEmojiState = (rootState: { [EMOJI_FEATURE_KEY]: EmojiState }): EmojiState => rootState[EMOJI_FEATURE_KEY];

export const selectAllEmoji = createSelector(getEmojiState, selectAll);

export const selectEmojiEntities = createSelector(getEmojiState, selectEntities);

export const selectEmojiMessBoxState = createSelector(getEmojiState, (state: EmojiState) => state.emojiMessBoxState);

export const selectEmojiOpenEditState = createSelector(getEmojiState, (state: EmojiState) => state.emojiOpenEditState);

export const selectEmojiPlaceActive = createSelector(getEmojiState, (state: EmojiState) => state.emojiPlaceActive);

export const selectEmojiReactedBottomState = createSelector(getEmojiState, (state: EmojiState) => state.emojiReactedBottomState);

export const selectEmojiReactedState = createSelector(getEmojiState, (state: EmojiState) => state.emojiReactedState);

export const selectActiceGifsStickerEmojiTab = createSelector(getEmojiState, (state: EmojiState) => state.activeGifsStickerEmojiTab);

export const selectMessageReplyState = createSelector(getEmojiState, (state: EmojiState) => state.messageReplyState);

export const selectEmojiSelectedMess = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedMess);

export const selectMessageReacted = createSelector(getEmojiState, (state) => state.reactionMessageData);

export const getDataReactionCombine = createSelector(getEmojiState, (state) => state.reactionDataServerAndSocket);

export const getGrandParentWidthState = createSelector(getEmojiState, (state) => state.grandParentWidthState);

//// Suggestions Emoji

export const selectEmojiSuggestion = createSelector(getEmojiState, (emojisState) => emojisState.emojiPicked);

export const getEmojiListStatus = createSelector(getEmojiState, (emojisState) => emojisState.isEmojiListShowed);

export const getIsFocusEditor = createSelector(getEmojiState, (emojisState) => emojisState.isFocusEditor);

export const getTextToSearchEmojiSuggestion = createSelector(getEmojiState, (emojisState) => emojisState.textToSearchEmojiSuggestion);
