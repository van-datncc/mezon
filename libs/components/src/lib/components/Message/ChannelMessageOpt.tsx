import { Icons } from '@mezon/components';
import { useChatReaction, useReference } from '@mezon/core';
import { messagesActions, referencesActions, useAppDispatch } from '@mezon/store';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';

type ChannelMessageOptProps = {
	message: IMessageWithUser;
};

export default function ChannelMessageOpt({ message }: ChannelMessageOptProps) {
	const dispatch = useAppDispatch();
	const { reactionActions, userId, reactionRightState } = useChatReaction();
	const { openEditMessageState, openReplyMessageState } = useReference();

	const handleClickReply = () => {
		dispatch(referencesActions.setOpenReplyMessageState(true));
		dispatch(referencesActions.setOpenEditMessageState(false));
		dispatch(referencesActions.setReferenceMessage(message));
		dispatch(messagesActions.setReplyMessageStatus(true));
	};

	const handleClickEdit = () => {
		dispatch(referencesActions.setOpenReplyMessageState(false));
		dispatch(referencesActions.setOpenEditMessageState(true));
		dispatch(referencesActions.setReferenceMessage(message));
		dispatch(messagesActions.setReplyMessageStatus(false));
	};

	const handleClickReact = (event: React.MouseEvent<HTMLDivElement>) => {
		dispatch(reactionActions.setReactionPlaceActive(EmojiPlaces.EMOJI_REACTION));
		dispatch(reactionActions.setReactionBottomState(false));
		dispatch(reactionActions.setReactionRightState(true));
		dispatch(referencesActions.setReferenceMessage(message));
		dispatch(messagesActions.setReplyMessageStatus(false));

		event.stopPropagation();
	};

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
			<button className="h-full p-1 cursor-pointer">
				<Icons.ThreeDot />
			</button>
		</div>
	);
}
