import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import HomeDefault from './homedrawer/HomeDefault';
import ServerAndChannelList from './homedrawer/ServerAndChannelList';
import { styles } from './styles';

const HomeScreen = React.memo(() => {
	const isTabletLandscape = useTabletLandscape();
	const navigation = useNavigation<any>();

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
