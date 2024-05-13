import { useChatSending } from '@mezon/core';
import { Colors } from '@mezon/mobile-ui';
import React, { useCallback } from 'react';
import { Dimensions, TextInput, View } from 'react-native';
import { useThrottledCallback } from 'use-debounce';
import AngleRightIcon from '../../../../assets/svg/angle-right.svg';
import ChatGiftIcon from '../../../../assets/svg/chatGiftNitro.svg';
import PlusIcon from '../../../../assets/svg/guildAddRole.svg';
import MicrophoneIcon from '../../../../assets/svg/microphone.svg';
import SendButtonIcon from '../../../../assets/svg/sendButton.svg';
import SmilingFaceIcon from '../../../../assets/svg/voiceReaction.svg';
import { styles } from './styles';

const inputWidthWhenHasInput = Dimensions.get('window').width * 0.7;

const ChatBox = React.memo((props: { channelLabel: string; channelId: string; mode: number }) => {
	const inputRef = React.useRef<any>();
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

	return (
		<View style={styles.wrapperChatBox}>
			{text.length > 0 ? (
				<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
					<AngleRightIcon width={18} height={18} />
				</View>
			) : (
				<>
					<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
						<PlusIcon width={22} height={22} />
					</View>
					<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
						<ChatGiftIcon width={22} height={22} />
					</View>
				</>
			)}
			<View style={{ position: 'relative', justifyContent: 'center' }}>
				<TextInput
					placeholder={'Write your thoughs here...'}
					placeholderTextColor={Colors.textGray}
					onChangeText={(text: string) => {
						setText(text);
						handleTypingDebounced();
					}}
					defaultValue={text}
					ref={inputRef}
					blurOnSubmit={false}
					onSubmitEditing={handleSendMessage}
					style={[
						styles.inputStyle,
						text.length > 0 && { width: inputWidthWhenHasInput },
						{ backgroundColor: Colors.tertiaryWeight, color: Colors.tertiary },
					]}
				/>
				<SmilingFaceIcon width={25} height={25} style={styles.iconEmoji} />
			</View>
			<View style={[styles.iconContainer, { backgroundColor: '#2b2d31' }]}>
				{text.length > 0 ? (
					<View onTouchEnd={handleSendMessage} style={[styles.iconContainer, styles.iconSend]}>
						<SendButtonIcon width={18} height={18} />
					</View>
				) : (
					<MicrophoneIcon width={22} height={22} />
				)}
			</View>
		</View>
	);
});

export default ChatBox;
