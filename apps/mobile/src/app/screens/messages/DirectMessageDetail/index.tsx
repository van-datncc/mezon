import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
import { styles } from './styles';
import { Colors } from '@mezon/mobile-ui';
import { ArrowLeftIcon, ChevronIcon, UserGroupIcon } from '@mezon/mobile-components';
import { useMemberStatus } from '@mezon/core';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { ChannelStreamMode } from 'mezon-js';
import ChatBox from '../../home/homedrawer/ChatBox';
import { useSelector } from 'react-redux';
import { directActions, getStoreAsync, selectDmGroupCurrent } from '@mezon/store-mobile';
import { IModeKeyboardPicker } from '../../home/homedrawer/components';
import BottomSheet from '@gorhom/bottom-sheet';
import BottomKeyboardPicker from '../../home/homedrawer/components/BottomKeyboardPicker';
import EmojiPicker from '../../home/homedrawer/components/EmojiPicker';
import AttachmentPicker from '../../home/homedrawer/components/AttachmentPicker';
import { IChannel } from '@mezon/utils';
import ChannelMessages from '../../home/homedrawer/ChannelMessages';

export const DirectMessageDetailScreen = ({navigation, route}: {navigation: any, route: any}) => {
    const directMessage = route.params?.directMessage as IChannel;
    const [heightKeyboardShow, setHeightKeyboardShow] = useState<number>(0);
	const [typeKeyboardBottomSheet, setTypeKeyboardBottomSheet] = useState<IModeKeyboardPicker>('text');
	const bottomPickerRef = useRef<BottomSheet>(null);
    const currentDmGroup = useSelector(selectDmGroupCurrent(directMessage.id ?? ''));

	const onShowKeyboardBottomSheet = (isShow: boolean, height: number, type?: IModeKeyboardPicker) => {
		setHeightKeyboardShow(height);
		if (isShow) {
			setTypeKeyboardBottomSheet(type);
			bottomPickerRef && bottomPickerRef.current && bottomPickerRef.current.collapse();
		} else {
			setTypeKeyboardBottomSheet('text');
			bottomPickerRef && bottomPickerRef.current && bottomPickerRef.current.close();
		}
	};
    const userStatus = useMemberStatus(directMessage?.user_id?.length === 1 ? directMessage?.user_id[0] : '');

    const navigateToThreadDetail = () => {
        navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.BOTTOM_SHEET, params: { directMessage } });
    }
  
    useEffect(() => {
        if (directMessage.id) {
            directMessageLoader()
        }
    }, [directMessage])

    const directMessageLoader = async () => {
        const store = await getStoreAsync();
        store.dispatch(
            directActions.joinDirectMessage({
                directMessageId: directMessage.id,
                channelName: directMessage.channel_label,
                type: directMessage.type,
            }),
        );
    
        return null;
    };
    return (
        <View style={styles.dmMessageContainer}>
            <View style={styles.headerWrapper}>
                <Pressable onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon color={Colors.textGray} />
                </Pressable>
                <Pressable style={styles.channelTitle} onPress={() => navigateToThreadDetail()}>
                    {directMessage?.channel_avatar?.length > 1 ? (
                        <View style={styles.groupAvatar}>
                            <UserGroupIcon width={15} height={15} />
                        </View>
                    ): (
                        <View>
                            <Image source={{ uri: directMessage.channel_avatar[0] }} style={styles.friendAvatar} />
                            <View style={[styles.statusCircle, userStatus ? styles.online : styles.offline]} />
                        </View>
                    )}
                    <Text style={styles.titleText} numberOfLines={1}>{directMessage?.channel_label}</Text>
                    <ChevronIcon width={10} height={10} />
                </Pressable>
                <View style={styles.actions}>
                    {/* TODO: update later */}
                    {/* <CallIcon />
                    <VideoIcon /> */}
                </View>
            </View>

            {directMessage?.id ? (
				<View style={styles.content}>
					<ChannelMessages
						channelId={directMessage.id}
						type={currentDmGroup?.user_id?.length === 1 ? 'DM' : 'GROUP'}
						channelLabel={directMessage?.channel_label}
						mode={Number(currentDmGroup?.user_id?.length === 1 ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP)}
					/>
					<ChatBox
						channelId={directMessage.id}
						channelLabel={currentDmGroup?.channel_label || ''}
						mode={Number(currentDmGroup?.user_id?.length === 1 ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP)}
						onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
					/>
					<View
						style={{
							height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 0,
							backgroundColor: Colors.secondary,
						}}
					/>
					{heightKeyboardShow !== 0 && typeKeyboardBottomSheet !== 'text' && (
						<BottomKeyboardPicker height={heightKeyboardShow} ref={bottomPickerRef}>
							{typeKeyboardBottomSheet === 'emoji' ? (
								<EmojiPicker
									onDone={() => onShowKeyboardBottomSheet(false, heightKeyboardShow, typeKeyboardBottomSheet)}
									bottomSheetRef={bottomPickerRef}
								/>
							) : typeKeyboardBottomSheet === 'attachment' ? (
								<AttachmentPicker currentChannelId={directMessage.id} currentClanId={directMessage.clan_id} />
							) : (
								<View />
							)}
						</BottomKeyboardPicker>
					)}
				</View>
			): null}
           
        </View>

        
    )
}