import { STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_KEY_TEMPORARY_ATTACHMENT, remove } from '@mezon/mobile-components';
import { ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import { sleep } from '@mezon/utils';
import notifee from '@notifee/react-native';
import React, { useEffect } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import StatusBarHeight from '../../../components/StatusBarHeight/StatusBarHeight';
import HomeDefault from './HomeDefault';

const HomeDefaultWrapper = React.memo((props: any) => {
	const { themeValue, themeBasic } = useTheme();

	useEffect(() => {
		initLoader();
	}, []);

	useEffect(() => {
		const statusBarStyle = themeBasic === ThemeModeBase.DARK ? 'light-content' : 'dark-content';

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor(themeValue.primary);
		}
		StatusBar.setBarStyle(statusBarStyle);
		return () => {
			if (Platform.OS === 'android') {
				StatusBar.setBackgroundColor(themeValue.secondary);
			}
		};
	}, [themeBasic, themeValue.primary, themeValue.secondary]);

	const initLoader = async () => {
		try {
			await sleep(1);
			await notifee.cancelAllNotifications();
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
			await remove(STORAGE_KEY_TEMPORARY_ATTACHMENT);
		} catch (error) {
			console.error('Error in tasks:', error);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBarHeight />
			<HomeDefault {...props} />
		</View>
	);
});

export default HomeDefaultWrapper;
