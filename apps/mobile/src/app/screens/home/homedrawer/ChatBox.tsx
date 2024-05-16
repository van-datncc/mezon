import { useChatSending } from '@mezon/core';
import { Colors } from '@mezon/mobile-ui';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Dimensions, Keyboard, TextInput, View, Text, Pressable } from 'react-native';
import { useThrottledCallback } from 'use-debounce';
import AngleRightIcon from '../../../../assets/svg/angle-right.svg';
import ChatGiftIcon from '../../../../assets/svg/chatGiftNitro.svg';
import MicrophoneIcon from '../../../../assets/svg/microphone.svg';
import SendButtonIcon from '../../../../assets/svg/sendButton.svg';
import { styles } from './styles';
import EmojiPicker from "./components/EmojiPicker";
import AttachmentPicker from "./components/AttachmentPicker";
import { EChatBoxAction, EMessageActionType } from './enums';
import { useSelector } from 'react-redux';
import { selectMemberByUserId, selectMessageByMessageId } from '@mezon/store';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { ApiMessageRef } from 'mezon-js/api.gen';
import { IMessageActionNeedToResolve } from './types';
import { IMessageWithUser } from '@mezon/utils';

const inputWidthWhenHasInput = Dimensions.get('window').width * 0.7;

const ChatBox = memo((props: { channelLabel: string; channelId: string; mode: number }) => {
	const inputRef = useRef<any>();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { sendMessage, sendMessageTyping, EditSendMessage } = useChatSending({ channelId: props.channelId, channelLabel: props.channelLabel, mode: props.mode });
	// const [messageRefId, setMessageId] = useState<string>('')
	const [ messageActionListNeedToResolve, setMessageActionListNeedToResolve ] = useState<IMessageActionNeedToResolve[]>([]);
	const [text, setText] = useState<string>('');
	const [currentSelectedMessage, setCurrentSelectedMessage] = useState<IMessageWithUser | null>(null); //TODO: update later
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [senderId, setSenderId] = useState<string>('');
	const senderMessage = useSelector(selectMemberByUserId(senderId));

	const { t } = useTranslation(['message']);

	const handleSendMessage = useCallback(() => {
		// TODO: Just send only text messages
		// sendMessage(text, mentions, attachments, references, anonymous);
		const reference = currentSelectedMessage ? [{
			message_id: '',
			message_ref_id: currentSelectedMessage.id,
			ref_type: 0,
			message_sender_id: currentSelectedMessage.user.id,
			content: JSON.stringify(currentSelectedMessage.content),
			has_attachment: Boolean(currentSelectedMessage.attachments.length),
		}]: undefined;

		sendMessage({ t: text }, [], [], reference, false);
		setText('');
		setSenderId('');
		setCurrentSelectedMessage(null);
	}, [sendMessage, text, currentSelectedMessage]);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	const removeAction = (actionType: EMessageActionType) => {
		//TODO: need remove from stack
		switch (actionType) {
			case EMessageActionType.Reply:
				setSenderId('');
				setCurrentSelectedMessage(null);
				break;
			case EMessageActionType.EditMessage:
				//TODO:
				break;
			default:
				break;
		}
	}

	const pushMessageActionIntoStack = (messagePayload: IMessageActionNeedToResolve) => {
		const { targetMessage } = messagePayload;
		setCurrentSelectedMessage(targetMessage);
		setSenderId(targetMessage.sender_id);
	}

	useEffect(() => {
		const showKeyboard = DeviceEventEmitter.addListener(
			'@SHOW_KEYBOARD',
			(value) => {
				//NOTE: trigger from message action 'MessageItemBS component'
				resetInput();
				openKeyBoard();
				pushMessageActionIntoStack(value);
			},
		);
	
		return () => {
		  	showKeyboard.remove();
			resetInput();
		};
	}, []);

	const openKeyBoard = () => {
		timeoutRef.current = setTimeout(() => {
			inputRef.current.focus();
			setIsFocus(true);
		}, 300);
	}

	const resetInput = () => {
		inputRef.current?.blur();
		setIsFocus(false);
		if (timeoutRef) {
			clearTimeout(timeoutRef.current);
		}
	};

	return (
		<View style={styles.wrapperChatBox}>
			{senderMessage?.user?.username ? (
				<View style={styles.aboveTextBoxWrapper}>
					<View style={styles.aboveTextBoxItem}>
						<Pressable onPress={() => removeAction(EMessageActionType.Reply)}>
							<Feather size={25} name='x' style={styles.closeIcon} />
						</Pressable>
						<Text style={styles.aboveTextBoxText}>{t('chatBox.replyingTo')} {senderMessage?.user?.username}</Text>
					</View>
					{/* TODO: edit case */}
					{/* <View style={styles.aboveTextBoxItem}>
						<Feather size={25} name='x' style={styles.closeIcon} />
						<Text style={styles.aboveTextBoxText}>{senderMessage?.user?.username}</Text>
					</View> */}
				</View>
			): null}
			<View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10}}>
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
							<ChatGiftIcon width={22} height={22} />
						</View>
					</>
				)}
				<View style={{ position: 'relative', justifyContent: 'center' }}>
					<TextInput
						autoFocus={isFocus}
						placeholder={'Write your thoughs here...'}
						placeholderTextColor={Colors.textGray}
						onChangeText={(text: string) => {
							setText(text);
							handleTypingDebounced();
						}}
						defaultValue={text}
						blurOnSubmit={false}
						ref={inputRef}
						onSubmitEditing={handleSendMessage}
						style={[
							styles.inputStyle,
							text.length > 0 && { width: inputWidthWhenHasInput },
							{ backgroundColor: Colors.tertiaryWeight, color: Colors.tertiary },
						]}
					/>
					<View style={styles.iconEmoji}>
						<EmojiPicker />
					</View>
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
		</View>
	);
});

export default ChatBox;
