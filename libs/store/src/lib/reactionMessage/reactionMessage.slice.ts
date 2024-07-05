import { EmojiDataOptionals, EmojiPlaces, IReaction } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiMessageReaction } from 'mezon-js/api.gen';

export const REACTION_FEATURE_KEY = 'reaction';

export const mapReactionToEntity = (reaction: UpdateReactionMessageArgs) => {
	return {
		...reaction,
	} as ReactionEntity;
};

export interface ReactionEntity extends IReaction {
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

export type UpdateBulkMessageReactionsArgs = {
	messages: {
		id: string;
		reactions?: ApiMessageReaction[] | undefined;
	}[];
};

export interface ReactionState extends EntityState<ReactionEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	reactionPlaceActive: EmojiPlaces;
	reactionTopState: boolean;
	reactionBottomState: boolean;
	reactionRightState: boolean;
	userReactionPanelState: boolean;
	reactionBottomStateResponsive: boolean;
	messageMatchWithRef: boolean;
	positionOfSmileButton: {
		top: number;
		right: number;
		left: number;
		bottom: number;
	};
	emojiHover: EmojiDataOptionals | null;
	computedMessageReactions: Record<string, EmojiDataOptionals[]>;
}

export const reactionAdapter = createEntityAdapter({
	selectId: (emo: ReactionEntity) => emo.id || '',
});

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
	reactionPlaceActive: EmojiPlaces.EMOJI_REACTION,
	reactionTopState: false,
	reactionBottomState: false,
	reactionRightState: false,
	userReactionPanelState: false,
	reactionBottomStateResponsive: false,
	messageMatchWithRef: false,
	positionOfSmileButton: {
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
	},
	emojiHover: null,
	computedMessageReactions: {},
});

export const reactionSlice = createSlice({
	name: REACTION_FEATURE_KEY,
	initialState: initialReactionState,
	reducers: {
		add: reactionAdapter.addOne,
		remove: reactionAdapter.removeOne,

		setEmojiHover(state, action) {
			state.emojiHover = action.payload;
		},
		setReactionPlaceActive(state, action) {
			state.reactionPlaceActive = action.payload;
		},
		setReactionTopState(state, action) {
			state.reactionTopState = action.payload;
		},
		setReactionBottomState(state, action) {
			state.reactionBottomState = action.payload;
		},
		setReactionBottomStateResponsive(state, action) {
			state.reactionBottomStateResponsive = action.payload;
		},

		setReactionRightState(state, action) {
			state.reactionRightState = action.payload;
		},

		setReactionDataSocket: (state, action: PayloadAction<UpdateReactionMessageArgs>) => {
			const reactionDataSocket = {
				action: action.payload.action,
				id: action.payload.id ?? '',
				emoji: action.payload.emoji ?? '',
				senders: [
					{
						sender_id: action.payload.sender_id || '',
						count: action.payload.action ? action.payload.count : 1,
					},
				],
				channel_id: action.payload.channel_id ?? '',
				message_id: action.payload.message_id ?? '',
			};
			if (!action.payload.action) {
				const { action, ...newStateReaction } = reactionDataSocket || {};
				reactionAdapter.upsertOne(state, mapReactionToEntity(newStateReaction));
			} else if (action.payload.action) {
				const { action, ...newStateReaction } = reactionDataSocket;
				const dataSocketRemove = {
					...newStateReaction,
					senders: [
						{
							...newStateReaction.senders[0],
							count: newStateReaction?.senders[0]?.count && newStateReaction?.senders[0]?.count * -1,
						},
					],
				};
				reactionAdapter.upsertOne(state, mapReactionToEntity(dataSocketRemove));
			}

			if (action.payload.message_id) {
				state.computedMessageReactions[action.payload.message_id] = combineMessageReactions(state, action.payload.message_id);
			}
		},

		setUserReactionPanelState(state, action) {
			state.userReactionPanelState = action.payload;
		},
		setMessageMatchWithRef(state, action) {
			state.messageMatchWithRef = action.payload;
		},
		setPositionOfSmileButton(state, action) {
			state.positionOfSmileButton = action.payload;
		},
		updateBulkMessageReactions: (state, action: PayloadAction<UpdateBulkMessageReactionsArgs>) => {
			const { messages } = action.payload;

			for (const message of messages) {
				const reactionsRaw = message.reactions;
				const reactions = (reactionsRaw || []).map((reaction) => {
					const id = reaction.id || '';
					const message_id = message.id;
					return mapReactionToEntity({ ...reaction, id, message_id });
				});
				reactionAdapter.upsertMany(state, reactions);

				state.computedMessageReactions[message.id] = combineMessageReactions(state, message.id);
			}
		},
	},
});

function combineMessageReactions(state: ReactionState, messageId: string): EmojiDataOptionals[] {
	const reactionEntities = reactionAdapter.getSelectors().selectAll(state);
	const reactions = reactionEntities.filter((reaction) => reaction.message_id === messageId);

	const dataCombined: Record<string, EmojiDataOptionals> = {};

	for (const reaction of reactions) {
		const emoji = reaction.emoji || '' as string;

		if (!dataCombined[emoji]) {
			dataCombined[emoji] = {
				emoji,
				senders: [],
				action: false,
				message_id: messageId,
				// TODO: TBD
				id: '',
				channel_id: '',
			};
		}

		const newSender = {
			sender_id: reaction.sender_id,
			count: reaction.count,
		};

		const reactionData = dataCombined[emoji];
		const senderIndex = reactionData.senders.findIndex((sender) => sender.sender_id === newSender.sender_id);
		
		if (senderIndex === -1) {
			reactionData.senders.push(newSender);
		} else if (reactionData?.senders[senderIndex]) {
			reactionData.senders[senderIndex].count = newSender.count;
		}
	}

	const dataCombinedArray = Object.values(dataCombined);

	return dataCombinedArray;
}

export const reactionReducer = reactionSlice.reducer;

export const reactionActions = {
	...reactionSlice.actions,
	updateReactionMessage,
};

const { selectAll, selectEntities } = reactionAdapter.getSelectors();

export const getReactionState = (rootState: { [REACTION_FEATURE_KEY]: ReactionState }): ReactionState => rootState[REACTION_FEATURE_KEY];

export const selectAllEmojiReaction = createSelector(getReactionState, selectAll);

export const selectEmojiReactionEntities = createSelector(getReactionState, selectEntities);

export const selectReactionPlaceActive = createSelector(getReactionState, (state: ReactionState) => state.reactionPlaceActive);

export const selectReactionTopState = createSelector(getReactionState, (state: ReactionState) => state.reactionTopState);

export const selectReactionBottomState = createSelector(getReactionState, (state: ReactionState) => state.reactionBottomState);

export const selectReactionBottomStateResponsive = createSelector(getReactionState, (state: ReactionState) => state.reactionBottomStateResponsive);

export const selectReactionRightState = createSelector(getReactionState, (state: ReactionState) => state.reactionRightState);

export const selectUserReactionPanelState = createSelector(getReactionState, (state: ReactionState) => state.userReactionPanelState);

export const selectMessageMatchWithRef = createSelector(getReactionState, (state: ReactionState) => state.messageMatchWithRef);

export const selectPositionEmojiButtonSmile = createSelector(getReactionState, (state: ReactionState) => state.positionOfSmileButton);

export const selectEmojiHover = createSelector(getReactionState, (state: ReactionState) => state.emojiHover);

export const selectComputedMessageReactions = createSelector(getReactionState, (state: ReactionState) => state.computedMessageReactions);

export const selectIsMessageHasReaction = (messageId: string) =>
	createSelector(selectComputedMessageReactions, (computedMessageReactions) => {
		return computedMessageReactions[messageId] && computedMessageReactions[messageId].length > 0;
	});

export const selectComputedReactionsByMessageId = (messageId: string) =>
	createSelector(selectComputedMessageReactions, (computedMessageReactions) => {
		return computedMessageReactions[messageId] || [];
	});
