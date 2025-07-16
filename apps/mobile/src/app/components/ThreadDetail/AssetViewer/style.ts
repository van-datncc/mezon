import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flex: 1
	},
	widthTab: { width: Dimensions.get('window').width },
	wrapper: {
		flex: 1,
		alignItems: 'center'
	}
});

export default styles;
