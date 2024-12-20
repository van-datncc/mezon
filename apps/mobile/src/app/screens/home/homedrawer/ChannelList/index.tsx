import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
	ActionEmitEvent,
	getUpdateOrAddClanChannelCache,
	hasNonEmptyChannels,
	save,
	STORAGE_DATA_CLAN_CHANNEL_CACHE
} from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import {
	appActions,
	channelsActions,
	ChannelsEntity,
	getStoreAsync,
	RootState,
	selectAllEventManagement,
	selectCategoryChannelOffsets,
	selectCurrentChannel,
	selectCurrentClanId,
	useAppDispatch
} from '@mezon/store-mobile';
import { ChannelThreads, ICategoryChannel } from '@mezon/utils';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, InteractionManager, Linking, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import NotificationSetting from '../../../../../../../mobile/src/app/components/NotificationSetting';
import { EventViewer } from '../../../../components/Event';
import ChannelListSkeleton from '../../../../components/Skeletons/ChannelListSkeleton';
import { MezonBottomSheet } from '../../../../componentUI';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import { APP_SCREEN, AppStackScreenProps } from '../../../../navigation/ScreenTypes';
import { linkGoogleMeet } from '../../../../utils/helpers';
import { InviteToChannel } from '../components';
import CategoryMenu from '../components/CategoryMenu';
import ChannelListBackground from '../components/ChannelList/ChannelListBackground';
import { ChannelListFavorite } from '../components/ChannelList/ChannelListFavorite';
import ChannelListHeader from '../components/ChannelList/ChannelListHeader';
import { StatusVoiceChannel } from '../components/ChannelList/ChannelListItem';
import ChannelListSection from '../components/ChannelList/ChannelListSection';
import ChannelMenu from '../components/ChannelMenu';
import ClanMenu from '../components/ClanMenu/ClanMenu';
import { ChannelListContext } from '../Reusables';
import ButtonNewUnread from './ButtonNewUnread';
import { style } from './styles';
export type ChannelsPositionRef = {
	current: {
		[key: number]: {
			height: number;
			cateId?: string | number;
		};
	};
};
const TIMER_READY_ONLAYOUT = 10000;

const ChannelList = React.memo(({ categorizedChannels }: { categorizedChannels: any }) => {
	const { themeValue } = useTheme();
	const isTabletLandscape = useTabletLandscape();
	const styles = style(themeValue, isTabletLandscape);
	const isLoading = useSelector((state: RootState) => state?.channels?.loadingStatus);
	const allEventManagement = useSelector(selectAllEventManagement);
	const bottomSheetMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetCategoryMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetChannelMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetEventRef = useRef<BottomSheetModal>(null);
	const bottomSheetInviteRef = useRef(null);
	const bottomSheetNotifySettingRef = useRef<BottomSheetModal>(null);
	const [isUnknownChannel, setIsUnKnownChannel] = useState<boolean>(false);
	const [isCanLayout, setIsCanLayout] = useState<boolean>(true);
	const timerReadyOnLayout = useRef<any>();

	const [currentPressedCategory, setCurrentPressedCategory] = useState<ICategoryChannel>(null);
	const [currentPressedChannel, setCurrentPressedChannel] = useState<ChannelThreads | null>(null);
	const navigation = useNavigation<AppStackScreenProps['navigation']>();
	const flashListRef = useRef(null);
	const channelsPositionRef = useRef<ChannelsPositionRef>();
	const currentChannel = useSelector(selectCurrentChannel);
	const dispatch = useAppDispatch();
	const selectCategoryOffsets = useSelector(selectCategoryChannelOffsets);
	const [isScrollChannelActive, setIsScrollChannelActive] = useState(true);
	const currentClanId = useSelector(selectCurrentClanId);
	const handlePress = useCallback(() => {
		bottomSheetMenuRef.current?.present();
	}, []);

	const onOpenEvent = useCallback(() => {
		bottomSheetEventRef?.current?.present();
	}, []);

	const onOpenInvite = useCallback(() => {
		setIsUnKnownChannel(false);
		bottomSheetInviteRef?.current?.present?.();
	}, []);

	const handleLongPressCategory = useCallback((category: ICategoryChannel) => {
		bottomSheetCategoryMenuRef.current?.present();
		setCurrentPressedCategory(category);
	}, []);

	const handleLongPressChannel = useCallback(
		(channel: ChannelThreads) => {
			bottomSheetChannelMenuRef.current?.present();
			setCurrentPressedChannel(channel);
			setIsUnKnownChannel(!channel?.channel_id);
			dispatch(
				channelsActions.setSelectedChannelId({
					clanId: channel?.clan_id,
					channelId: channel?.channel_id
				})
			);
		},
		[dispatch]
	);

	const handleLongPressThread = useCallback((channel: ChannelThreads) => {
		bottomSheetChannelMenuRef.current?.present();
		setCurrentPressedChannel(channel);
	}, []);

	const handleCollapseCategory = useCallback(() => {
		setIsCanLayout(true);
		setIsScrollChannelActive(false);
		timerReadyOnLayout.current = setTimeout(async () => {
			setIsCanLayout(false);
		}, 2000);
	}, []);

	const handleScrollToChannel = useCallback(
		(currentChannelId: string, isActiveScroll?: boolean) => {
			const positionChannel = channelsPositionRef?.current?.[currentChannelId];
			const categoryOffset = selectCategoryOffsets?.[positionChannel?.cateId || ''];
			const position = (positionChannel?.height || 0) + (categoryOffset || 0);

			if (position && isActiveScroll) {
				flashListRef?.current?.scrollTo({
					x: 0,
					y: position - size.s_100 * 2,
					animated: true
				});
			}
		},
		[selectCategoryOffsets]
	);

	useEffect(() => {
		if (currentChannel?.channel_id) {
			DeviceEventEmitter.emit(ActionEmitEvent.CHANNEL_ID_ACTIVE, currentChannel?.channel_id);
		}
	}, [currentChannel?.channel_id]);

	useEffect(() => {
		timerReadyOnLayout.current = setTimeout(() => {
			setIsCanLayout(false);
		}, TIMER_READY_ONLAYOUT);
		const scrollChannel = DeviceEventEmitter.addListener(
			ActionEmitEvent.SCROLL_TO_ACTIVE_CHANNEL,
			({ isActiveScroll }: { isActiveScroll: boolean }) => {
				setIsScrollChannelActive(isActiveScroll);
			}
		);
		return () => {
			scrollChannel.remove();
		};
	}, []);

	useEffect(() => {
		handleScrollToChannel(currentChannel?.id, isScrollChannelActive);
	}, [currentChannel?.id, handleScrollToChannel, isScrollChannelActive]);

	useEffect(() => {
		setIsScrollChannelActive(true);
	}, [currentChannel?.id]);

	useEffect(() => {
		if (currentClanId && currentClanId?.toString() !== '0') {
			dispatch(channelsActions.fetchListFavoriteChannel({ clanId: currentClanId }));
		}
		setIsScrollChannelActive(true);
	}, [currentClanId, dispatch]);

	const handleLayout = useCallback(
		(event, item) => {
			if (item && isCanLayout) {
				const { y } = event?.nativeEvent?.layout || {};
				InteractionManager.runAfterInteractions(() => {
					dispatch(appActions.setCategoryChannelOffsets({ [item?.category_id]: Math.round(y) }));
				});
			}
		},
		[dispatch, isCanLayout]
	);

	const renderItemChannelList = useCallback(
		({ item }) => {
			return (
				<View onLayout={(e) => handleLayout(e, item)} key={item?.category_id}>
					<ChannelListSection
						channelsPositionRef={channelsPositionRef}
						data={item}
						onLongPressCategory={handleLongPressCategory}
						onLongPressChannel={handleLongPressChannel}
						onLongPressThread={handleLongPressThread}
						onPressCollapse={handleCollapseCategory}
					/>
				</View>
			);
		},
		[handleLongPressCategory, handleLongPressChannel, handleLongPressThread, handleCollapseCategory, handleLayout]
	);

	const handlePressEventCreate = useCallback(() => {
		bottomSheetEventRef?.current?.dismiss();
		navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, {
			screen: APP_SCREEN.MENU_CLAN.CREATE_EVENT,
			params: {
				onGoBack: () => {
					bottomSheetEventRef?.current?.present();
				}
			}
		});
	}, [navigation]);

	const handleScrollToChannelFavorite = useCallback(
		async (channel?: ChannelsEntity) => {
			if (currentChannel?.channel_id === channel?.channel_id) {
				navigation.dispatch(DrawerActions.closeDrawer());
				return;
			}
			if (channel?.type === ChannelType.CHANNEL_TYPE_VOICE) {
				if (channel?.status === StatusVoiceChannel.Active && channel?.meeting_code) {
					const urlVoice = `${linkGoogleMeet}${channel?.meeting_code}`;
					await Linking.openURL(urlVoice);
				}
			} else {
				if (!isTabletLandscape) {
					navigation.dispatch(DrawerActions.closeDrawer());
				}
				const channelId = channel?.channel_id || '';
				const clanId = channel?.clan_id || '';
				const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
				const store = await getStoreAsync();
				requestAnimationFrame(async () => {
					store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false, noCache: true }));
				});
				save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
			}
		},
		[currentChannel?.channel_id, isTabletLandscape, navigation]
	);

	return (
		<ChannelListContext.Provider value={{ navigation: navigation }}>
			<View style={styles.mainList}>
				<ScrollView
					stickyHeaderIndices={[1]}
					showsVerticalScrollIndicator={false}
					ref={flashListRef}
					scrollEventThrottle={16}
					removeClippedSubviews={false}
					nestedScrollEnabled={true}
					bounces={false}
				>
					<ChannelListBackground onPress={handlePress} />
					<ChannelListHeader onPress={handlePress} onOpenEvent={onOpenEvent} onOpenInvite={onOpenInvite} />
					<ChannelListFavorite onPress={handleScrollToChannelFavorite} onPressCollapse={handleCollapseCategory} />
					{isLoading === 'loading' && !hasNonEmptyChannels(categorizedChannels || []) && <ChannelListSkeleton numberSkeleton={6} />}
					{!!categorizedChannels?.length &&
						categorizedChannels?.map((item) => {
							return renderItemChannelList({ item });
						})}
					<Block height={80} />
				</ScrollView>

				<ButtonNewUnread handleScrollToChannel={handleScrollToChannel} />
			</View>

			<MezonBottomSheet ref={bottomSheetMenuRef}>
				<ClanMenu inviteRef={bottomSheetInviteRef} />
			</MezonBottomSheet>

			<MezonBottomSheet ref={bottomSheetCategoryMenuRef} heightFitContent>
				<CategoryMenu inviteRef={bottomSheetInviteRef} category={currentPressedCategory} />
			</MezonBottomSheet>

			<MezonBottomSheet ref={bottomSheetChannelMenuRef} heightFitContent>
				<ChannelMenu inviteRef={bottomSheetInviteRef} notifySettingRef={bottomSheetNotifySettingRef} channel={currentPressedChannel} />
			</MezonBottomSheet>

			<MezonBottomSheet ref={bottomSheetEventRef} heightFitContent={allEventManagement?.length === 0}>
				<EventViewer handlePressEventCreate={handlePressEventCreate} />
			</MezonBottomSheet>

			<MezonBottomSheet ref={bottomSheetNotifySettingRef} snapPoints={['50%']}>
				<NotificationSetting channel={currentPressedChannel} />
			</MezonBottomSheet>
			<InviteToChannel isUnknownChannel={isUnknownChannel} ref={bottomSheetInviteRef} />
		</ChannelListContext.Provider>
	);
});

export default ChannelList;
