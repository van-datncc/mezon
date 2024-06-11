import React, { useEffect } from 'react';
import { BackHandler, View } from 'react-native';
import { styles } from './styles';

export const Sharing = (props: { route: any }) => {
	const data = props.route?.params?.data;
	console.log('Data Sharing', data);

	useEffect(() => {
		return () => BackHandler.exitApp(); // Don't forget to remove the listener when the component is unmounted
	}, []);
	return <View style={styles.languageSettingContainer}></View>;
};
