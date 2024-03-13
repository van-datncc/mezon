import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ChatContext } from '@mezon/core';
import { EmojiPlaces, IMessageWithUser } from '@mezon/utils';
import { useContext, useEffect, useState } from 'react';
import { Icons } from '../../components';

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
	} = useContext(ChatContext);

	const handleEmojiSelect = (emoji: any, event: React.MouseEvent<HTMLDivElement>) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION) {
			setEmojiSelectedReacted(emoji.native);
			setIsOpenEmojiReacted(false);
			event.stopPropagation();
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			setEmojiSelectedMess(emoji.native);
			event.stopPropagation();
			setIsOpenEmojiMessBox(false);
		}
	};

	const [colorReation, setColorReaction] = useState<string>('#AEAEAE');
	const [colorEmojiChat, setColorEmojiChat] = useState<string>('#AEAEAE');

	const handleClickSmileEmoji = (event: React.MouseEvent) => {
		if (props.emojiAction === EmojiPlaces.EMOJI_REACTION && isOpenEmojiReacted) {
			// setEmojiPlaceActive(EmojiPlaces.EMOJI_REACTION);
			setIsOpenEmojiReacted(true);
			setIsOpenEmojiMessBox(false);
			setColorReaction('#FFFFFF');
			setColorEmojiChat('#AEAEAE');
			event.stopPropagation();
		} else if (props.emojiAction === EmojiPlaces.EMOJI_EDITOR) {
			// setEmojiPlaceActive(EmojiPlaces.EMOJI_EDITOR);
			setIsOpenEmojiReacted(false);
			setIsOpenEmojiMessBox(true);
			setColorReaction('#AEAEAE');
			setColorEmojiChat('#FFFFFF');
			event.stopPropagation();
		}
	};

	const [parentClassName, setParentClassName] = useState<string>('');
	const [childClassName, setChildClassName] = useState<string>('');
	console.log('width', widthEmojiBar);

	useEffect(() => {
		switch (emojiPlaceActive) {
			// case EmojiPlaces.EMOJI_EDITOR:
			// 	setParentClassName('absolute z-50');
			// 	setChildClassName('absolute transform right-0 mr-[-3rem]  scale-75');
			// 	break;
			case EmojiPlaces.EMOJI_REACTION:
				setParentClassName(`absolute`);
				setChildClassName('absolute transform right-[110%] mr-[-2rem] bottom-[-5rem] scale-75');
				break;
			// case EmojiPlaces.EMOJI_REACTION_BOTTOM:
			// 	setParentClassName(`absolute bottom-10 z-10 left-${widthEmojiBar}`);
			// 	setChildClassName('scale-75');
			// 	break;
			default:
				break;
		}
	}, [emojiPlaceActive, widthEmojiBar]);

	if ((props.messageEmoji?.id === messageRef?.id && isOpenEmojiReacted) || (isOpenEmojiMessBox && emojiPlaceActive === EmojiPlaces.EMOJI_EDITOR)) {
		return (
			<>
				<div className={parentClassName}>
					<div className={childClassName}>
						<Picker
							data={data}
							onEmojiSelect={handleEmojiSelect}
							theme="dark"
							onClickOutside={() => {
								setIsOpenEmojiMessBox(false);
								setIsOpenEmojiReacted(false);
							}}
						/>
					</div>
				</div>
				<button onClick={handleClickSmileEmoji}>
					<Icons.Smile
						defaultFill={`${props.messageEmoji?.id === messageRef?.id && isOpenEmojiReacted ? '#FFFFFF' : isOpenEmojiMessBox && colorEmojiChat}`}
					/>
				</button>
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
