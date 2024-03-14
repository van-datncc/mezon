import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ChatContext } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useContext } from 'react';

export type EmojiPickerOptions = {
	// classNameParentDiv?: string;
	// classNameChildDiv?: string;
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
};

function EmojiPicker(props: EmojiPickerOptions) {
	const { isOpenEmojiMessBox, setIsOpenEmojiMessBox } = useContext(ChatContext);
	const { isOpenEmojiReacted, setIsOpenEmojiReacted } = useContext(ChatContext);
	const {
		emojiSelectedReacted,
		setEmojiSelectedReacted,
		messageRef,
		setMessageRef,
		emojiPlaceActive,
		setEmojiPlaceActive,
		setEmojiSelectedMess,
		widthEmojiBar,
		setIsOpenEmojiReactedBottom,
	} = useContext(ChatContext);

	const handleEmojiSelect = (emoji: any, event: React.MouseEvent<HTMLDivElement>) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION || props.emojiAction === EmojiPlaces.EMOJI_REACTION_BOTTOM) {
			setEmojiSelectedReacted(emoji.native);
			setIsOpenEmojiReacted(false);
			setIsOpenEmojiReactedBottom(false);
			event.stopPropagation();
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			setEmojiSelectedMess(emoji.native);
			event.stopPropagation();
			setIsOpenEmojiMessBox(false);
			setIsOpenEmojiReactedBottom(false);
		}
	};

	return (
		<>
			<Picker
				data={data}
				onEmojiSelect={handleEmojiSelect}
				theme="dark"
				onClickOutside={() => {
					setIsOpenEmojiMessBox(false);
					setIsOpenEmojiReacted(false);
					setIsOpenEmojiReactedBottom(false);
				}}
			/>
		</>
	);
}

export default EmojiPicker;
