import { load, STORAGE_IS_DISABLE_LOAD_BACKGROUND } from '@mezon/mobile-components';
import { Metrics } from '@mezon/mobile-ui';
import { appActions, getStoreAsync, messagesActions, selectCurrentChannelId, selectIsFromFCMMobile } from '@mezon/store-mobile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { delay } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckUpdatedVersion } from '../../hooks/useCheckUpdatedVersion';
import LeftDrawerContent from './homedrawer/DrawerContent';
import HomeDefault from './homedrawer/HomeDefault';

const Drawer = createDrawerNavigator();

const DrawerScreen = React.memo(({ navigation }: { navigation: any }) => {
	const dispatch = useDispatch();
	return (
		<Drawer.Navigator
			screenOptions={{
				drawerPosition: 'left',
				drawerType: 'slide',
				swipeEdgeWidth: Metrics.screenWidth,
				swipeMinDistance: 5,
				drawerStyle: {
					width: '100%',
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
					drawerType: 'slide',
					swipeEdgeWidth: Metrics.screenWidth,
					keyboardDismissMode: 'none',
					swipeMinDistance: 5,
					headerShown: false,
				}}
			/>
		</Drawer.Navigator>
	);
});

const HomeScreen = React.memo((props: any) => {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const isFromFcmMobile = useSelector(selectIsFromFCMMobile);
	const dispatch = useDispatch();
	const timerRef = useRef<any>();

	useCheckUpdatedVersion();

	useEffect(() => {
		const appStateSubscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				timerRef.current = delay(handleAppStateChange, 200, state);
			}
		});

		return () => {
			appStateSubscription.remove();
			timerRef?.current && clearTimeout(timerRef.current);
		};
	}, [currentChannelId, isFromFcmMobile]);

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
			if (!currentChannelId) {
				dispatch(appActions.setLoadingMainMobile(false));
				return null;
			}
			const store = await getStoreAsync();
			dispatch(appActions.setLoadingMainMobile(false));
			await store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: currentChannelId, noCache: true }));
			return null;
		} catch (error) {
			console.log('error messageLoaderBackground', error);
		}
	};

	return <DrawerScreen navigation={props.navigation} />;
});

export default HomeScreen;
