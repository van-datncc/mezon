import { ChatContext } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import Picker, { EmojiClickData, Theme } from 'emoji-picker-react';

import { useContext } from 'react';

export type EmojiPickerOptions = {
	// classNameParentDiv?: string;
	// classNameChildDiv?: string;
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
};

function EmojiPickerComp(props: EmojiPickerOptions) {
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

	const handleEmojiSelect = (emojiObject: EmojiClickData, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		console.log(emojiObject);
		// if (props.emojiAction === EmojiPlaces.EMOJI_REACTION || props.emojiAction === EmojiPlaces.EMOJI_REACTION_BOTTOM) {
		// 	setEmojiSelectedReacted(emojiData.emoji);
		// 	setIsOpenEmojiReacted(false);
		// 	setIsOpenEmojiReactedBottom(false);
		// 	event.stopPropagation();
		// } else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
		// 	setEmojiSelectedMess(emojiData.emoji);
		// 	event.stopPropagation();
		// 	setIsOpenEmojiMessBox(false);
		// 	setIsOpenEmojiReactedBottom(false);
		// }
	};

	return (
		<>
			{/* <Picker
				data={data}
				onEmojiSelect={handleEmojiSelect}
				theme="dark"
				onClickOutside={() => {
					setIsOpenEmojiMessBox(false);
					setIsOpenEmojiReacted(false);
					setIsOpenEmojiReactedBottom(false);
				}}
			/> */}

			<Picker onEmojiClick={() => handleEmojiSelect} width={500} theme={Theme.DARK} height={458} />
		</>
	);
}

export default EmojiPickerComp;
