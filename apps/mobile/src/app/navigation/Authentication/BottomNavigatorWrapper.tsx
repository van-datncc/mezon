import { load, STORAGE_IS_LAST_ACTIVE_TAB_DM } from '@mezon/mobile-components';
import { ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import React, { memo, useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigator from './BottomNavigator';

const BottomNavigatorWrapper = memo(() => {
	const { themeValue, themeBasic } = useTheme();
	const [isLastActiveTabDm, setIsLastActiveTabDm] = useState<boolean | undefined>(undefined);
	useEffect(() => {
		const storageLastActiveDM = load(STORAGE_IS_LAST_ACTIVE_TAB_DM);
		if (storageLastActiveDM === 'true') {
			setIsLastActiveTabDm(true);
		} else {
			setIsLastActiveTabDm(false);
		}
	}, []);

	useEffect(() => {
		const statusBarStyle = themeBasic === ThemeModeBase.DARK ? 'light-content' : 'dark-content';

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor(themeValue.secondary);
		}
		StatusBar.setBarStyle(statusBarStyle);
	}, [themeBasic, themeValue.primary, themeValue.secondary]);

	if (isLastActiveTabDm === undefined) {
		return null;
	}
	return (
		<SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: themeValue.secondary }}>
			<BottomNavigator isLastActiveTabDm={isLastActiveTabDm} />
		</SafeAreaView>
	);
});

export default BottomNavigatorWrapper;
