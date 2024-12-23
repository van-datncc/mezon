import { useChatSending, useCurrentInbox, useDeleteMessage, useEditMessage, useEscapeKeyClose } from '@mezon/core';
import { selectOpenEditMessageState } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageWithUser from '../MessageWithUser';

type ModalDeleteMessProps = {
	mess: IMessageWithUser;
	closeModal: () => void;
	mode: number;
	channelId?: string;
	channelLable?: string;
	isRemoveAttachment?: boolean;
};

const ModalDeleteMess = (props: ModalDeleteMessProps) => {
	const { mess, closeModal, mode, isRemoveAttachment } = props;
	const current = useCurrentInbox() || undefined;
	const modalRef = useRef<HTMLDivElement>(null);
	const isEditing = useSelector(selectOpenEditMessageState);
	const [isInitialRender, setIsInitialRender] = useState(isEditing);
	const hasAttachment = !!mess?.attachments?.length;
	const { deleteSendMessage } = useDeleteMessage({
		channelId: mess.channel_id,
		mode: mode,
		hasAttachment: hasAttachment
	});

	const { handleCancelEdit } = useEditMessage(props.channelId ?? '', props.channelLable ?? '', mode, mess);
	const { editSendMessage } = useChatSending({ channelOrDirect: current, mode });

	const handleAction = () => {
		if (isRemoveAttachment) {
			editSendMessage(mess.content, mess.id, mess.mentions ?? [], [], true, '');
		} else {
			deleteSendMessage(mess.id);
		}
		handleCancelEdit();
		closeModal();
	};

	const handleEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.stopPropagation();
			if (isInitialRender) {
				setIsInitialRender(false);
			} else {
				handleAction();
			}
		}
	};

	useEffect(() => {
		modalRef?.current?.focus();
	}, []);

	useEscapeKeyClose(modalRef, closeModal);

	return (
		<div
			className="w-[100vw] h-[100vh] overflow-hidden fixed top-0 left-0 z-50 bg-black bg-opacity-80 flex flex-row justify-center items-center"
			ref={modalRef}
			onKeyUp={handleEnter as any}
			tabIndex={0}
		>
			<div className="w-fit h-fit dark:bg-bgPrimary bg-bgLightModeThird rounded-lg flex-col justify-start items-start gap-3 inline-flex overflow-hidden">
				<div className="dark:text-white text-black">
					<div className="p-4 pb-0">
						<h3 className="font-bold pb-4">{isRemoveAttachment ? 'Remove Attachment' : 'Delete Message'}</h3>
						<p>{isRemoveAttachment ? 'Do you want to remove the attachment on this message?' : 'Do you want to delete this message?'}</p>
					</div>
					<div className="p-4 max-w-[720px] max-h-[50vh] overflow-y-auto hide-scrollbar">
						<MessageWithUser allowDisplayShortProfile={false} message={mess} mode={mode} isMention={true} isShowFull={true} />
					</div>
					<div className="w-full dark:bg-bgSecondary bg-bgLightSecondary p-4 flex justify-end gap-x-4">
						<button onClick={closeModal} className="px-4 py-2 hover:underline rounded">
							Cancel
						</button>
						<button onClick={handleAction} className="px-4 py-2 bg-[#DA363C] rounded hover:bg-opacity-85 text-white">
							{isRemoveAttachment ? 'Remove' : 'Delete'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalDeleteMess;
