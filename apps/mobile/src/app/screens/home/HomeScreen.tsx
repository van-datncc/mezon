import { STORAGE_IS_DISABLE_LOAD_BACKGROUND, load } from '@mezon/mobile-components';
import { Metrics } from '@mezon/mobile-ui';
import { appActions } from '@mezon/store-mobile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Keyboard, View } from 'react-native';
import { useDispatch } from 'react-redux';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import LeftDrawerContent from './homedrawer/DrawerContent';
import HomeDefault from './homedrawer/HomeDefault';
import HomeDefaultWrapper from './homedrawer/HomeDefaultWrapper';
import { styles } from './styles';

const Drawer = createDrawerNavigator();

const HomeScreen = React.memo(() => {
	const dispatch = useDispatch();
	const isTabletLandscape = useTabletLandscape();
	const navigation = useNavigation();
	const isDisableLoad = useMemo(() => load(STORAGE_IS_DISABLE_LOAD_BACKGROUND), []);
	const isFromFCM = useMemo(() => isDisableLoad?.toString() === 'true', [isDisableLoad]);

	if (isTabletLandscape) {
		return (
			<View style={styles.container}>
				<View style={styles.containerDrawerContent}>
					<LeftDrawerContent isTablet={true} />
				</View>
				<View style={styles.containerHomeDefault}>
					<HomeDefault navigation={navigation} />
				</View>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, position: 'relative' }}>
			<Drawer.Navigator
				defaultStatus={isFromFCM ? 'closed' : 'open'}
				screenOptions={{
					drawerPosition: 'left',
					drawerType: 'back',
					freezeOnBlur: true,
					swipeEdgeWidth: Metrics.screenWidth,
					swipeMinDistance: 5,
					drawerStyle: {
						width: '100%'
					}
				}}
				screenListeners={{
					state: (e) => {
						Keyboard.dismiss();
						if (e.data.state.history?.length > 1) {
							dispatch(appActions.setHiddenBottomTabMobile(!isFromFCM));
						} else {
							dispatch(appActions.setHiddenBottomTabMobile(isFromFCM));
						}
					}
				}}
				drawerContent={() => <LeftDrawerContent />}
			>
				<Drawer.Screen
					name={APP_SCREEN.HOME_DEFAULT}
					component={HomeDefaultWrapper}
					options={{
						drawerType: 'back',
						swipeEdgeWidth: Metrics.screenWidth,
						keyboardDismissMode: 'none',
						swipeMinDistance: 5,
						headerShown: false
					}}
				/>
			</Drawer.Navigator>
		</View>
	);
});

export default HomeScreen;
