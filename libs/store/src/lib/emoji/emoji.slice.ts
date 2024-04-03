import { EmojiDataOptionals, EmojiPlaces, IEmoji, TabNamePopup } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const EMOJI_FEATURE_KEY = 'emoji';

//TODO: do not convert here, use the mapReactionToEntity
export const mapReactionToEntity = (reaction: UpdateReactionMessageArgs) => {
	return reaction;
};

// export const mapReactionDataFromServeToEntity = (dataReaction: DataReactionServer) => {
// 	console.log(dataReaction);
// 	return dataReaction;
// };

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
	action_delete?: boolean;
	actionRemove?: boolean;
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
	// emojiSelectedReacted: string;
	emojiSelectedMess: boolean;
	reactionMessageData: EmojiDataOptionals;

	reactionDataCombineServerAndSocket: EmojiDataOptionals[];

	// Emoji Suggestion state
	emojiPicked: string;
	isEmojiListShowed: boolean;
	isFocusEditor: boolean;
	textToSearchEmojiSuggestion: string;
}

export const emojiAdapter = createEntityAdapter<EmojiEntity>();

export const fetchEmoji = createAsyncThunk<any>('emoji/fetchStatus', async (_, thunkAPI) => {
	try {
		const response = await axios.get(`${process.env.NX_CHAT_APP_CDN_META_DATA_EMOJI}`);
		return response.data;
	} catch (error) {
		const errorMessage = (error as Error).message;
		return thunkAPI.rejectWithValue(errorMessage);
	}
});

export const updateReactionMessage = createAsyncThunk(
	'messages/updateReactionMessage',

	async ({ id, channel_id, message_id, sender_id, emoji, count, actionRemove }: UpdateReactionMessageArgs, thunkAPI) => {
		try {
			await thunkAPI.dispatch(emojiActions.setReactionMessage({ id, channel_id, message_id, sender_id, emoji, count, actionRemove }));
		} catch (e) {
			console.log(e);
			return thunkAPI.rejectWithValue([]);
		}
	},
);

// export const updateDataReactionServer = createAsyncThunk(
// 	'messages/updateDataReactionServer',

// 	async ({ id, channel_id, message_id, sender_id, emoji, count, actionRemove }: UpdateReactionMessageArgs, thunkAPI) => {
// 		try {
// 			await thunkAPI.dispatch(emojiActions.setReactionMessage({ id, channel_id, message_id, sender_id, emoji, count, actionRemove }));
// 		} catch (e) {
// 			console.log(e);
// 			return thunkAPI.rejectWithValue([]);
// 		}
// 	},
// );

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
	// emojiSelectedReacted: '',
	emojiSelectedMess: false,
	reactionMessageData: {
		id: '',
		emoji: '',
		senders: [{ sender_id: '', count: 0, emojiIdList: [], sender_name: '', avatar: '' }],
		channel_id: '',
		message_id: '',
	},
	reactionDataCombineServerAndSocket: [],

	emojiPicked: '',
	isEmojiListShowed: false,
	isFocusEditor: false,
	textToSearchEmojiSuggestion: '',
});

function addOrUpdateEmoji(ip: any, newEmoji: any) {
	// Tìm kiếm xem có emoji và message_id trùng khớp không
	const existingEmojiIndex = ip.findIndex((emoji: any) => emoji.emoji === newEmoji.emoji && emoji.message_id === newEmoji.message_id);

	// Nếu tìm thấy phần tử trùng khớp, kiểm tra cả sender_id
	if (existingEmojiIndex !== -1) {
		const existingSenderIndex = ip[existingEmojiIndex].senders.findIndex((sender: any) => sender.sender_id === newEmoji.senders[0].sender_id);

		// Nếu tìm thấy sender_id trùng khớp, tăng giá trị count lên 1
		if (existingSenderIndex !== -1) {
			ip[existingEmojiIndex].senders[existingSenderIndex].count++;
		} else {
			// Nếu không tìm thấy sender_id trùng khớp, thêm sender mới vào mảng senders
			ip[existingEmojiIndex].senders.push(newEmoji.senders[0]);
		}
	} else {
		// Nếu không tìm thấy emoji và message_id trùng khớp, thêm emoji mới vào mảng ip
		ip.push(newEmoji);
	}

	return ip;
}

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

		// setEmojiSelectedReacted(state, action) {
		// 	state.emojiSelectedReacted = action.payload;
		// },
		setReactionMessage: (state, action: PayloadAction<UpdateReactionMessageArgs>) => {
			state.reactionMessageData = {
				id: action.payload.id ?? '',
				emoji: action.payload.emoji ?? '',
				senders: [{ sender_id: action.payload.sender_id || '', count: 1, emojiIdList: [], sender_name: '', avatar: '' }],
				channel_id: action.payload.channel_id ?? '',
				message_id: action.payload.message_id ?? '',
			};
			state.reactionDataCombineServerAndSocket.push(state.reactionMessageData);
			addOrUpdateEmoji(state.reactionMessageData, state.reactionDataCombineServerAndSocket);
		},

		setDataReactionFromServe(state, action) {
			const { payload } = action;
			const dataReactConvertInterface = payload.dataEmojiFetch.reduce((acc: any, cur: any) => {
				const existingEmoji = acc.find((item: any) => item.emoji === cur.emoji);
				if (existingEmoji) {
					const senderInfo = {
						sender_id: cur.sender_id,
						count: cur.count,
						emojiIdList: [],
						sender_name: '',
						avatar: '',
					};
					existingEmoji.senders.push(senderInfo);
				} else {
					acc.push({
						id: '',
						emoji: cur.emoji,
						senders: [
							{
								sender_id: cur.sender_id,
								count: cur.count,
								emojiIdList: [],
								sender_name: '',
								avatar: '',
							},
						],
						channel_id: payload.message.channel_id,
						message_id: payload.message.id,
					});
				}
				return acc;
			}, []);
			state.reactionDataCombineServerAndSocket = dataReactConvertInterface;
			console.log(state.reactionDataCombineServerAndSocket);
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

// export const selectEmojiSelectedReacted = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedReacted);

export const selectEmojiSelectedMess = createSelector(getEmojiState, (state: EmojiState) => state.emojiSelectedMess);

export const selectMessageReacted = createSelector(getEmojiState, (state) => state.reactionMessageData);

export const getDataReactionCombine = createSelector(getEmojiState, (state) => state.reactionDataCombineServerAndSocket);

////

export const selectEmojiSuggestion = createSelector(getEmojiState, (emojisState) => emojisState.emojiPicked);

export const getEmojiListStatus = createSelector(getEmojiState, (emojisState) => emojisState.isEmojiListShowed);

export const getIsFocusEditor = createSelector(getEmojiState, (emojisState) => emojisState.isFocusEditor);

export const getTextToSearchEmojiSuggestion = createSelector(getEmojiState, (emojisState) => emojisState.textToSearchEmojiSuggestion);

const ip = [
	{
		id: '',
		emoji: '😛',
		senders: [
			{
				sender_id: '1769551280650326016',
				count: 1,
				emojiIdList: [],
				sender_name: '',
				avatar: '',
			},
		],
		channel_id: '1768925123173158912',
		message_id: '1772872129285459968',
	},
	{
		id: '',
		emoji: '😂',
		senders: [
			{
				sender_id: '1769551280650326016',
				count: 1,
				emojiIdList: [],
				sender_name: '',
				avatar: '',
			},
		],
		channel_id: '1768925123173158912',
		message_id: '1772872129285459968',
	},
	{
		id: '',
		emoji: '💯',
		senders: [
			{
				sender_id: '1768931753772191744',
				count: 1,
				emojiIdList: [],
				sender_name: '',
				avatar: '',
			},
		],
		channel_id: '1768925123173158912',
		message_id: '1772872129285459968',
	},
];
