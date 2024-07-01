import {
	appActions,
	clansActions,
	directActions,
	friendsActions,
	getStoreAsync,
	notificationActions,
	selectAllClans,
	selectCurrentClan,
	selectSession,
} from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { gifsActions } from 'libs/store/src/lib/giftStickerEmojiPanel/gifs.slice';
import React, { useEffect } from 'react';
import { AppState, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BarsLogo from '../../../assets/svg/bars.svg';
import SearchLogo from '../../../assets/svg/discoverySearch.svg';
import HashSignIcon from '../../../assets/svg/loading.svg';
import UsersLogo from '../../../assets/svg/users.svg';
import LeftDrawerContent from './homedrawer/DrawerContent';
import HomeDefault from './homedrawer/HomeDefault';
import { styles } from './styles';

const Drawer = createDrawerNavigator();

const DrawerScreen = React.memo(({ navigation }: { navigation: any }) => {
	const dispatch = useDispatch();
	return (
		<Drawer.Navigator
			screenOptions={{
				drawerPosition: 'left',
				drawerType: 'back',
				drawerStyle: {
					width: '85%',
				},
			}}
			screenListeners={{
				state: (e) => {
					if (e.data.state.history?.length > 1) {
						dispatch(appActions.setHiddenBottomTabMobile(false));
					} else {
						dispatch(appActions.setHiddenBottomTabMobile(true));
					}
				},
			}}
			drawerContent={(props) => <LeftDrawerContent dProps={props} />}
		>
			<Drawer.Screen
				name="HomeDefault"
				component={HomeDefault}
				options={{
					headerTitleAlign: 'left',
					headerStyle: {
						backgroundColor: 'grey',
					},
					headerShown: false,
					headerLeft(vals) {
						return (
							<View style={styles.drawerHeaderLeft} {...vals} onTouchEnd={() => navigation.openDrawer()}>
								<BarsLogo width={20} height={20} />
							</View>
						);
					},
					headerTitle(props) {
						return (
							<View style={styles.drawerHeaderTitle}>
								<HashSignIcon width={18} height={18} />
								<Text style={styles.drawerHeaderTitleTxt}>welcome-and-rules</Text>
							</View>
						);
					},
					headerRight(props) {
						return (
							<View style={styles.drawerHeaderRight}>
								<SearchLogo width={22} height={22} />
								<UsersLogo width={22} height={22} />
							</View>
						);
					},
				}}
			/>
		</Drawer.Navigator>
	);
});

const HomeScreen = React.memo((props: any) => {
	const currentClan = useSelector(selectCurrentClan);
	const clans = useSelector(selectAllClans);
	const session = useSelector(selectSession);
	const { reconnect } = useMezon();

	useEffect(() => {
		if (clans?.length && !currentClan) {
			setCurrentClanLoader();
		}
	}, [clans, currentClan]);

	useEffect(() => {
		const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

		return () => {
			appStateSubscription.remove();
		};
	}, [currentClan]);

	useEffect(() => {
		mainLoader();
	}, [session?.token]);

	const handleAppStateChange = async (state: string) => {
		if (state === 'active') {
			const store = await getStoreAsync();

			store.dispatch(appActions.setLoadingMainMobile(true));
			await reconnect();
			await mainLoader();
			store.dispatch(appActions.setLoadingMainMobile(false));
		}
	};

	const mainLoader = async () => {
		const store = await getStoreAsync();
		store.dispatch(notificationActions.fetchListNotification());
		store.dispatch(friendsActions.fetchListFriends({}));
		store.dispatch(directActions.fetchDirectMessage({}));
		store.dispatch(clansActions.fetchClans());
		store.dispatch(gifsActions.fetchGifCategories());
		store.dispatch(gifsActions.fetchGifCategoryFeatured());
		if (currentClan) {
			store.dispatch(clansActions.joinClan({ clanId: '0' }));
			store.dispatch(clansActions.joinClan({ clanId: currentClan?.clan_id }));
			store.dispatch(clansActions.changeCurrentClan({ clanId: currentClan?.clan_id }));
		}
		return null;
	};

	const setCurrentClanLoader = async () => {
		const lastClanId = clans?.[clans?.length - 1]?.clan_id;
		const store = await getStoreAsync();
		if (lastClanId) {
			store.dispatch(clansActions.joinClan({ clanId: lastClanId }));
			store.dispatch(clansActions.changeCurrentClan({ clanId: lastClanId }));
		}
		return null;
	};

	return <DrawerScreen navigation={props.navigation} />;
});

export default HomeScreen;
