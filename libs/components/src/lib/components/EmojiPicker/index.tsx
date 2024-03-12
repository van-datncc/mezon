import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ChatContext } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useContext, useState } from 'react';
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

	// const handleEmojiSelect = (emoji: any, event: React.MouseEvent<HTMLDivElement>) => {
	// 	if (props.emojiAction === EmojiPlaces.EMOJI_REACTION) {
	// 		setEmojiSelected(emoji.native);
	// 		setIsOpenEmojiReacted(false);
	// 		event.stopPropagation();
	// 	} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
	// 	}
	// };
	const { emojiPlaceActive, setEmojiPlaceActive } = useContext(ChatContext);
	const [smileClass, setIsSmile] = useState<string>('#AEAEAE');
	const handleClickSmileEmoji = (event: React.MouseEvent) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION && isOpenEmojiReacted) {
			setEmojiPlaceActive(EmojiPlaces.EMOJI_REACTION);
			setIsOpenEmojiReacted(true);
			setIsOpenEmojiMessBox(false);
			event.stopPropagation();
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			event.stopPropagation();
			setEmojiPlaceActive(EmojiPlaces.EMOJI_EDITOR);
			setIsOpenEmojiReacted(false);
			setIsOpenEmojiMessBox(true);
			setIsSmile('#FFFFFF');
		}
	};

	console.log('emk', isOpenEmojiReacted);
	// useEffect(() => {
	// 	if (isOpenEmojiMessBox) {
	// 		setIsOpenEmojiReacted(false);
	// 		setIsSmile('#AEAEAE');
	// 	} else if (isOpenEmojiReacted === true && props.messageEmoji?.id === messageRef?.id) {
	// 		setIsOpenEmojiMessBox(false);
	// 		setIsSmile('#FFFFFF');
	// 	}
	// }, [isOpenEmojiMessBox, isOpenEmojiReacted]);

	if (props.messageEmoji?.id === messageRef?.id && isOpenEmojiReacted) {
		return (
			<>
				<div className={props.classNameParentDiv}>
					<div className={`${props.classNameChildDiv} scale-75`}>
						<Picker
							data={data}
							// onEmojiSelect={handleEmojiSelect}
							theme="dark"
							onClickOutside={() => {
								setIsOpenEmojiMessBox(false);
								setIsOpenEmojiReacted(false);
							}}
						/>
					</div>
				</div>
				<button onClick={handleClickSmileEmoji}>
					<Icons.Smile defaultFill={smileClass} />
				</button>
			</>
		);
	} else if (isOpenEmojiMessBox) {
		return (
			<>
				{emojiPlaceActive === EmojiPlaces.EMOJI_EDITOR && (
					<>
						<div className={props.classNameParentDiv}>
							<div className={`${props.classNameChildDiv} scale-75`}>
								<Picker
									data={data}
									// onEmojiSelect={handleEmojiSelect}
									theme="dark"
									onClickOutside={() => {
										setIsOpenEmojiMessBox(false);
										setIsOpenEmojiReacted(false);
									}}
								/>
							</div>
						</div>
						<button onClick={handleClickSmileEmoji}>
							<Icons.Smile defaultFill={smileClass} />
						</button>
					</>
				)}
			</>
		);
	}

	return (
		<button onClick={handleClickSmileEmoji}>
			<Icons.Smile defaultFill={'#AEAEAE'} />
		</button>
	);
}

export default EmojiPicker;
