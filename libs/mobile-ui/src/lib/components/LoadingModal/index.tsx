import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from "react";

type IProps = {
	isVisible: boolean;
};

const LoadingModal = ({ isVisible }: IProps) => {
	return (
		<View style={styles.centeredView}>
			<View style={styles.modalView}>
				<ActivityIndicator color={'white'} />
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
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		elevation: 5,
	},
});

export default LoadingModal;
