import { ActionEmitEvent } from '@mezon/mobile-components';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import HomeDefault from './homedrawer/HomeDefault';
import ServerAndChannelList from './homedrawer/ServerAndChannelList';
import { styles } from './styles';

const HomeScreen = React.memo(() => {
	const isTabletLandscape = useTabletLandscape();
	const navigation = useNavigation<any>();
	const [isDismissUI, setIsDismissUI] = useState<boolean>(false);

	useEffect(() => {
		const event = DeviceEventEmitter.addListener(ActionEmitEvent.ON_DISMISS_UI_FROM_FCM, (isDismiss: true) => {
			setIsDismissUI(isDismiss);
		});

		return () => {
			event.remove();
		};
	}, []);

	if (isDismissUI) {
		return null;
	}

	if (isTabletLandscape) {
		return (
			<View style={styles.container}>
				<View style={styles.containerDrawerContent}>
					<ServerAndChannelList isTablet={true} />
				</View>
				<View style={styles.containerHomeDefault}>
					<HomeDefault navigation={navigation} />
				</View>
			</View>
		);
	}

	return <ServerAndChannelList />;
});

export default HomeScreen;
