import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { verticalScale } from '../../themes';
import colors from '../../themes/Colors';

type IProps = {
	isVisible: boolean;
};

const LoadingModal = ({ isVisible }: IProps) => {
	if (!isVisible) return <View />;
	return (
		<View style={styles.centeredView}>
			<View style={styles.modalView}>
				<ActivityIndicator size={'large'} color={colors.white} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.4)',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
	},
	modalView: {
		backgroundColor: colors.black,
		borderRadius: verticalScale(20),
		padding: verticalScale(20),
		alignItems: 'center',
		elevation: 5,
	},
});

export default LoadingModal;
