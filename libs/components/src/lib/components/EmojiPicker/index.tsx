import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ChatContext } from '@mezon/core';
import { IMessageWithUser } from '@mezon/utils';
import { useContext } from 'react';
import { Icons } from '../../components';

export type EmojiPickerOptions = {
	classNameParentDiv?: string;
	classNameChildDiv?: string;
	messageEmoji?: IMessageWithUser;
};

function EmojiPicker(props: EmojiPickerOptions) {
	const { isOpenEmojiReacted, setIsOpenEmojiReacted } = useContext(ChatContext);
	const { emojiSelected, setEmojiSelected, messageRef, setMessageRef } = useContext(ChatContext);

	const handleEmojiSelect = (emoji: any, event: React.MouseEvent<HTMLDivElement>) => {
		setEmojiSelected(emoji.native);
		setIsOpenEmojiReacted(false);
		event.stopPropagation();
	};

	return (
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
	);
}

export default EmojiPicker;
