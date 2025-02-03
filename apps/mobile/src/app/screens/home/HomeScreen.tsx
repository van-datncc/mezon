import { appActions } from '@mezon/store-mobile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import HomeDefault from './homedrawer/HomeDefault';
import ServerAndChannelList from './homedrawer/ServerAndChannelList';
import { styles } from './styles';

const HomeScreen = React.memo(() => {
	const dispatch = useDispatch();
	const isTabletLandscape = useTabletLandscape();
	const navigation = useNavigation<any>();

	useFocusEffect(() => {
		if (!isTabletLandscape) dispatch(appActions.setHiddenBottomTabMobile(false));
	});

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
