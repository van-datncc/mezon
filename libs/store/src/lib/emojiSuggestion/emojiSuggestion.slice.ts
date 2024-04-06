import { IEmoji } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const EMOJI_SUGGESTION_FEATURE_KEY = 'suggestionEmoji';

// export const mapReactionToEntity = (reaction: UpdateReactionMessageArgs) => {
// 	return reaction;
// };

export interface EmojiSuggestionEntity extends IEmoji {
	id: string;
}

// export type UpdateReactionMessageArgs = {
// 	id: string;
// 	channel_id?: string;
// 	message_id?: string;
// 	emoji?: string;
// 	count?: number;
// 	sender_id?: string;
// 	action?: boolean;
// };

export interface EmojiSuggestionState extends EntityState<EmojiSuggestionEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	// activeGifsStickerEmojiTab: TabNamePopup;
	// emojiPlaceActive: EmojiPlaces;
	// emojiReactedBottomState: boolean;
	// emojiMessBoxState: boolean;
	// emojiReactedState: boolean;
	// emojiOpenEditState: boolean;
	// messageReplyState: boolean;
	// emojiSelectedMess: boolean;
	// reactionMessageData: EmojiDataOptionals;
	// reactionDataServerAndSocket: EmojiDataOptionals[];
	// grandParentWidthState: number;
	// Emoji Suggestion state
	emojiPicked: string;
	emojiSuggestionListStatus: boolean;
	isFocusEditor: boolean;
	textToSearchEmojiSuggestion: string;
}

export const emojiSuggestionAdapter = createEntityAdapter({
	selectId: (emo: EmojiSuggestionEntity) => emo.id || emo.name || '',
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

// export const updateReactionMessage = createAsyncThunk(
// 	'messages/updateReactionMessage',

// 	async ({ id, channel_id, message_id, sender_id, emoji, count, action }: UpdateReactionMessageArgs, thunkAPI) => {
// 		try {
// 			await thunkAPI.dispatch(emojiSuggestionActions.setReactionMessage({ id, channel_id, message_id, sender_id, emoji, count, action }));
// 		} catch (e) {
// 			console.log(e);
// 			return thunkAPI.rejectWithValue([]);
// 		}
// 	},
// );

export const initialEmojiSuggestionState: EmojiSuggestionState = emojiSuggestionAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	// activeGifsStickerEmojiTab: TabNamePopup.NONE,
	// emojiPlaceActive: EmojiPlaces.EMOJI_REACTION,
	// emojiReactedBottomState: false,
	// emojiMessBoxState: false,
	// emojiReactedState: false,
	// emojiOpenEditState: false,
	// messageReplyState: false,
	// emojiSelectedMess: false,
	// reactionMessageData: {
	// 	action: undefined,
	// 	id: '',
	// 	emoji: '',
	// 	senders: [{ sender_id: '', count: 0, emojiIdList: [], sender_name: '', avatar: '' }],
	// 	channel_id: '',
	// 	message_id: '',
	// },
	// reactionDataServerAndSocket: [],
	// grandParentWidthState: 0,

	emojiPicked: '',
	emojiSuggestionListStatus: false,
	isFocusEditor: false,
	textToSearchEmojiSuggestion: '',
});

export const emojiSuggestionSlice = createSlice({
	name: EMOJI_SUGGESTION_FEATURE_KEY,
	initialState: initialEmojiSuggestionState,
	reducers: {
		add: emojiSuggestionAdapter.addOne,
		remove: emojiSuggestionAdapter.removeOne,

		setSuggestionEmojiPicked: (state, action: PayloadAction<string>) => {
			state.emojiPicked = action.payload;
		},

		setStatusSuggestionEmojiList: (state, action: PayloadAction<boolean>) => {
			state.emojiSuggestionListStatus = action.payload;
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
			.addCase(fetchEmoji.pending, (state: EmojiSuggestionState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchEmoji.fulfilled, (state: EmojiSuggestionState, action: PayloadAction<EmojiSuggestionEntity[]>) => {
				emojiSuggestionAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchEmoji.rejected, (state: EmojiSuggestionState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const emojiSuggestionReducer = emojiSuggestionSlice.reducer;

export const emojiSuggestionActions = {
	...emojiSuggestionSlice.actions,
	fetchEmoji,
};

const { selectAll, selectEntities } = emojiSuggestionAdapter.getSelectors();

export const getEmojiSuggestionState = (rootState: { [EMOJI_SUGGESTION_FEATURE_KEY]: EmojiSuggestionState }): EmojiSuggestionState =>
	rootState[EMOJI_SUGGESTION_FEATURE_KEY];

export const selectAllEmojiSuggestion = createSelector(getEmojiSuggestionState, selectAll);

export const selectEmojiSuggestionEntities = createSelector(getEmojiSuggestionState, selectEntities);

export const selectEmojiSuggestion = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.emojiPicked);

export const selectEmojiListStatus = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.emojiSuggestionListStatus);

export const selectIsFocusEditor = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.isFocusEditor);

export const selectTextToSearchEmojiSuggestion = createSelector(getEmojiSuggestionState, (emojisState) => emojisState.textToSearchEmojiSuggestion);
