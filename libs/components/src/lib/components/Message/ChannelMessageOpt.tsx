import { Icons } from '@mezon/components';
import { useChatReaction, useReference } from '@mezon/core';
import { referencesActions, useAppDispatch } from '@mezon/store';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useEffect } from 'react';

type ChannelMessageOptProps = {
	message: IMessageWithUser;
};

export default function ChannelMessageOpt({ message }: ChannelMessageOptProps) {
	const dispatch = useAppDispatch();
	const { reactionActions, userId, reactionRightState, reactionBottomState } = useChatReaction();
	const { openEditMessageState, openReplyMessageState, openOptionMessageState } = useReference();

	const handleClickReply = () => {
		dispatch(referencesActions.setOpenReplyMessageState(true));
		dispatch(referencesActions.setOpenEditMessageState(false));
		dispatch(referencesActions.setOpenOptionMessageState(false));
		dispatch(referencesActions.setReferenceMessage(message));
	};

	const handleClickEdit = () => {
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(referencesActions.setOpenEditMessageState(true));
		dispatch(referencesActions.setOpenOptionMessageState(false));
		dispatch(referencesActions.setReferenceMessage(message));
	};

	const handleClickOption = () => {
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(referencesActions.setOpenEditMessageState(false));
		dispatch(referencesActions.setOpenOptionMessageState(!openOptionMessageState));
		dispatch(referencesActions.setReferenceMessage(message));
	};

	const handleClickReact = (event: React.MouseEvent<HTMLDivElement>) => {
		dispatch(reactionActions.setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION));
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(reactionActions.setReactionBottomState(false));
		dispatch(reactionActions.setReactionRightState(true));
		dispatch(referencesActions.setReferenceMessage(message));
		event.stopPropagation();
	};

	// reset refMessage
	useEffect(() => {
		if (!openEditMessageState && !openEditMessageState && !reactionRightState && !reactionBottomState) {
			dispatch(referencesActions.setReferenceMessage(null));
		}
	}, [openEditMessageState, openEditMessageState, reactionRightState, reactionBottomState]);

	return (
		<div className="iconHover flex justify-between">
			<div onClick={handleClickReact} className="h-full p-1 cursor-pointer">
				<Icons.Smile defaultFill={`${reactionRightState ? '#FFFFFF' : '#AEAEAE'}`} />
			</div>

			{userId === message.sender_id ? (
				<button onClick={handleClickEdit} className="h-full p-1 cursor-pointer">
					<Icons.PenEdit defaultFill={openEditMessageState ? '#FFFFFF' : '#AEAEAE'} />
				</button>
			) : (
				<button onClick={handleClickReply} className="h-full px-1 pb-[2px] rotate-180">
					<Icons.Reply defaultFill={openReplyMessageState ? '#FFFFFF' : '#AEAEAE'} />
				</button>
			)}
			<button onClick={handleClickOption} className="h-full p-1 cursor-pointer">
				<Icons.ThreeDot />
			</button>
		</div>
	);
}
