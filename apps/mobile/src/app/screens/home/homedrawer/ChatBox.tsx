import { AngleRightIcon, GiftIcon, MicrophoneIcon, SendIcon, convertMentionsToData, convertMentionsToText } from '@mezon/mobile-components';
import { useChannelMembers, useChannels, useChatSending, useReference, useThreads } from '@mezon/core';
import { Colors } from '@mezon/mobile-ui';
import { ChannelMembersEntity, IMessageWithUser, UserMentionsOpt } from '@mezon/utils';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {DeviceEventEmitter, Dimensions, Keyboard, TextInput, View, Text, Pressable, Platform} from 'react-native';
import { useThrottledCallback } from 'use-debounce';
import { IModeKeyboardPicker } from './components';
import AttachmentSwitcher from './components/AttachmentPicker/AttachmentSwitcher';
import EmojiSwitcher from './components/EmojiPicker/EmojiSwitcher';
import { EMessageActionType } from './enums';
import { styles } from './styles';
import { useSelector } from 'react-redux';
import { selectCurrentChannel, selectMemberByUserId } from '@mezon/store';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { ApiMessageMention } from 'mezon-js/api.gen';
import UseMentionList from '../../../hooks/useUserMentionList';
import { renderTextContent } from './components/RenderTextContent';
import { ChannelsMention, HashtagSuggestions, Suggestions } from '../../../components/Suggestions';
import { TriggersConfig, useMentions } from 'react-native-controlled-mentions';
import { IMessageActionNeedToResolve, IPayloadThreadSendMessage } from './types';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { useNavigation } from '@react-navigation/native';
import { ActionEmitEvent } from './constants';

export const triggersConfig: TriggersConfig<'mention' | 'hashtag'> = {
  mention: {
    trigger: '@',
    allowedSpacesCount: 0,
    isInsertSpaceAfterMention: true,
  },
  hashtag: {
    trigger: '#',
    allowedSpacesCount: 0,
    isInsertSpaceAfterMention: true,
    textStyle: {
      fontWeight: 'bold',
      color: Colors.white,
    },
  },
};
const inputWidthWhenHasInput = Dimensions.get('window').width * 0.7;
interface IChatBoxProps {
	channelLabel: string;
	channelId: string;
	mode: number;
  messageAction?: EMessageActionType,
	onShowKeyboardBottomSheet: (isShow: boolean, height: number, type?: string) => void;
}
const ChatBox = memo((props: IChatBoxProps) => {
	const inputRef = useRef<any>();
	const [modeKeyBoardBottomSheet, setModeKeyBoardBottomSheet] = useState<IModeKeyboardPicker>('text');
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mentionTextValue, setMentionTextValue] = useState('');
  const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const { members } = useChannelMembers({ channelId: props.channelId });
  const textInput = useRef(null);
  const currentChannel = useSelector(selectCurrentChannel);
  const  listMentions  = UseMentionList(currentChannel?.id);
  const { listChannels } = useChannels();
  const { textInputProps, triggers } = useMentions({
    value: mentionTextValue,
    onChange: (newValue) => handleTextInputChange(newValue),
    triggersConfig,
  });
  const [listChannelsMention, setListChannelsMention] = useState<ChannelsMention[]>([])
	const { sendMessage, sendMessageTyping, EditSendMessage } = useChatSending({ channelId: props.channelId, channelLabel: props.channelLabel, mode: props.mode });
	const [messageActionListNeedToResolve, setMessageActionListNeedToResolve] = useState<IMessageActionNeedToResolve[]>([]);
	const [text, setText] = useState<string>('');
	const [currentSelectedReplyMessage, setCurrentSelectedReplyMessage] = useState<IMessageWithUser | null>(null);
	const [currentSelectedEditMessage, setCurrentSelectedEditMessage] = useState<IMessageWithUser | null>(null);
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [senderId, setSenderId] = useState<string>('');
	const senderMessage = useSelector(selectMemberByUserId(senderId));
	const [keyboardHeight, setKeyboardHeight] = useState<number>(Platform.OS === 'ios' ? 345 : 274);
  const navigation = useNavigation();
  const { setValueThread } = useThreads();
  const { setOpenThreadMessageState } = useReference();
	const { t } = useTranslation(['message']);

	const editMessage = useCallback(
		(editMessage: string, messageId: string) => {
			EditSendMessage(editMessage, messageId);
		},
		[EditSendMessage],
	);

	const removeMessageActionByType = useCallback((type: EMessageActionType) => {
		const newStack = [...messageActionListNeedToResolve.filter(it => it.type !== type)];
		setMessageActionListNeedToResolve(newStack);
	}, [messageActionListNeedToResolve])

	const removeAction = useCallback((actionType: EMessageActionType) => {
		switch (actionType) {
			case EMessageActionType.Reply:
				setSenderId('');
				removeMessageActionByType(EMessageActionType.Reply);
				setCurrentSelectedReplyMessage(null);
				break;
			case EMessageActionType.EditMessage:
				setCurrentSelectedEditMessage(null);
				removeMessageActionByType(EMessageActionType.EditMessage);
				setText('');
				break;
			default:
				break;
		}
	}, [removeMessageActionByType])

	const handleSendMessage = useCallback(() => {
    const payloadThreadSendMessage: IPayloadThreadSendMessage = {
      content: { t: text },
			mentions: mentionData,
			attachments: [],
			references: [],
    }

		const isEditMessage = messageActionListNeedToResolve[messageActionListNeedToResolve.length - 1]?.type === EMessageActionType.EditMessage;
		if (isEditMessage) {
			editMessage(text, currentSelectedEditMessage.id);
			removeAction(EMessageActionType.EditMessage);
		} else {
			const reference = currentSelectedReplyMessage ? [{
				message_id: '',
				message_ref_id: currentSelectedReplyMessage.id,
				ref_type: 0,
				message_sender_id: currentSelectedReplyMessage.user.id,
				content: JSON.stringify(currentSelectedReplyMessage.content),
				has_attachment: Boolean(currentSelectedReplyMessage.attachments.length),
			}]: undefined;

    if(![EMessageActionType.CreateThread].includes(props.messageAction)){
			sendMessage({ t: text }, mentionData , [], reference, false);
			removeAction(EMessageActionType.Reply);
    }
		}
    [EMessageActionType.CreateThread].includes(props.messageAction) && DeviceEventEmitter.emit(ActionEmitEvent.SEND_MESSAGE, payloadThreadSendMessage);
		setText('');
	}, [sendMessage, text, mentionData, currentSelectedReplyMessage, messageActionListNeedToResolve, currentSelectedEditMessage, editMessage, removeAction]);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	useEffect(() => {
		messageActionListNeedToResolve.forEach((item) => {
			const { targetMessage, type } = item;
			switch (type) {
				case EMessageActionType.Reply:
					setCurrentSelectedReplyMessage(targetMessage);
					setSenderId(targetMessage.sender_id);
					break;
				case EMessageActionType.EditMessage:
					setCurrentSelectedEditMessage(targetMessage);
					setText(targetMessage.content.t);
					break;
				default:
					setSenderId('');
					break;
			}
		})
	}, [messageActionListNeedToResolve])

	const sortMessageActionList = (a: IMessageActionNeedToResolve, b: IMessageActionNeedToResolve) => {
		if (a.type === EMessageActionType.EditMessage && b.type !== EMessageActionType.EditMessage) {
		  return 1;
		}
		if (a.type !== EMessageActionType.EditMessage && b.type === EMessageActionType.EditMessage) {
		  return -1;
		}
		return 0;
	}

	const pushMessageActionIntoStack = useCallback((messagePayload: IMessageActionNeedToResolve) => {
		const isExistingAction = messageActionListNeedToResolve.some(it => it.type === messagePayload.type);
		if (isExistingAction) {
			const newStack = [...messageActionListNeedToResolve.filter(it => it.type !== messagePayload.type), {...messagePayload}].sort(sortMessageActionList);
			setMessageActionListNeedToResolve(newStack);
		} else {
			setMessageActionListNeedToResolve(preValue => [...preValue, { ...messagePayload }].sort(sortMessageActionList))
		}
	}, [messageActionListNeedToResolve])

	function keyboardWillShow(event: KeyboardEvent) {
		if (keyboardHeight !== event.endCoordinates.height) {
			setKeyboardHeight(event.endCoordinates.height);
		}
	}
	useEffect(() => {
		const keyboardListener = Keyboard.addListener('keyboardDidShow', keyboardWillShow);
		const showKeyboard = DeviceEventEmitter.addListener(
			ActionEmitEvent.SHOW_KEYBOARD,
			(value) => {
				//NOTE: trigger from message action 'MessageItemBS component'
				resetInput();
        handleMessageAction(value)
				openKeyBoard();
			},
		);
		return () => {
			showKeyboard.remove();
			resetInput();
			keyboardListener.remove();
		};
	}, [pushMessageActionIntoStack]);

  useEffect(()=>{
    const listChannelsMention: ChannelsMention[] = listChannels.map((item) => {
      return {
        id: item?.channel_id ?? '',
        display: item?.channel_label ?? '',
        subText: item?.category_name ?? '',
      };
    });
    setListChannelsMention(listChannelsMention)
  },[listChannels])


  const handleTextInputChange = (text) => {
    setText(convertMentionsToText(text));
    handleTypingDebounced();
    setMentionTextValue(text);
  }

const handleMentionInput = () => {
  const mentionedUsers: UserMentionsOpt[] = [];
  const mentions = convertMentionsToData(mentionTextValue);
  const mentionList =
    members[0].users?.map((item: ChannelMembersEntity) => ({
      id: item?.user?.id ?? '',
      display: item?.user?.username ?? '',
      avatarUrl: item?.user?.avatar_url ?? '',
    })) ?? [];
  const convertedMentions: UserMentionsOpt[] = mentionList
    ? mentionList.map((mention) => ({
        user_id: mention.id.toString() ?? '',
        username: mention.display ?? '',
      }))
    : [];
  if (mentions.length > 0) {
    if (mentions.some((mention) => mention.display === '@here')) {
      mentionedUsers.splice(0, mentionedUsers.length);
      convertedMentions.forEach((item) => {
        mentionedUsers.push(item);
      });
    } else {
      for (const mention of mentions) {
        if (mention.display.startsWith('@')) {
          mentionedUsers.push({
            user_id: mention.id.toString() ?? '',
            username: mention.display ?? '',
          });
        }
      }
    }
    setMentionData(mentionedUsers);
  }
};

useEffect(() => {
  handleMentionInput();
}, [mentionTextValue]);

  const handleMessageAction = (messageAction: IMessageActionNeedToResolve) => {
    switch (messageAction.type) {
      case EMessageActionType.EditMessage:
      case EMessageActionType.Reply:
        pushMessageActionIntoStack(messageAction);
        break;
      case EMessageActionType.CreateThread:
      setOpenThreadMessageState(true);
      setValueThread(messageAction.targetMessage);
      navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL});
      break;
      default:
        break;
    }
  }
	const openKeyBoard = () => {
		timeoutRef.current = setTimeout(() => {
			inputRef.current?.focus();
			setIsFocus(true);
		}, 300);
	};

	const resetInput = () => {
		setIsFocus(false);
		inputRef.current?.blur();
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
			<View style={styles.aboveTextBoxWrapper}>
				{senderMessage?.user?.username ? (
					<View style={styles.aboveTextBoxItem}>
						<Pressable onPress={() => removeAction(EMessageActionType.Reply)}>
							<Feather size={25} name="x" style={styles.closeIcon} />
						</Pressable>
						<Text style={styles.aboveTextBoxText}>
							{t('chatBox.replyingTo')} {senderMessage?.user?.username}
						</Text>
					</View>
				): null}
				{currentSelectedEditMessage ? (
					<View style={styles.aboveTextBoxItem}>
						<Pressable onPress={() => removeAction(EMessageActionType.EditMessage)}>
							<Feather size={25} name='x' style={styles.closeIcon} />
						</Pressable>
						<Text style={styles.aboveTextBoxText}>{t('chatBox.editingMessage')}</Text>
					</View>
				): null}
			</View>
      <Suggestions suggestions={listMentions} {...triggers.mention} />
        <HashtagSuggestions listChannelsMention={listChannelsMention} {...triggers.hashtag} />
			<View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10}}>
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
            ref={textInput}
						autoFocus={isFocus}
						placeholder={'Write your thoughts here...'}
						placeholderTextColor={Colors.textGray}
						blurOnSubmit={false}
						onSubmitEditing={handleSendMessage}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
            {...textInputProps}
						style={[
							styles.inputStyle,
							text.length > 0 && { width: inputWidthWhenHasInput },
							{ backgroundColor: Colors.tertiaryWeight, color: Colors.tertiary },
						]}
					>
            {renderTextContent(text)}
          </TextInput>
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
