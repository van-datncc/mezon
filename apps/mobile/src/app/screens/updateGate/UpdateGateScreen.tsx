import { AngleRight, DownloadNewVersionIcon } from '@mezon/mobile-components';
import { Block, Colors, size } from '@mezon/mobile-ui';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { BackHandler, Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UpdateGateScreen = ({ route }) => {
	const storeUrl = route?.params?.storeUrl;

	useFocusEffect(() => {
		const backAction = () => true;

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	});
	const onPress = () => Linking.openURL(storeUrl);

	return (
		<SafeAreaView style={styles.container}>
			<Block paddingTop={size.s_50}>
				<Block alignItems={'center'}>
					<DownloadNewVersionIcon width={size.s_60} height={size.s_60} />
				</Block>
				<Block paddingTop={size.s_50}>
					<Text style={styles.title}>A new mezon update is {`\n`}here</Text>
					<Text style={styles.subTitle}>
						A new version of the app is available in the app store. In order to keep unlocking exclusives, you’ll need to update first.
					</Text>
				</Block>
			</Block>
			<TouchableOpacity onPress={onPress}>
				<Block
					backgroundColor={Colors.white}
					flexDirection={'row'}
					justifyContent={'space-between'}
					paddingHorizontal={size.s_10}
					height={size.s_50}
					alignItems={'center'}
				>
					<Text style={styles.titleBtn}>Get The New Version</Text>
					<AngleRight color={Colors.black} width={size.s_24} height={size.s_24} />
				</Block>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default UpdateGateScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: size.s_40,
		backgroundColor: Colors.secondary,
		justifyContent: 'space-between',
	},
	title: {
		fontSize: size.s_40,
		lineHeight: size.s_50,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		color: Colors.white,
	},
	subTitle: {
		marginTop: size.s_30,
		fontSize: size.s_18,
		lineHeight: size.s_24,
		color: Colors.tertiary,
	},
	titleBtn: {
		fontSize: size.s_16,
		fontWeight: 'bold',
		color: Colors.black,
	},
});
