import {
	referencesActions,
	selectAttachmentData,
	selectDataReferences,
	selectIdMessageReplied,
	selectOpenEditMessageState,
	selectOpenReplyMessageState,
	selectReferenceMessage,
	useAppDispatch,
} from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ApiMessageAttachment, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/api.gen';

export function useReference() {
	const dispatch = useAppDispatch();
	const referenceMessage = useSelector(selectReferenceMessage);
	const dataReferences = useSelector(selectDataReferences);
	const idMessageReplied = useSelector(selectIdMessageReplied);
	const openEditMessageState = useSelector(selectOpenEditMessageState);
	const openReplyMessageState = useSelector(selectOpenReplyMessageState);
	const attachmentDataRef = useSelector(selectAttachmentData);

	const setReferenceMessage = useCallback(
		(message: IMessageWithUser | null) => {
			dispatch(referencesActions.setReferenceMessage(message));
		},
		[dispatch],
	);

	const setDataReferences = useCallback(
		(dataReference: ApiMessageRef[]) => {
			dispatch(referencesActions.setDataReferences(dataReference));
		},
		[dispatch],
	);

	const setIdMessageToJump = useCallback(
		(idMessageToJump: string) => {
			dispatch(referencesActions.setIdMessageToJump(idMessageToJump));
		},
		[dispatch],
	);

	const setOpenEditMessageState = useCallback(
		(status: boolean) => {
			dispatch(referencesActions.setOpenEditMessageState(status));
		},
		[dispatch],
	);

	const setOpenReplyMessageState = useCallback(
		(status: boolean) => {
			dispatch(referencesActions.setOpenReplyMessageState(status));
		},
		[dispatch],
	);

	const setAttachmentData = useCallback(
		(attachent: ApiMessageAttachment | ApiMessageAttachment[]) => {
			dispatch(referencesActions.setAttachmentData(attachent));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			setReferenceMessage,
			setDataReferences,
			setIdMessageToJump,
			setOpenEditMessageState,
			setOpenReplyMessageState,
			referenceMessage,
			dataReferences,
			idMessageReplied,
			openEditMessageState,
			openReplyMessageState,
			attachmentDataRef,
			setAttachmentData,
		}),
		[
			setReferenceMessage,
			setDataReferences,
			setIdMessageToJump,
			setOpenEditMessageState,
			setOpenReplyMessageState,
			referenceMessage,
			dataReferences,
			idMessageReplied,
			openEditMessageState,
			openReplyMessageState,
			attachmentDataRef,
			setAttachmentData,
		],
	);
}
