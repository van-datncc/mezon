import { useChatSending } from '@mezon/core';
import { Colors } from '@mezon/mobile-ui';
import React, { useCallback } from 'react';
import { Dimensions, TextInput, View } from 'react-native';
import { useThrottledCallback } from 'use-debounce';

import { styles } from './styles';
import EmojiPicker from "./components/EmojiPicker";
import AttachmentPicker from "./components/AttachmentPicker";
import { AngleRightIcon, GiftIcon, MicrophoneIcon, SendIcon } from '@mezon/mobile-components';
import { useState } from 'react';

const inputWidthWhenHasInput = Dimensions.get('window').width * 0.7;

const ChatBox = React.memo((props: { channelLabel: string; channelId: string; mode: number, onPickerShow: (isShow: boolean, height: number) => void }) => {
	const inputRef = React.useRef<TextInput>();
	const [padding, setPadding] = useState<number>(0)
	const { sendMessage, sendMessageTyping } = useChatSending({ channelId: props.channelId, channelLabel: props.channelLabel, mode: props.mode });

	const [text, setText] = React.useState<string>('');

	const handleSendMessage = useCallback(() => {
		// TODO: Just send only text messages
		// sendMessage(text, mentions, attachments, references, anonymous);
		sendMessage({ t: text }, [], [], undefined, false);
		setText('');
	}, [sendMessage, text]);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	function handlePaddingBottom(isShow: boolean, padding: number = 0) {
		if (isShow) {
			setPadding(padding)
			props.onPickerShow(true, padding);
		} else {
			setPadding(0)
			inputRef && inputRef.current && inputRef.current.focus();
			props.onPickerShow(false, 0)
		}
	}

	return (
		<View style={{ ...styles.wrapperChatBox }}>
			{text.length > 0 ? (
				<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
					<AngleRightIcon width={18} height={18} />
				</View>
			) : (
				<>
					<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
						<AttachmentPicker />
					</View>
					<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
						<GiftIcon width={22} height={22} />
					</View>
				</>
			)}

			<View style={{ position: 'relative', justifyContent: 'center' }}>
				<TextInput
					placeholder={'Write your thoughts here...'}
					placeholderTextColor={Colors.textGray}
					onChangeText={(text: string) => {
						setText(text);
						handleTypingDebounced();
					}}
					defaultValue={text}
					ref={inputRef}
					blurOnSubmit={false}
					onFocus={()=>handlePaddingBottom(false)}
					onSubmitEditing={handleSendMessage}
					style={[
						styles.inputStyle,
						text.length > 0 && { width: inputWidthWhenHasInput },
						{ backgroundColor: Colors.tertiaryWeight, color: Colors.tertiary },
					]}
				/>
				<View style={styles.iconEmoji}>
					<EmojiPicker onShow={handlePaddingBottom} />
				</View>
			</View>

			<View style={[styles.iconContainer, { backgroundColor: '#2b2d31' }]}>
				{text.length > 0 ? (
					<View onTouchEnd={handleSendMessage} style={[styles.iconContainer, styles.iconSend]}>
						<SendIcon width={18} height={18} />
					</View>
				) : (
					<MicrophoneIcon width={22} height={22} />
				)}
			</View>
		</View>
	);
});

export default ChatBox;
