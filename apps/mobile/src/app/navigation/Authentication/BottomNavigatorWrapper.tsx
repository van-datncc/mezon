import { load, save, STORAGE_IS_LAST_ACTIVE_TAB_DM } from '@mezon/mobile-components';
import { ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import { selectHiddenBottomTabMobile } from '@mezon/store-mobile';
import { useNavigationState } from '@react-navigation/native';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../ScreenTypes';
import BottomNavigator from './BottomNavigator';

const BottomNavigatorWrapper = memo(() => {
	const isHiddenTab = useSelector(selectHiddenBottomTabMobile);
	const { themeValue, themeBasic } = useTheme();
	const routesNavigation = useNavigationState((state) => state?.routes?.[state?.index]);
	const [isLastActiveTabDm, setIsLastActiveTabDm] = useState<boolean | undefined>(undefined);
	useEffect(() => {
		const storageLastActiveDM = load(STORAGE_IS_LAST_ACTIVE_TAB_DM);
		if (storageLastActiveDM === 'true') {
			setIsLastActiveTabDm(true);
		} else {
			setIsLastActiveTabDm(false);
		}
	}, []);

	const isHomeActive = useMemo(() => {
		if (routesNavigation?.state?.index === 1) {
			save(STORAGE_IS_LAST_ACTIVE_TAB_DM, 'true');
		} else if (routesNavigation?.state?.index !== undefined && routesNavigation?.state?.index !== 1) {
			save(STORAGE_IS_LAST_ACTIVE_TAB_DM, 'false');
		}
		if (routesNavigation?.state?.index === 0) {
			return true;
		}
		return routesNavigation?.name === APP_SCREEN.BOTTOM_BAR && !routesNavigation?.state?.index;
	}, [routesNavigation]);

	useEffect(() => {
		const statusBarColor = isHiddenTab ? themeValue.primary : themeValue.secondary;
		const statusBarStyle = themeBasic === ThemeModeBase.DARK ? 'light-content' : 'dark-content';

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor(statusBarColor);
		}
		StatusBar.setBarStyle(statusBarStyle);
	}, [isHiddenTab, themeBasic, themeValue.primary, themeValue.secondary]);

	if (isLastActiveTabDm === undefined) {
		return null;
	}
	return (
		<SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: isHomeActive ? themeValue.primary : themeValue.secondary }}>
			<BottomNavigator isLastActiveTabDm={isLastActiveTabDm} />
		</SafeAreaView>
	);
});

export default BottomNavigatorWrapper;
