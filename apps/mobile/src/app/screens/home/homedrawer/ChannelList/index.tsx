import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth, useCategory } from '@mezon/core';
import {
	Icons,
	STORAGE_KEY_CLAN_CURRENT_CACHE,
	getInfoChannelByClanId,
	getUpdateOrAddClanChannelCache,
	load,
	save,
} from '@mezon/mobile-components';
import { Colors, size, useAnimatedState, useTheme } from '@mezon/mobile-ui';
import {
	RootState,
	appActions,
	categoriesActions,
	channelsActions,
	getStoreAsync,
	messagesActions,
	selectAllEventManagement,
	selectCategoryIdSortChannel,
	selectCurrentClan,
	selectIsFromFCMMobile,
	useAppDispatch,
} from '@mezon/store-mobile';
import { ICategoryChannel, IChannel } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import EventViewer from '../../../../components/Event';
import ChannelListSkeleton from '../../../../components/Skeletons/ChannelListSkeleton';
import { APP_SCREEN, AppStackScreenProps } from '../../../../navigation/ScreenTypes';
import { MezonBottomSheet, MezonSearch } from '../../../../temp-ui';
import { ChannelListContext, ChannelListSection } from '../Reusables';
import { InviteToChannel } from '../components';
import CategoryMenu from '../components/CategoryMenu';
import ChannelListHeader from '../components/ChannelList/ChannelListHeader';
import ChannelMenu from '../components/ChannelMenu';
import ClanMenu from '../components/ClanMenu/ClanMenu';
import { style } from './styles';

const ChannelList = React.memo((props: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue)
	const currentClan = useSelector(selectCurrentClan);
	const isFromFCMMobile = useSelector(selectIsFromFCMMobile);
	const { categorizedChannels } = useCategory();
	const isLoading = useSelector((state: RootState) => state?.channels?.loadingStatus);

	const allEventManagement = useSelector(selectAllEventManagement);
	const bottomSheetMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetCategoryMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetChannelMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetEventRef = useRef<BottomSheetModal>(null);
	const bottomSheetInviteRef = useRef(null);
	const [isUnknownChannel, setIsUnKnownChannel] = useState<boolean>(false);

	const [currentPressedCategory, setCurrentPressedCategory] = useState<ICategoryChannel>(null);
	const [currentPressedChannel, setCurrentPressedChannel] = useState<IChannel>(null);
	const user = useAuth();
	const navigation = useNavigation<AppStackScreenProps['navigation']>();
	const dispatch = useAppDispatch();
	const categoryIdSortChannel = useSelector(selectCategoryIdSortChannel);

	useEffect(() => {
		if (categorizedChannels?.length && !isFromFCMMobile) {
			setDefaultChannelLoader();
		}
	}, [categorizedChannels]);

	const [collapseChannelItems, setCollapseChannelItems] = useAnimatedState([]);

	const toggleCollapseChannel = (index: string) => {
		if (collapseChannelItems.includes(index)) {
			setCollapseChannelItems(collapseChannelItems.filter((item) => item !== index)); // Collapse if already Collapse
		} else {
			setCollapseChannelItems([...collapseChannelItems, index]); // Expand if not Collapse
		}
	};

	const setDefaultChannelLoader = async () => {
		const firstChannel = categorizedChannels?.[0]?.channels?.[0];

		if (categorizedChannels && !!firstChannel) {
			const data = load(STORAGE_KEY_CLAN_CURRENT_CACHE);
			const infoChannelCache = getInfoChannelByClanId(data || [], currentClan?.clan_id);
			if (infoChannelCache) {
				await jumpToChannel(infoChannelCache.channelId, infoChannelCache.clanId);
			} else {
				const channelId = firstChannel?.channel_id;
				const clanId = currentClan?.clan_id;
				const dataSave = getUpdateOrAddClanChannelCache(currentClan?.clan_id, firstChannel?.channel_id);
				save(STORAGE_KEY_CLAN_CURRENT_CACHE, dataSave);
				await jumpToChannel(channelId, clanId);
			}
		}
	};

	const jumpToChannel = async (channelId: string, clanId: string) => {
		const store = await getStoreAsync();
		store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: channelId }));
		store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
		store.dispatch(appActions.setLoadingMainMobile(false));
	};

	function handlePress() {
		bottomSheetMenuRef.current?.present();
	}

	function handleLongPressCategory(category: ICategoryChannel) {
		bottomSheetCategoryMenuRef.current?.present();
		setCurrentPressedCategory(category);
	}

	function handleLongPressChannel(channel: IChannel) {
		bottomSheetChannelMenuRef.current?.present();
		setCurrentPressedChannel(channel);
		setIsUnKnownChannel(!channel?.channel_id);
	}

	function handleOnPressSortChannel(channel: IChannel) {
		dispatch(
			categoriesActions.setCategoryIdSortChannel({
				isSortChannelByCategoryId: !categoryIdSortChannel[channel?.category_id],
				categoryId: channel?.category_id,
			}),
		);
	}

	function handlePressEventCreate() {
		bottomSheetEventRef?.current?.dismiss();
		navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_EVENT });
	}

	return (
		<ChannelListContext.Provider value={{ navigation: props.navigation }}>
			<View style={styles.mainList}>
				<ChannelListHeader onPress={handlePress} clan={currentClan} />

				<View style={styles.channelListSearch}>
					<MezonSearch hasBackground />
					<Pressable
						style={styles.inviteIconWrapper}
						onPress={() => {
							setIsUnKnownChannel(false);
							bottomSheetInviteRef.current.open();
						}}
					>
						<Icons.UserPlusIcon height={18} width={18} color={themeValue.text} />
					</Pressable>
					<InviteToChannel isUnknownChannel={isUnknownChannel} ref={bottomSheetInviteRef} />
				</View>

				<View style={{ paddingHorizontal: size.s_12, marginBottom: size.s_18 }}>
					<TouchableOpacity
						style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
						onPress={() => bottomSheetEventRef?.current?.present()}
					>
						<Icons.CalendarIcon height={20} width={20} color={themeValue.text} />
						<Text style={{ color: themeValue.textStrong }}>{`${allEventManagement?.length} Events`}</Text>
					</TouchableOpacity>
				</View>
				{isLoading === 'loading' ? (
					<ChannelListSkeleton numberSkeleton={6} />
				) : (
					<FlatList
						data={categorizedChannels || []}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item, index }) => (
							<ChannelListSection
								data={item}
								index={index}
								onPressHeader={toggleCollapseChannel}
								onLongPressCategory={(category) => handleLongPressCategory(category)}
								onLongPressChannel={(channel) => handleLongPressChannel(channel)}
								onPressSortChannel={(channel) => handleOnPressSortChannel(channel)}
								collapseItems={collapseChannelItems}
							/>
						)}
					/>
				)}
			</View>

			<MezonBottomSheet ref={bottomSheetMenuRef}>
				<ClanMenu clan={currentClan} inviteRef={bottomSheetInviteRef} />
			</MezonBottomSheet>

			<MezonBottomSheet ref={bottomSheetCategoryMenuRef} heightFitContent>
				<CategoryMenu inviteRef={bottomSheetInviteRef} category={currentPressedCategory} />
			</MezonBottomSheet>

			<MezonBottomSheet ref={bottomSheetChannelMenuRef} heightFitContent>
				<ChannelMenu inviteRef={bottomSheetInviteRef} channel={currentPressedChannel} />
			</MezonBottomSheet>

			<MezonBottomSheet
				title={`${allEventManagement?.length} Events`}
				ref={bottomSheetEventRef}
				headerRight={
					currentClan?.creator_id === user?.userId && (
						<TouchableOpacity onPress={handlePressEventCreate}>
							<Text style={{ color: 'white' }}>Create</Text>
						</TouchableOpacity>
					)
				}
			>
				<EventViewer />
			</MezonBottomSheet>
		</ChannelListContext.Provider>
	);
});

export default ChannelList;
