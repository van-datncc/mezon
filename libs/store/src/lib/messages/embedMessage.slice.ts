import { LoadingStatus } from '@mezon/utils';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export const EMBED_MESSAGE = 'EMBED_MESSAGE';

export interface FormDataEmbed {
	id: string;
	value: string;
}
export interface EmbedState {
	loadingStatus: LoadingStatus;
	formDataEmbed: Record<string, { [key: string]: string }>;
	optionsForm: Record<string, FormDataEmbed[]>;
}

export const initialEmbedState: EmbedState = {
	loadingStatus: 'not loaded',
	formDataEmbed: {},
	optionsForm: {}
};

export const embedSlice = createSlice({
	name: EMBED_MESSAGE,
	initialState: initialEmbedState,
	reducers: {
		addEmbedValueInput: (state, action: PayloadAction<{ message_id: string; data: FormDataEmbed; multiple?: boolean }>) => {
			const { message_id, data } = action.payload;
			state.formDataEmbed = {
				...state.formDataEmbed,
				[message_id]: { ...state.formDataEmbed[message_id], [data.id]: data.value }
			};
		},
		addEmbedValueOptions: (state, action: PayloadAction<{ message_id: string; data: FormDataEmbed; multiple?: boolean }>) => {
			const { message_id, data } = action.payload;
			state.optionsForm[message_id] = [data];
		}
	}
});

export const embedReducer = embedSlice.reducer;

export const embedActions = {
	...embedSlice.actions
};

export const getEmbedState = (rootState: { [EMBED_MESSAGE]: EmbedState }): EmbedState => rootState[EMBED_MESSAGE];

export const selectDataFormEmbedByMessageId = createSelector([getEmbedState, (state, message_id: string) => message_id], (state, message_id) => {
	if (state.optionsForm[message_id]) {
		return {
			dataInputs: state.formDataEmbed[message_id],
			dataOptions: state.optionsForm[message_id]
		};
	}
	return {
		dataInputs: state.formDataEmbed[message_id]
	};
});
