import { STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_KEY_TEMPORARY_ATTACHMENT, remove } from '@mezon/mobile-components';
import { sleep } from '@mezon/utils';
import notifee from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import HomeDefault from './HomeDefault';
import SwipeBackContainer from './SwipeBackContainer';

const HomeDefaultWrapper = React.memo((props: any) => {
	const navigation = useNavigation<any>();
	useEffect(() => {
		initLoader();
	}, []);

	const initLoader = async () => {
		try {
			await sleep(1);
			await notifee.cancelAllNotifications();
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
			await remove(STORAGE_KEY_TEMPORARY_ATTACHMENT);
			await BootSplash.hide({ fade: true });
		} catch (error) {
			console.error('Error in tasks:', error);
		}
	};

	const handleBack = useCallback(() => {
		navigation?.goBack();
	}, [navigation]);

	return (
		<SwipeBackContainer handleBack={handleBack}>
			<HomeDefault {...props} />
		</SwipeBackContainer>
	);
});

export default HomeDefaultWrapper;
