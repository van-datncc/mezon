import { useAuth, useCategory, useEventManagement } from '@mezon/core';
import { AngleRightIcon, STORAGE_KEY_CHANNEL_ID, STORAGE_KEY_CLAN_ID, load, save } from '@mezon/mobile-components';
import { Colors, useAnimatedState } from '@mezon/mobile-ui';
import {
	appActions,
	channelsActions,
	getStoreAsync,
	messagesActions,
	selectCurrentClan,
	selectIsFromFCMMobile
} from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import Dots from '../../../../assets/svg/guildMoreOptions1.svg';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { ChannelListContext, ChannelListSection } from './Reusables';
import { InviteToChannel } from './components';
import { styles } from './styles';
import BottomSheet2 from '../../../components/BottomSheet2';
import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ChannelListHeader from './components/ChannelList/ChannelListHeader';
import ClanMenu from './components/ClanMenu/ClanMenu';
import EventViewer from '../../../components/Event';

const ChannelList = React.memo((props: any) => {
	const currentClan = useSelector(selectCurrentClan);
	const isFromFCMMobile = useSelector(selectIsFromFCMMobile);
	const { categorizedChannels } = useCategory();
	const { allEventManagement } = useEventManagement();
	const bottomSheetMenuRef = useRef<BottomSheetModal>(null);
	const bottomSheetEventRef = useRef<BottomSheetModal>(null);
	const bottomSheetInviteRef = useRef(null);
	const user = useAuth();


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
			const channelIdCache = load(STORAGE_KEY_CHANNEL_ID);
			const clanIdCache = load(STORAGE_KEY_CLAN_ID);
			if (channelIdCache && clanIdCache && clanIdCache === currentClan?.clan_id) {
				await jumpToChannel(channelIdCache, clanIdCache);
			} else {
				const channelId = firstChannel?.channel_id;
				const clanId = firstChannel?.clan_id;
				save(STORAGE_KEY_CHANNEL_ID, channelId);
				save(STORAGE_KEY_CLAN_ID, clanId);
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
		// @ts-ignore
		// navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_CATEGORY });
	}

	return (
		<ChannelListContext.Provider value={{ navigation: props.navigation }}>
			<View style={[styles.mainList, { backgroundColor: Colors.surface }]}>
				<ChannelListHeader onPress={handlePress} clan={currentClan} />
				<View style={styles.channelListSearch}>
					<View style={styles.channelListSearchWrapperInput}>
						<Feather size={18} name="search" style={{ color: Colors.tertiary }} />
						<TextInput placeholder={'Search'} placeholderTextColor={Colors.tertiary} style={styles.channelListSearchInput} />
					</View>
					<InviteToChannel ref={bottomSheetInviteRef} />
				</View>
				<View>
					<View>
						<TouchableOpacity onPress={() => bottomSheetEventRef?.current?.present()}>
							<Text style={{ color: "white" }}>{`${allEventManagement.length} Events`}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<FlatList
					data={categorizedChannels || []}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ item, index }) => (
						<ChannelListSection data={item} index={index} onPressHeader={toggleCollapseChannel} collapseItems={collapseChannelItems} />
					)}
				/>
			</View>

			<BottomSheet2 ref={bottomSheetMenuRef} >
				<ClanMenu
					clan={currentClan}
					bottomSheetRef={bottomSheetMenuRef}
					inviteRef={bottomSheetInviteRef}
				/>
			</BottomSheet2>

			<BottomSheet2
				title={`${allEventManagement.length} Events`}
				headerRight={currentClan.creator_id === user.userId && <Text style={{ color: "white" }}>Create</Text>}
				ref={bottomSheetEventRef}>
				<EventViewer />
			</BottomSheet2>
		</ChannelListContext.Provider >
	);
});

export default ChannelList;
