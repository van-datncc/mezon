import { selectHiddenBottomTabMobile } from '@mezon/store';
import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerActions, useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { BackHandler, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';

function BackNativeListener() {
	const navigation = useNavigation<any>();
	const drawerStatus = useDrawerStatus();
	const isHiddenTab = useSelector(selectHiddenBottomTabMobile);

	const routesNavigation = useNavigationState((state) => state?.routes?.[state?.index]);

	const isHomeActive = useMemo(() => {
		if (routesNavigation?.state?.index === 0) {
			return true;
		}
		return routesNavigation?.name === APP_SCREEN.BOTTOM_BAR && !routesNavigation?.state?.index;
	}, [routesNavigation]);

	useEffect(() => {
		const backAction = () => {
			if (drawerStatus === 'closed') {
				navigation.dispatch(DrawerActions.openDrawer());
				return true;
			} else if (isHomeActive && !isHiddenTab) {
				alert('Press back again to exit');
				// BackHandler.exitApp();
			} else {
				// empty
			}
			return false;
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => {
			backHandler.remove();
		};
	}, [isHomeActive, drawerStatus, navigation, isHiddenTab]);

	return <View />;
}

export default React.memo(BackNativeListener);
