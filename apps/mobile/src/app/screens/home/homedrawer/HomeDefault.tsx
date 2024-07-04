import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ActionEmitEvent, ArrowLeftIcon, HashSignLockIcon, MuteIcon, ThreadIcon, UnMuteIcon, getChannelById } from '@mezon/mobile-components';
import { Block, Colors } from '@mezon/mobile-ui';
import {
	ChannelsEntity,
	ClansEntity,
	UsersClanEntity,
	channelMembersActions,
	selectAllAccount,
	selectAllUsesClan,
	selectChannelsEntities,
	selectCurrentChannel,
	selectCurrentClan,
	useAppDispatch,
} from '@mezon/store-mobile';
import { ChannelStatusEnum } from '@mezon/utils';
import { useFocusEffect } from '@react-navigation/native';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, Keyboard, PanResponder, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import HashSignIcon from '../../../../assets/svg/channelText-white.svg';
import NotificationSetting from '../../../components/NotificationSetting';
import useStatusMuteChannel, { EActionMute } from '../../../hooks/useStatusMuteChannel';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import ChannelMessages from './ChannelMessages';
import ChatBox from './ChatBox';
import AttachmentPicker from './components/AttachmentPicker';
import BottomKeyboardPicker, { IModeKeyboardPicker } from './components/BottomKeyboardPicker';
import EmojiPicker from './components/EmojiPicker';
import { styles } from './styles';
import { transformListUserMention } from '../../../utils/transformDataHelpers';
import { ApiAccount } from 'mezon-js/api.gen';
export const channelDetailContext = createContext<{currentClan: ClansEntity, usersClanMention: UsersClanEntity[], userProfile: ApiAccount | null | undefined}>(null);

const HomeDefault = React.memo((props: any) => {
	const currentChannel = useSelector(selectCurrentChannel);
	const [heightKeyboardShow, setHeightKeyboardShow] = useState<number>(0);
	const [typeKeyboardBottomSheet, setTypeKeyboardBottomSheet] = useState<IModeKeyboardPicker>('text');
	const bottomPickerRef = useRef<BottomSheet>(null);
	const [isFocusChannelView, setIsFocusChannelView] = useState(false);
	const usersClan = useSelector(selectAllUsesClan);
	const currentClan = useSelector(selectCurrentClan);
  const userProfile = useSelector(selectAllAccount);

	const dispatch = useAppDispatch();

	const prevChannelIdRef = useRef<string>();

	const onShowKeyboardBottomSheet = useCallback((isShow: boolean, height: number, type?: IModeKeyboardPicker) => {
		setHeightKeyboardShow(height);
		if (isShow) {
			setTypeKeyboardBottomSheet(type);
			bottomPickerRef.current?.collapse();
		} else {
			setTypeKeyboardBottomSheet('text');
			bottomPickerRef.current?.close();
		}
	}, []);

	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['15%', '40%'], []);
	const [isShowSettingNotifyBottomSheet, setIsShowSettingNotifyBottomSheet] = useState<boolean>(false);

	const openBottomSheet = () => {
		Keyboard.dismiss();
		bottomSheetRef.current?.snapToIndex(1);
		setIsShowSettingNotifyBottomSheet(!isShowSettingNotifyBottomSheet);
	};

	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
		setIsShowSettingNotifyBottomSheet(false);
	};
	const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} opacity={0.5} onPress={closeBottomSheet} appearsOnIndex={1} />, []);

	useFocusEffect(
		useCallback(() => {
			setIsFocusChannelView(true);
			if (prevChannelIdRef.current !== currentChannel?.channel_id) {
				fetchMemberChannel();
			}
			prevChannelIdRef.current = currentChannel?.channel_id;
			return () => {
				setIsFocusChannelView(false);
			};
		}, [currentChannel?.channel_id]),
	);

  const usersClanMention = useMemo(()=> transformListUserMention(usersClan), [usersClan])
	const fetchMemberChannel = async () => {
		if (!currentChannel) {
			return;
		}
		await dispatch(
			channelMembersActions.fetchChannelMembers({
				clanId: currentChannel?.clan_id || '',
				channelId: currentChannel?.channel_id || '',
				channelType: currentChannel?.type,
			}),
		);
	};

	const onOpenDrawer = () => {
		onShowKeyboardBottomSheet(false, 0, 'text');
		props.navigation.openDrawer();
		Keyboard.dismiss();
	};

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,

			onPanResponderRelease: (evt, gestureState) => {
				const { dx } = gestureState;

				if (dx > 50) {
					onOpenDrawer();
				}
			},
		}),
	).current;

	return (
		<View style={[styles.homeDefault]}>
			<HomeDefaultHeader
				openBottomSheet={openBottomSheet}
				navigation={props.navigation}
				currentChannel={currentChannel}
				onOpenDrawer={onOpenDrawer}
			/>
			{currentChannel && isFocusChannelView && (
				<View style={{ flex: 1, backgroundColor: Colors.tertiaryWeight }}>
				<channelDetailContext.Provider value={{
          usersClanMention,
          currentClan,
          userProfile
        }}>
					<View style={[styles.homeDefault]} {...panResponder.panHandlers}>
						<ChannelMessages
							channelId={currentChannel.channel_id}
							channelLabel={currentChannel?.channel_label}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
						/>
					</View>
        </channelDetailContext.Provider>
					{heightKeyboardShow !== 0 && typeKeyboardBottomSheet !== 'text' && (
						<Block position={'absolute'} flex={1} height={'100%'} width={'100%'}>
							<TouchableOpacity style={{ flex: 1 }} onPress={() => onShowKeyboardBottomSheet(false, 0, 'text')}></TouchableOpacity>
						</Block>
					)}

					<ChatBox
						channelId={currentChannel.channel_id}
						channelLabel={currentChannel?.channel_label || ''}
						mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
						onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
					/>

					<View
						style={{
							height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 0,
							backgroundColor: Colors.secondary,
						}}
					/>
					{heightKeyboardShow !== 0 && typeKeyboardBottomSheet !== 'text' && (
						<BottomKeyboardPicker height={heightKeyboardShow} ref={bottomPickerRef} isStickyHeader={typeKeyboardBottomSheet === 'emoji'}>
							{typeKeyboardBottomSheet === 'emoji' ? (
								<EmojiPicker
									onDone={() => {
										onShowKeyboardBottomSheet(false, heightKeyboardShow, 'text');
										DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, {});
									}}
									bottomSheetRef={bottomPickerRef}
								/>
							) : typeKeyboardBottomSheet === 'attachment' ? (
								<AttachmentPicker currentChannelId={currentChannel.channel_id} currentClanId={currentChannel?.clan_id} />
							) : (
								<View />
							)}
						</BottomKeyboardPicker>
					)}
				</View>
			)}
			<BottomSheet
				ref={bottomSheetRef}
				enablePanDownToClose={true}
				backdropComponent={renderBackdrop}
				index={-1}
				snapPoints={snapPoints}
				backgroundStyle={{ backgroundColor: Colors.secondary }}
			>
				<BottomSheetView>{isShowSettingNotifyBottomSheet && <NotificationSetting />}</BottomSheetView>
			</BottomSheet>
		</View>
	);
});

const HomeDefaultHeader = React.memo(
	({
		navigation,
		currentChannel,
		openBottomSheet,
		onOpenDrawer,
	}: {
		navigation: any;
		currentChannel: ChannelsEntity;
		openBottomSheet: () => void;
		onOpenDrawer: () => void;
	}) => {
		const navigateMenuThreadDetail = () => {
			navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.BOTTOM_SHEET });
		};
		const channelsEntities = useSelector(selectChannelsEntities);
		const [channelOfThread, setChannelOfThread] = useState<ChannelsEntity>(null);
		const { statusMute } = useStatusMuteChannel();

		useEffect(() => {
			setChannelOfThread(getChannelById(currentChannel?.parrent_id, channelsEntities));
		}, [currentChannel, channelsEntities]);
		return (
			<View style={styles.homeDefaultHeader}>
				<TouchableOpacity style={{ flex: 1 }} onPress={navigateMenuThreadDetail}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity activeOpacity={0.8} style={styles.iconBar} onPress={onOpenDrawer}>
							<ArrowLeftIcon width={20} height={20} />
						</TouchableOpacity>
						{!!currentChannel?.channel_label && (
							<View style={styles.channelContainer}>
								{!!currentChannel?.channel_label && !!Number(currentChannel?.parrent_id) ? (
									<ThreadIcon width={20} height={20}></ThreadIcon>
								) : currentChannel?.channel_private === ChannelStatusEnum.isPrivate &&
								  currentChannel?.type === ChannelType.CHANNEL_TYPE_TEXT ? (
									<HashSignLockIcon width={20} height={20} color={Colors.white} />
								) : (
									<HashSignIcon width={18} height={18} />
								)}
								<View>
									<View style={styles.threadHeaderBox}>
										<Text style={styles.threadHeaderLabel} numberOfLines={1}>
											{currentChannel?.channel_label}
										</Text>
									</View>
									{channelOfThread?.channel_label && (
										<Text style={styles.channelHeaderLabel} numberOfLines={1}>
											{channelOfThread?.channel_label}
										</Text>
									)}
								</View>
							</View>
						)}
					</View>
				</TouchableOpacity>
				{!!currentChannel?.channel_label && (
					<TouchableOpacity onPress={() => openBottomSheet()}>
						{/* <SearchIcon width={22} height={22} style={{ marginRight: 20 }} /> */}
						{statusMute === EActionMute.Mute ? (
							<MuteIcon width={22} height={22} style={{ marginRight: 20 }} />
						) : (
							<UnMuteIcon width={22} height={22} style={{ marginRight: 20 }} />
						)}
					</TouchableOpacity>
				)}
			</View>
		);
	},
);

export default HomeDefault;
