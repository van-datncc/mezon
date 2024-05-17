import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, DeviceEventEmitter } from 'react-native';
import BottomSheet from 'react-native-raw-bottom-sheet';
import { styles } from './styles';
import { useRef } from 'react';
import { useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { IMessageActionNeedToResolve, IReplyBottomSheet } from '../../types/message.interface';
import { EMessageActionType, EMessageBSToShow } from '../../enums';
import { useTranslation } from 'react-i18next';
import { getMessageActions } from '../../constants';
import { useAuth } from '@mezon/core';
import { useMemo } from 'react';

export const MessageItemBS = React.memo((props: IReplyBottomSheet) => {
    const { type, onClose, message } = props;
    const ref = useRef(null);
    const [content, setContent] = useState<React.ReactNode>(<View />);
    const { t } = useTranslation(['message']);
    const { userProfile } = useAuth();

    const handleActionEditMessage = () => {
        onClose();
        const payload: IMessageActionNeedToResolve = {
            type: EMessageActionType.EditMessage,
            targetMessage: message
        }
        //Note: trigger to ChatBox.tsx
        DeviceEventEmitter.emit('@SHOW_KEYBOARD', payload);
    }

    const handleActionReply = () => {
        onClose();
        const payload: IMessageActionNeedToResolve = {
            type: EMessageActionType.Reply,
            targetMessage: message
        }
        //Note: trigger to ChatBox.tsx
        DeviceEventEmitter.emit('@SHOW_KEYBOARD', payload);
    }

    const handleActionCreateThread = () => {
        console.log('CreateThread');
    }

    const handleActionCopyText = () => {
        console.log('CopyText');
    }

    const handleActionDeleteMessage = () => {
        console.log('DeleteMessage');
    }

    const handleActionPinMessage = () => {
        console.log('PinMessage');
    }

    const handleActionMarkUnRead = () => {
        console.log('MarkUnRead');
    }

    const handleActionMention = () => {
        console.log('Mention');
    }

    const handleActionCopyMessageLink = () => {
        console.log('CopyMessageLink');
    }

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
            case EMessageActionType.MarkUnRead:
                handleActionMarkUnRead();
                break;
            case EMessageActionType.Mention:
                handleActionMention();
                break;
            case EMessageActionType.CopyMessageLink:
                handleActionCopyMessageLink();
                break;
            default:
                break;
        }
    }

    const messageActionList = useMemo(() => {
        const isMyMessage = userProfile?.user?.id === message?.user?.id;
        if (!isMyMessage) {
            return getMessageActions(t).filter(action => action.type !== EMessageActionType.EditMessage);
        }
        return getMessageActions(t);
    }, [t, userProfile, message])

    const renderUserInformation = () => {
        return (
            <View>
                <Text>user information</Text>
            </View>
        )
    }

    const renderMessageItemActions = () => {
        return (
            <View style={styles.messageActionsWrapper}>
                <FlatList
                    data={messageActionList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable style={styles.actionItem} onPress={() => implementAction(item.type)}>
                            <Feather size={25} name={item.icon} style={styles.actionIcon} />
                            <Text style={styles.actionText}>{item.title}</Text>
                        </Pressable>
                    )}
                />
            </View>
        )
    }

    const setVisibleBottomSheet = (isShow: boolean) => {
        if (ref) {
            if (isShow) {
                ref.current.open();
            } else {
                ref.current.close();
            }
        }
    }

    useEffect(() => {
        switch (type) {
            case EMessageBSToShow.MessageAction:
                setVisibleBottomSheet(true);
                setContent(renderMessageItemActions());
                break;
            case EMessageBSToShow.UserInformation:
                setVisibleBottomSheet(true);
                setContent(renderUserInformation());
                break;
            default:
                setVisibleBottomSheet(false);
                setContent(<View />);
        }
    }, [type])

    return (
        <BottomSheet
            ref={ref}
            height={500}
            onClose={() => onClose()}
            draggable
            dragOnContent
            customStyles={{
            container: {
                backgroundColor: 'transparent'
            }
        }}>
            <View style={styles.bottomSheetWrapper}>
                {content}
            </View>
        </BottomSheet>
    )
})
