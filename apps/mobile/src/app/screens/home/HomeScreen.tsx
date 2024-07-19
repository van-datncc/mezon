import { ActionEmitEvent, load, save, setCurrentClanLoader, STORAGE_CLAN_ID, STORAGE_IS_DISABLE_LOAD_BACKGROUND } from '@mezon/mobile-components';
import {
	appActions,
	clansActions,
	getStoreAsync,
	messagesActions,
	selectCurrentChannelId,
	selectCurrentClanId,
	selectIsFromFCMMobile,
} from '@mezon/store-mobile';
import { delay } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { AppState, DeviceEventEmitter, Dimensions } from 'react-native';
import { DrawerLayout, DrawerState } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckUpdatedVersion } from '../../hooks/useCheckUpdatedVersion';
import LeftDrawerContent from './homedrawer/DrawerContent';
import HomeDefault from './homedrawer/HomeDefault';

const HomeScreen = React.memo((props: any) => {
	const homeDrawerRef = useRef<DrawerLayout>(null);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentClanId = useSelector(selectCurrentClanId);
	const isFromFcmMobile = useSelector(selectIsFromFCMMobile);
	const dispatch = useDispatch();
	const timerRef = useRef<any>();
	useCheckUpdatedVersion();

	useEffect(() => {
		const appStateSubscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				timerRef.current = delay(handleAppStateChange, 1200, state);
			}
		});

		return () => {
			appStateSubscription.remove();
			timerRef?.current && clearTimeout(timerRef.current);
		};
	}, [currentChannelId, currentClanId, isFromFcmMobile]);

	const handleAppStateChange = async (state: string) => {
		const isFromFCM = await load(STORAGE_IS_DISABLE_LOAD_BACKGROUND);
		if (isFromFCM?.toString() === 'true' || isFromFcmMobile) {
			dispatch(appActions.setLoadingMainMobile(false));
			return;
		}
		if (state === 'active' && isFromFCM?.toString() !== 'true' && !isFromFcmMobile) {
			await messageLoaderBackground();
		}
	};

	const messageLoaderBackground = async () => {
		try {
			if (!currentChannelId || !currentClanId) {
				dispatch(appActions.setLoadingMainMobile(false));
				return null;
			}
			const store = await getStoreAsync();
			save(STORAGE_CLAN_ID, currentClanId);
			const clanResp = await store.dispatch(clansActions.fetchClans());
			await setCurrentClanLoader(clanResp.payload);
			await store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: currentChannelId, noCache: true }));
			dispatch(appActions.setLoadingMainMobile(false));
			return null;
		} catch (error) {
			alert('error messageLoaderBackground' + error.message);
			dispatch(appActions.setLoadingMainMobile(false));
			console.log('error messageLoaderBackground', error);
		}
	};

	useEffect(() => {
		dispatch(appActions.setHiddenBottomTabMobile(true));
	}, []);

	const onDrawerStateChanged = (newState: DrawerState, drawerWillShow: boolean) => {
		if (newState === 'Dragging') {
			dispatch(appActions.setHiddenBottomTabMobile(true));
			return;
		}

		if (newState === 'Settling') {
			dispatch(appActions.setHiddenBottomTabMobile(!drawerWillShow));
			return;
		}
	};

	useEffect(() => {
		const sendMessage = DeviceEventEmitter.addListener(ActionEmitEvent.HOME_DRAWER, ({ isShowDrawer }) => {
			if (isShowDrawer) {
				homeDrawerRef.current.openDrawer();
			} else {
				homeDrawerRef.current.closeDrawer();
			}
		});
		return () => {
			sendMessage.remove();
		};
	}, []);

	return (
		<DrawerLayout
			ref={homeDrawerRef}
			edgeWidth={Dimensions.get('window').width}
			drawerWidth={Dimensions.get('window').width}
			enableContextMenu
			drawerPosition={'left'}
			drawerType="back"
			overlayColor="transparent"
			enableTrackpadTwoFingerGesture
			keyboardDismissMode="on-drag"
			useNativeAnimations={true}
			onDrawerStateChanged={onDrawerStateChanged}
			renderNavigationView={() => <LeftDrawerContent />}
		>
			<HomeDefault {...props} />
		</DrawerLayout>
	);
});

export default HomeScreen;
