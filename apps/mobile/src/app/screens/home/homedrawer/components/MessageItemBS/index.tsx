import { useAuth, useChatReaction } from '@mezon/core';
import {
	ActionEmitEvent,
	CopyIcon,
	FaceIcon,
	FlagIcon,
	LinkIcon,
	MarkUnreadIcon,
	MentionIcon,
	PenIcon,
	PinMessageIcon,
	ReplyMessageIcon,
	ThreadIcon,
	TrashIcon,
} from '@mezon/mobile-components';
import { Colors, size, useAnimatedState } from '@mezon/mobile-ui';
import { selectPinMessageByChannelId } from '@mezon/store-mobile';
import Clipboard from '@react-native-clipboard/clipboard';
import { ChannelStreamMode } from 'mezon-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, DeviceEventEmitter, Platform, Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { getMessageActions } from '../../constants';
import { EMessageActionType, EMessageBSToShow } from '../../enums';
import { IMessageAction, IMessageActionNeedToResolve, IReplyBottomSheet } from '../../types/message.interface';
import EmojiSelector from '../EmojiPicker/EmojiSelector';
import UserProfile from '../UserProfile';
import { emojiFakeData } from '../fakeData';
import { styles } from './styles';
import { MezonBottomSheet } from '../../../../../../app/temp-ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export const MessageItemBS = React.memo((props: IReplyBottomSheet) => {
	const { type, onClose, onConfirmAction, message, mode, isOnlyEmojiPicker = false, user, checkAnonymous, senderDisplayName = '' } = props;
	const timeoutRef = useRef(null);
	const [content, setContent] = useState<React.ReactNode>(<View />);
	const { t } = useTranslation(['message']);
	const { userProfile } = useAuth();
	const { reactionMessageDispatch } = useChatReaction();
	const [isShowEmojiPicker, setIsShowEmojiPicker] = useAnimatedState(false);
	const handleActionEditMessage = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.EditMessage,
			targetMessage: message,
		};
		//Note: trigger to ChatBox.tsx
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};
	const listPinMessages = useSelector(selectPinMessageByChannelId(message?.channel_id));
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const isDM = useMemo(() => {
		return [ChannelStreamMode.STREAM_MODE_DM, ChannelStreamMode.STREAM_MODE_GROUP].includes(mode);
	}, [mode]);

	const handleActionReply = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.Reply,
			targetMessage: message,
			replyTo: senderDisplayName,
		};
		//Note: trigger to ChatBox.tsx
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};

	const handleActionCreateThread = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.CreateThread,
			targetMessage: message,
		};
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};

	const handleActionCopyText = () => {
		onClose();
		Clipboard.setString(message.content.t);
		Toast.show({
			type: 'success',
			props: {
				text2: t('toast.copyText'),
				leadingIcon: <CopyIcon color={Colors.bgGrayLight} />,
			},
		});
	};

	const handleActionDeleteMessage = () => {
		onClose();
		Alert.alert(
			'Delete Message',
			'Are you sure you want to delete this message?',
			[
				{
					text: 'No',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{
					text: 'Yes',
					onPress: () =>
						onConfirmAction({
							type: EMessageActionType.DeleteMessage,
							message,
						}),
				},
			],
			{ cancelable: false },
		);
	};

	const handleActionPinMessage = () => {
		if (message) onClose();
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.PinMessage,
				});
			},
			500
		);
	};

	const handleActionUnPinMessage = () => {
		if (message) onClose();
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.UnPinMessage,
				});
			},
			500
		);
	};

	const handleActionMarkUnRead = () => {
		console.log('MarkUnRead');
	};

	const handleActionMention = () => {
		onClose();
		const payload: IMessageActionNeedToResolve = {
			type: EMessageActionType.Mention,
			targetMessage: message,
		};
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, payload);
	};

	const handleActionCopyMessageLink = () => {
		console.log('CopyMessageLink');
	};

	const handleActionReportMessage = () => {
		onClose();
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.Report,
				});
			},
			Platform.OS === 'ios' ? 500 : 0,
		);
	};

	const handleForwardMessage = () => {
		onClose();
		timeoutRef.current = setTimeout(
			() => {
				onConfirmAction({
					type: EMessageActionType.ForwardMessage,
					message,
				});
			},
			Platform.OS === 'ios' ? 500 : 0,
		);
	};

	const implementAction = (type: EMessageActionType) => {
		switch (type) {
			case EMessageActionType.EditMessage:
				handleActionEditMessage();
				break;
			case EMessageActionType.Reply:
				handleActionReply();
				break;
			case EMessageActionType.CreateThread:
				handleActionCreateThread();
				break;
			case EMessageActionType.CopyText:
				handleActionCopyText();
				break;
			case EMessageActionType.DeleteMessage:
				handleActionDeleteMessage();
				break;
			case EMessageActionType.PinMessage:
				handleActionPinMessage();
				break;
			case EMessageActionType.UnPinMessage:
				handleActionUnPinMessage();
				break;
			case EMessageActionType.MarkUnRead:
				handleActionMarkUnRead();
				break;
			case EMessageActionType.Mention:
				handleActionMention();
				break;
			case EMessageActionType.CopyMessageLink:
				handleActionCopyMessageLink();
				break;
			case EMessageActionType.Report:
				handleActionReportMessage();
				break;
			case EMessageActionType.ForwardMessage:
				handleForwardMessage();
				break;
			default:
				break;
		}
	};

	const getActionMessageIcon = (type: EMessageActionType) => {
		switch (type) {
			case EMessageActionType.EditMessage:
				return <PenIcon />;
			case EMessageActionType.Reply:
				return <ReplyMessageIcon />;
			case EMessageActionType.ForwardMessage:
				return <ReplyMessageIcon style={{ transform: [{ scaleX: -1 }] }} />;
			case EMessageActionType.CreateThread:
				return <ThreadIcon width={20} height={20} />;
			case EMessageActionType.CopyText:
				return <CopyIcon />;
			case EMessageActionType.DeleteMessage:
				return <TrashIcon color={Colors.textRed} width={18} height={18} />;
			case EMessageActionType.PinMessage:
				return <PinMessageIcon />;
			case EMessageActionType.UnPinMessage:
				return <PinMessageIcon />;
			case EMessageActionType.MarkUnRead:
				return <MarkUnreadIcon />;
			case EMessageActionType.Mention:
				return <MentionIcon />;
			case EMessageActionType.CopyMessageLink:
				return <LinkIcon />;
			case EMessageActionType.Report:
				return <FlagIcon color={Colors.textRed} />;
			default:
				return <View />;
		}
	};

	const messageActionList = useMemo(() => {
		const isMyMessage = userProfile?.user?.id === message?.user?.id;
		const isUnPinMessage = listPinMessages.some((pinMessage) => pinMessage?.message_id === message?.id);

		const listOfActionOnlyMyMessage = [EMessageActionType.EditMessage,EMessageActionType.DeleteMessage];
		const listOfActionOnlyOtherMessage = [EMessageActionType.Report];

		const listOfActionShouldHide = [
			isUnPinMessage ? EMessageActionType.PinMessage : EMessageActionType.UnPinMessage,
			isDM && EMessageActionType.CreateThread
		];

		let availableMessageActions: IMessageAction[] = [];
		if (isMyMessage) {
			availableMessageActions = getMessageActions(t).filter((action) => ![...listOfActionOnlyOtherMessage,...listOfActionShouldHide].includes(action.type));
		} else {
			availableMessageActions = getMessageActions(t).filter((action) => ![...listOfActionOnlyMyMessage,...listOfActionShouldHide].includes(action.type));
		}

		const frequentActionList = [EMessageActionType.EditMessage, EMessageActionType.Reply, EMessageActionType.CreateThread];
		const warningActionList = [EMessageActionType.Report, EMessageActionType.DeleteMessage];

		return {
			frequent: availableMessageActions.filter((action) => frequentActionList.includes(action.type)),
			normal: availableMessageActions.filter((action) => ![...frequentActionList, ...warningActionList].includes(action.type)),
			warning: availableMessageActions.filter((action) => warningActionList.includes(action.type))
		}
	}, [t, userProfile, message, listPinMessages, isDM]);

	const renderUserInformation = () => {
		return <UserProfile userId={user?.id} message={message} checkAnonymous={checkAnonymous}></UserProfile>;
	};

	const handleReact = async (mode, messageId, emoji: string, senderId) => {
		await reactionMessageDispatch('', mode, message.channel_id ?? '', messageId ?? '', emoji?.trim(), 1, senderId ?? '', false);
		onClose();
	};

	const renderMessageItemActions = () => {
		return (
			<View style={styles.messageActionsWrapper}>
				<View style={styles.reactWrapper}>
					{emojiFakeData.map((item, index) => {
						return (
							<Pressable
								key={index}
								style={styles.favouriteIconItem}
								onPress={() => handleReact(mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL, message.id, item.shortname, userProfile.user.id)}
							>
								<FastImage
									source={{
										uri: item.src,
									}}
									resizeMode={'contain'}
									style={{
										width: size.s_28,
										height: size.s_28,
									}}
								/>
							</Pressable>
						);
					})}

					<Pressable onPress={() => setIsShowEmojiPicker(true)} style={{height: size.s_28, width: size.s_28,}}>
						<FaceIcon color={Colors.white} />
					</Pressable>
				</View>
				<View style={styles.messageActionGroup}>
					{messageActionList.frequent.map((action) => {
						return (
							<Pressable key={action.id} style={styles.actionItem} onPress={() => implementAction(action.type)}>
								<View style={styles.icon}>{getActionMessageIcon(action.type)}</View>
								<Text style={styles.actionText}>{action.title}</Text>
							</Pressable>
						)
					})}
				</View>
				<View style={styles.messageActionGroup}>
					{messageActionList.normal.map((action) => {
						return (
							<Pressable key={action.id} style={styles.actionItem} onPress={() => implementAction(action.type)}>
								<View style={styles.icon}>{getActionMessageIcon(action.type)}</View>
								<Text style={styles.actionText}>{action.title}</Text>
							</Pressable>
						)
					})}
				</View>
				<View style={styles.messageActionGroup}>
					{messageActionList.warning.map((action) => {
						return (
							<Pressable key={action.id} style={styles.actionItem} onPress={() => implementAction(action.type)}>
								<View style={styles.warningIcon}>{getActionMessageIcon(action.type)}</View>
								<Text style={styles.warningActionText}>{action.title}</Text>
							</Pressable>
						)
					})}
				</View>
			</View>
		);
	};

	const onSelectEmoji = async (emoij: string) => {
		await handleReact(mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL, message.id, emoij, userProfile.user.id);
	};

	const renderEmojiSelector = () => {
		return (
			<View style={{ padding: size.s_10 }}>
				<EmojiSelector onSelected={onSelectEmoji} isReactMessage />
			</View>
		);
	};

	const setVisibleBottomSheet = (isShow: boolean) => {
		if (bottomSheetRef) {
			if (isShow) {
				bottomSheetRef.current?.present();
			} else {
				bottomSheetRef.current?.close();
			}
		}
	};

	useEffect(() => {
		return () => {
			timeoutRef.current && clearTimeout(timeoutRef.current);
		};
	}, []);

	useEffect(() => {
		switch (type) {
			case EMessageBSToShow.MessageAction:
				setVisibleBottomSheet(true);
				if (isShowEmojiPicker || isOnlyEmojiPicker) {
					setContent(renderEmojiSelector());
				} else {
					setContent(renderMessageItemActions());
				}
				break;
			case EMessageBSToShow.UserInformation:
				setVisibleBottomSheet(true);
				setContent(renderUserInformation());
				break;
			default:
				setVisibleBottomSheet(false);
				setContent(<View />);
		}
	}, [type, isShowEmojiPicker, isOnlyEmojiPicker]);

	const snapPoints = useMemo(() => {
		if (isShowEmojiPicker || isOnlyEmojiPicker) {
			return ['90%']
		}
		if ([EMessageBSToShow.UserInformation].includes(type)) {
			return ['60%']
		}
		return ['50%']
	}, [isShowEmojiPicker, isOnlyEmojiPicker, type])

	return (
		<MezonBottomSheet
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			heightFitContent={true}
			onDismiss={() => {
				onClose();
				setIsShowEmojiPicker(false);
			}}
			style={styles.bottomSheet}
			handleComponent={() => {
                return (
					<View style={styles.bottomSheetBarWrapper}>
						<View style={styles.bottomSheetBar}/>
					</View>
                )
            }}
		>
			<View style={styles.bottomSheetWrapper}>{content}</View>
		</MezonBottomSheet>
	);
});
