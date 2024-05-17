import { useChatSending } from '@mezon/core';
import { AngleRightIcon, GiftIcon, MicrophoneIcon, SendIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { selectMemberByUserId } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Dimensions, Keyboard, KeyboardEvent, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';
import { IModeKeyboardPicker } from './components';
import AttachmentSwitcher from './components/AttachmentPicker/AttachmentSwitcher';
import EmojiSwitcher from './components/EmojiPicker/EmojiSwitcher';
import { EMessageActionType } from './enums';
import { styles } from './styles';
import { IMessageActionNeedToResolve } from './types';

const inputWidthWhenHasInput = Dimensions.get('window').width * 0.7;

interface IChatBoxProps {
	channelLabel: string;
	channelId: string;
	mode: number;
	onShowKeyboardBottomSheet: (isShow: boolean, height: number, type?: string) => void;
}
const ChatBox = memo((props: IChatBoxProps) => {
	const inputRef = useRef<any>();
	const [modeKeyBoardBottomSheet, setModeKeyBoardBottomSheet] = useState<IModeKeyboardPicker>('text');
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { sendMessage, sendMessageTyping, EditSendMessage } = useChatSending({
		channelId: props.channelId,
		channelLabel: props.channelLabel,
		mode: props.mode,
	});
	// const [messageRefId, setMessageId] = useState<string>('')
	const [messageActionListNeedToResolve, setMessageActionListNeedToResolve] = useState<IMessageActionNeedToResolve[]>([]);
	const [text, setText] = useState<string>('');
	const [currentSelectedMessage, setCurrentSelectedMessage] = useState<IMessageWithUser | null>(null); //TODO: update later
	const [isFocus, setIsFocus] = useState<boolean>(Platform.OS === 'ios');
	const [senderId, setSenderId] = useState<string>('');
	const senderMessage = useSelector(selectMemberByUserId(senderId));
	const [keyboardHeight, setKeyboardHeight] = useState<number>(Platform.OS === 'ios' ? 345 : 274);

	const { t } = useTranslation(['message']);

	const handleSendMessage = useCallback(() => {
		// sendMessage(text, mentions, attachments, references, anonymous);
		const reference = currentSelectedMessage
			? [
					{
						message_id: '',
						message_ref_id: currentSelectedMessage.id,
						ref_type: 0,
						message_sender_id: currentSelectedMessage.user.id,
						content: JSON.stringify(currentSelectedMessage.content),
						has_attachment: Boolean(currentSelectedMessage.attachments.length),
					},
				]
			: undefined;

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
	};

	const pushMessageActionIntoStack = (messagePayload: IMessageActionNeedToResolve) => {
		const { message } = messagePayload;
		setCurrentSelectedMessage(message);
		setSenderId(message?.sender_id);
	};

	function keyboardWillShow(event: KeyboardEvent) {
		if (keyboardHeight !== event.endCoordinates.height) {
			setKeyboardHeight(event.endCoordinates.height);
		}
	}

	useEffect(() => {
		const keyboardListener = Keyboard.addListener('keyboardDidShow', keyboardWillShow);
		const showKeyboard = DeviceEventEmitter.addListener('@SHOW_KEYBOARD', (value) => {
			//NOTE: trigger from message action 'MessageItemBS component'
			resetInput();
			openKeyBoard();
			pushMessageActionIntoStack(value);
		});

		return () => {
			showKeyboard.remove();
			resetInput();
			keyboardListener.remove();
		};
	}, []);

	const openKeyBoard = () => {
		timeoutRef.current = setTimeout(() => {
			inputRef.current.focus();
			setIsFocus(true);
		}, 300);
	};

	const resetInput = () => {
		inputRef.current?.blur();
		setIsFocus(false);
		if (timeoutRef) {
			clearTimeout(timeoutRef.current);
		}
	};

	function handleKeyboardBottomSheetMode(mode: IModeKeyboardPicker) {
		setModeKeyBoardBottomSheet(mode);
		if (mode === 'emoji' || mode === 'attachment') {
			props.onShowKeyboardBottomSheet(true, keyboardHeight, mode);
		} else {
			inputRef && inputRef.current && inputRef.current.focus();
			props.onShowKeyboardBottomSheet(false, 0);
		}
	}

	function handleInputFocus() {
		setModeKeyBoardBottomSheet('text');
		inputRef && inputRef.current && inputRef.current.focus();
		props.onShowKeyboardBottomSheet(false, keyboardHeight);
	}

	function handleInputBlur() {
		if (modeKeyBoardBottomSheet === 'text') props.onShowKeyboardBottomSheet(false, 0);
	}

	return (
		<View style={styles.wrapperChatBox}>
			{senderMessage?.user?.username ? (
				<View style={styles.aboveTextBoxWrapper}>
					<View style={styles.aboveTextBoxItem}>
						<Pressable onPress={() => removeAction(EMessageActionType.Reply)}>
							<Feather size={25} name="x" style={styles.closeIcon} />
						</Pressable>
						<Text style={styles.aboveTextBoxText}>
							{t('chatBox.replyingTo')} {senderMessage?.user?.username}
						</Text>
					</View>
					{/* TODO: edit case */}
					{/* <View style={styles.aboveTextBoxItem}>
						<Feather size={25} name='x' style={styles.closeIcon} />
						<Text style={styles.aboveTextBoxText}>{senderMessage?.user?.username}</Text>
					</View> */}
				</View>
			) : null}
			<View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
				{text.length > 0 ? (
					<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
						<AngleRightIcon width={18} height={18} />
					</View>
				) : (
					<>
						<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
							<AttachmentSwitcher onChange={handleKeyboardBottomSheetMode} mode={modeKeyBoardBottomSheet} />
						</View>
						<View style={[styles.iconContainer, { backgroundColor: '#333333' }]}>
							<GiftIcon width={22} height={22} />
						</View>
					</>
				)}

				<View style={{ position: 'relative', justifyContent: 'center' }}>
					<TextInput
						autoFocus={isFocus}
						placeholder={'Write your thoughts here...'}
						placeholderTextColor={Colors.textGray}
						onChangeText={(text: string) => {
							setText(text);
							handleTypingDebounced();
						}}
						defaultValue={text}
						blurOnSubmit={false}
						ref={inputRef}
						onSubmitEditing={handleSendMessage}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						style={[
							styles.inputStyle,
							text.length > 0 && { width: inputWidthWhenHasInput },
							{ backgroundColor: Colors.tertiaryWeight, color: Colors.tertiary },
						]}
					/>
					<View style={styles.iconEmoji}>
						<EmojiSwitcher onChange={handleKeyboardBottomSheetMode} mode={modeKeyBoardBottomSheet} />
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
		</View>
	);
});

export default ChatBox;
