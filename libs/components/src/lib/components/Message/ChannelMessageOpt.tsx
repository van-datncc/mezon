import { Icons } from "@mezon/components";
import { useAuth } from "@mezon/core";
import { emojiActions, referencesActions, selectEmojiOpenEditState, selectEmojiReactedState, selectMessageReplyState, useAppDispatch } from "@mezon/store";
import { EmojiPlaces, IMessageWithUser } from "@mezon/utils";
import { useCallback } from "react";
import { useSelector } from "react-redux";

type ChannelMessageOptProps = {
	message: IMessageWithUser
};

export default function ChannelMessageOpt({ message }: ChannelMessageOptProps) {
    const { userId } = useAuth()
    const dispatch = useAppDispatch();


    
    const emojiReactedState = useSelector(selectEmojiReactedState);
    const emojiOpenEditState = useSelector(selectEmojiOpenEditState);
    const messageReplyState = useSelector(selectMessageReplyState); 
    
    const handleClickReply = () => {
		dispatch(emojiActions.setMessageReplyState(true));
		dispatch(emojiActions.setEmojiOpenEditState(false));
		dispatch(referencesActions.setReferenceMessage(message));
	};

	const handleClickEdit = () => {
		dispatch(emojiActions.setMessageReplyState(false));
		dispatch(emojiActions.setEmojiOpenEditState(true));
		dispatch(referencesActions.setReferenceMessage(message));
	};

    const handleClickReact = (event: React.MouseEvent<HTMLDivElement>) => {
		dispatch(emojiActions.setEmojiPlaceActive(EmojiPlaces.EMOJI_REACTION));
		dispatch(emojiActions.setEmojiReactedBottomState(false));
		dispatch(emojiActions.setEmojiMessBoxState(false));
		dispatch(emojiActions.setEmojiReactedState(true));
		dispatch(referencesActions.setReferenceMessage(message));
		event.stopPropagation();
	};

    return (
        <div className="iconHover flex justify-between">
            <div onClick={handleClickReact} className="h-full p-1 cursor-pointer">
                <Icons.Smile defaultFill={`${emojiReactedState ? '#FFFFFF' : '#AEAEAE'}`} />
            </div>

            {userId === message.sender_id ? (
                <button onClick={handleClickEdit} className="h-full p-1 cursor-pointer">
                    <Icons.PenEdit defaultFill={emojiOpenEditState ? '#FFFFFF' : '#AEAEAE'} />
                </button>
            ) : (
                <button onClick={handleClickReply} className="h-full px-1 pb-[2px] rotate-180">
                    <Icons.Reply defaultFill={messageReplyState ? '#FFFFFF' : '#AEAEAE'} />
                </button>
            )}
            <button className="h-full p-1 cursor-pointer">
                <Icons.ThreeDot />
            </button>
        </div>
    );
}
