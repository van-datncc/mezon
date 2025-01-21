import { STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_KEY_TEMPORARY_ATTACHMENT, remove } from '@mezon/mobile-components';
import { sleep } from '@mezon/utils';
import notifee from '@notifee/react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import HomeDefault from './HomeDefault';

const HomeDefaultWrapper = React.memo((props: any) => {
	const navigation = useNavigation<any>();

	useEffect(() => {
		initLoader();
	}, []);

	const initLoader = async () => {
		try {
			navigation.dispatch(DrawerActions.openDrawer());
			await sleep(1);
			await notifee.cancelAllNotifications();
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
			await remove(STORAGE_KEY_TEMPORARY_ATTACHMENT);
			await BootSplash.hide({ fade: true });
		} catch (error) {
			console.error('Error in tasks:', error);
		}
	};

	return <HomeDefault {...props} />;
});

export default HomeDefaultWrapper;
