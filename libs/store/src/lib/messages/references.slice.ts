import { IMessage } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiMessageAttachment, ApiMessageRef } from 'mezon-js/api.gen';

export const REFERENCES_FEATURE_KEY = 'references';

/*
 * Update these interfaces according to your requirements.
 */
export interface ReferencesEntity extends IMessage {
	id: string;
}

export interface ReferencesState extends EntityState<ReferencesEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	dataReferences: ApiMessageRef[];
	openEditMessageState: boolean;
	attachmentDataRef: Record<string, ApiMessageAttachment[]>;
	idMessageRefReply: Record<string, string>;
	idMessageRefReaction: string;
	idMessageRefEdit: string;
	statusLoadingAttachment: boolean;
	idMessageMention: string;
	attachmentAfterUpload: Record<string, File[]>;
	displayPreviewAttachmentsPanel: Record<string, boolean>;
}

export const referencesAdapter = createEntityAdapter<ReferencesEntity>();

export const fetchReferences = createAsyncThunk<ReferencesEntity[]>('references/fetchStatus', async (_, thunkAPI) => {
	return Promise.resolve([]);
});

export const initialReferencesState: ReferencesState = referencesAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	dataReferences: [],
	idMessageToJump: '',
	openEditMessageState: false,
	openReplyMessageState: false,
	attachmentDataRef: {},
	idMessageRefReply: {},
	idMessageRefReaction: '',
	idMessageRefEdit: '',
	statusLoadingAttachment: false,
	idMessageMention: '',
	attachmentAfterUpload: {},
	displayPreviewAttachmentsPanel: {},
});

export const referencesSlice = createSlice({
	name: REFERENCES_FEATURE_KEY,
	initialState: initialReferencesState,
	reducers: {
		add: referencesAdapter.addOne,
		remove: referencesAdapter.removeOne,

		setMessageMentionId(state, action) {
			state.idMessageMention = action.payload;
		},

		setPreviewAttachemtsPanel(state, action: PayloadAction<{ channelId: string; isDisplay: boolean }>) {
			const { channelId, isDisplay } = action.payload;
			console.log(action.payload);
			state.displayPreviewAttachmentsPanel[channelId] = isDisplay;
		},

		setDataReferences(state, action) {
			state.dataReferences = action.payload;
		},

		setStatusLoadingAttachment(state, action) {
			state.statusLoadingAttachment = action.payload;
		},

		setOpenEditMessageState(state, action) {
			state.openEditMessageState = action.payload;
		},
		setAtachmentAfterUpload(state, action: PayloadAction<{ channelId: string; files: File[] }>) {
			const { channelId, files } = action.payload;

			if (channelId === '' && files?.length === 0) {
				state.attachmentAfterUpload = {};
				return;
			}

			if (!state.attachmentAfterUpload[channelId]) {
				state.attachmentAfterUpload[channelId] = [];
			}

			state.attachmentAfterUpload[channelId] = [...state.attachmentAfterUpload[channelId], ...files];
		},

		setAttachmentData(state, action: PayloadAction<{ channelId: string; attachments: ApiMessageAttachment[] }>) {
			const { channelId, attachments } = action.payload;
			if (!state.attachmentDataRef[channelId]) {
				state.attachmentDataRef[channelId] = [];
			}
			if (attachments?.length === 0) {
				state.attachmentDataRef[channelId] = attachments;
			} else {
				state.attachmentDataRef[channelId] = [...state.attachmentDataRef[channelId], ...attachments];
			}
		},

		removeAttachment(state, action: PayloadAction<{ channelId: string; index: number }>) {
			const attachments = state.attachmentDataRef[action.payload.channelId];
			if (attachments && action.payload.index >= 0 && action.payload.index < attachments.length) {
				state.attachmentDataRef[action.payload.channelId].splice(action.payload.index, 1);
			}

			if (
				state.attachmentAfterUpload[action.payload.channelId] &&
				action.payload.index >= 0 &&
				action.payload.index < state.attachmentAfterUpload[action.payload.channelId].length
			) {
				state.attachmentAfterUpload[action.payload.channelId].splice(action.payload.index, 1);
			}
		},
		setIdReferenceMessageReply(state, action: PayloadAction<{ channelId: string; idMessageRefReply: string }>) {
			state.idMessageRefReply[action.payload.channelId] = action.payload.idMessageRefReply;
		},
		setIdReferenceMessageReaction(state, action) {
			state.idMessageRefReaction = action.payload;
		},
		setIdReferenceMessageEdit(state, action) {
			state.idMessageRefEdit = action.payload;
		},
		resetDataAttachment(state, action: PayloadAction<{ channelId: string }>) {
			state.attachmentDataRef[action.payload.channelId] = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchReferences.pending, (state: ReferencesState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchReferences.fulfilled, (state: ReferencesState, action: PayloadAction<ReferencesEntity[]>) => {
				referencesAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchReferences.rejected, (state: ReferencesState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const referencesReducer = referencesSlice.reducer;

export const referencesActions = {
	...referencesSlice.actions,
};

const { selectAll, selectEntities } = referencesAdapter.getSelectors();

export const getReferencesState = (rootState: { [REFERENCES_FEATURE_KEY]: ReferencesState }): ReferencesState => rootState[REFERENCES_FEATURE_KEY];

export const selectAllReferences = createSelector(getReferencesState, selectAll);

export const selectReferencesEntities = createSelector(getReferencesState, selectEntities);

export const selectDataReferences = createSelector(getReferencesState, (state: ReferencesState) => state.dataReferences);

export const selectOpenEditMessageState = createSelector(getReferencesState, (state: ReferencesState) => state.openEditMessageState);

export const selectIdMessageRefReaction = createSelector(getReferencesState, (state: ReferencesState) => state.idMessageRefReaction);

export const selectIdMessageRefEdit = createSelector(getReferencesState, (state: ReferencesState) => state.idMessageRefEdit);

export const selectStatusLoadingAttachment = createSelector(getReferencesState, (state: ReferencesState) => state.statusLoadingAttachment);

export const selectMessageMetionId = createSelector(getReferencesState, (state: ReferencesState) => state.idMessageMention);

export const selectAttachmentAfterUpload = createSelector(getReferencesState, (state: ReferencesState) => state.attachmentAfterUpload);

export const selectAttachmentData = (channelId: string) =>
	createSelector(getReferencesState, (state: ReferencesState) => {
		return state.attachmentDataRef[channelId] || [];
	});

export const selectIdMessageRefReply = (channelId: string) =>
	createSelector(getReferencesState, (state: ReferencesState) => {
		return state.idMessageRefReply[channelId] || '';
	});
export const selectDisplayPreviewAttachmentsPanel = (channelId: string) =>
	createSelector(getReferencesState, (state: ReferencesState) => {
		return state.displayPreviewAttachmentsPanel[channelId] || [];
	});

// {
// 	"filename": "7stickers.zip",
// 	"filetype": "application/x-zip-compressed",
// 	"size": 0,
// 	"url": "7stickers.zip"
// }
// 0:File
// lastModified:1724148491821
// lastModifiedDate: Tue Aug 20 2024 17:08:11 GMT+0700 (Indochina Time) {}
// name:"7stickers.zip"
// size:47563707
// type:"application/x-zip-compressed"
// webkitRelativePath:""
