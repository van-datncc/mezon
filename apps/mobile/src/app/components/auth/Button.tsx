import { size } from '@mezon/mobile-ui';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
interface ButtonProps {
	isValid: boolean;
	onPress: () => void;
	title: string;
	disabled: boolean;
	loading?: boolean;
}
const Button: React.FC<ButtonProps> = ({ isValid, onPress, title, disabled, loading }) => {
	// const loading = useSelector(state => state?.auth?.loading);
	return (
		<Pressable style={[styles.button, { backgroundColor: isValid ? '#155EEF' : '#A5C9CA' }]} disabled={loading || disabled} onPress={onPress}>
			{loading ? (
				<View style={styles.wrapperLoading}>
					<Text style={styles.signinButtonText}>Loading</Text>
					<ActivityIndicator color={'white'} />
				</View>
			) : (
				<Text style={styles.signinButtonText}>{title}</Text>
			)}
		</Pressable>
	);
};

export default Button;

const styles = StyleSheet.create({
	button: {
		borderRadius: size.s_8,
		marginHorizontal: size.s_20,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: size.s_20,
		height: size.s_50
	},
	signinButtonText: {
		fontSize: size.s_18,
		lineHeight: size.s_22,
		color: '#FFFFFF'
	},
	wrapperLoading: {
		flexDirection: 'row',
		gap: size.s_8
	}
});
