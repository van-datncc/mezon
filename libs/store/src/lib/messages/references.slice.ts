import { IMessage, PreSendAttachment, uploadingAttachmentStatus } from '@mezon/utils';
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
	attachmentAfterUpload: PreSendAttachment[];
	uploadingStatuses: Record<string, Record<string, uploadingAttachmentStatus>>;
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
	attachmentAfterUpload: [],
	uploadingStatuses: {},
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

		updateAttachmentMessageId(state, action: PayloadAction<{ channelId: string; messageId: string }>) {
			const { channelId, messageId } = action.payload;

			state.attachmentAfterUpload = state.attachmentAfterUpload.map((attachment) => {
				if (attachment.channelId === channelId && attachment.messageId === '') {
					return { ...attachment, messageId }; // Return updated attachment
				}
				return attachment;
			});
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

		setAtachmentAfterUpload(state, action: PayloadAction<PreSendAttachment>) {
			const newAttachment = action.payload;
			const { channelId, files } = newAttachment;

			const existingAttachmentIndex = state.attachmentAfterUpload.findIndex((attachment) => attachment.channelId === channelId);

			if (existingAttachmentIndex !== -1) {
				if (files.length === 0) {
					state.attachmentAfterUpload.splice(existingAttachmentIndex, 1);
				} else {
					const existingAttachment = state.attachmentAfterUpload[existingAttachmentIndex];
					state.attachmentAfterUpload[existingAttachmentIndex] = {
						...existingAttachment,
						files: [...existingAttachment.files, ...files],
					};
				}
			} else if (files.length > 0) {
				state.attachmentAfterUpload.push(newAttachment);
			}
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
			const { channelId, index } = action.payload;

			const attachmentIndex = state.attachmentAfterUpload.findIndex((attachment) => attachment.channelId === channelId);

			if (attachmentIndex !== -1) {
				const attachment = state.attachmentAfterUpload[attachmentIndex];

				if (index >= 0 && index < attachment.files.length) {
					attachment.files.splice(index, 1);

					if (attachment.files.length === 0) {
						state.attachmentAfterUpload.splice(attachmentIndex, 1);
					} else {
						state.attachmentAfterUpload[attachmentIndex] = {
							...attachment,
							files: [...attachment.files],
						};
					}
				}
			}
		},

		setUploadingStatus: (state, action: PayloadAction<{ channelId: string; messageId: string; hasSpinning: boolean; count: number }>) => {
			const { channelId, messageId, hasSpinning, count } = action.payload;

			if (!state.uploadingStatuses[channelId]) {
				state.uploadingStatuses[channelId] = {};
			}

			if (count > 0) {
				state.uploadingStatuses[channelId][messageId] = {
					hasSpinning,
					count,
				};
			} else {
				delete state.uploadingStatuses[channelId][messageId];
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

export const selectUploadingStatus = (channelId: string, messageId: string) =>
	createSelector(
		(state: { references: ReferencesState }) => state.references.uploadingStatuses,
		(uploadingStatuses) => {
			const status = uploadingStatuses[channelId]?.[messageId];
			return {
				hasSpinning: status?.hasSpinning ?? false,
				count: status?.count ?? 0,
			};
		},
	);
export const selectAttachmentData = (channelId: string) =>
	createSelector(getReferencesState, (state: ReferencesState) => {
		return state.attachmentDataRef[channelId] || [];
	});

export const selectIdMessageRefReply = (channelId: string) =>
	createSelector(getReferencesState, (state: ReferencesState) => {
		return state.idMessageRefReply[channelId] || '';
	});

export const selectFilteredAttachments = (channelId: string) =>
	createSelector(selectAttachmentAfterUpload, (attachmentAfterUpload) =>
		Object.values(attachmentAfterUpload).filter((item) => item.channelId === channelId),
	);
