import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ChatContext } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useContext } from 'react';
import { Icons } from '../../components';

export type EmojiPickerOptions = {
	classNameParentDiv?: string;
	classNameChildDiv?: string;
	messageEmoji?: IMessageWithUser;
	emojiAction?: EmojiPlaces;
};

function EmojiPicker(props: EmojiPickerOptions) {
	const { isOpenEmojiMessBox, setIsOpenEmojiMessBox } = useContext(ChatContext);
	const { isOpenEmojiReacted, setIsOpenEmojiReacted } = useContext(ChatContext);
	const { emojiSelected, setEmojiSelected, messageRef, setMessageRef } = useContext(ChatContext);

	const handleEmojiSelect = (emoji: any, event: React.MouseEvent<HTMLDivElement>) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION) {
			setEmojiSelected(emoji.native);
			setIsOpenEmojiReacted(false);
			event.stopPropagation();
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			console.log('í-ok', isOpenEmojiMessBox);
		}
	};
	console.log(props.emojiAction);
	return (
		<>
			{EmojiPlaces.EMOJI_REACTION ? (
				<>
					{props.messageEmoji?.id === messageRef?.id && isOpenEmojiReacted && (
						<div className={props.classNameParentDiv}>
							<div className={`${props.classNameChildDiv} scale-75`}>
								<Picker
									data={data}
									onEmojiSelect={handleEmojiSelect}
									theme="dark"
									onClickOutside={() => {
										setIsOpenEmojiReacted(false);
									}}
								/>
							</div>
						</div>
					)}
					<button>
						<Icons.Smile defaultFill={props.messageEmoji?.id === messageRef?.id && isOpenEmojiReacted ? '#FFFFFF' : '#AEAEAE'} />
					</button>
				</>
			) : (
				EmojiPlaces.EMOJI_EDITOR &&
				isOpenEmojiMessBox && (
					<>
						<Picker
							data={data}
							onEmojiSelect={handleEmojiSelect}
							theme="dark"
							// onClickOutside={() => {
							// 	setIsOpenEmojiReacted(false);
							// }}
						/>
						<button>
							<Icons.Smile defaultFill={isOpenEmojiMessBox ? '#FFFFFF' : '#AEAEAE'} />
						</button>
					</>
				)
			)}
		</>
	);
}

export default EmojiPicker;
