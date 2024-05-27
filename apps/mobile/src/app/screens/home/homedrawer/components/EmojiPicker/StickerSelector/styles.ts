import { Colors } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	content: {
		height: 110,
		width: 110,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: Colors.black
	},

	btnEmo: {
		width: 30,
		height: 30,
		borderRadius: 50,
		overflow: 'hidden',
		backgroundColor: Colors.black
	},

	btnWrap: {
		display: "flex",
		flexDirection: "row",
		gap: 10
	},

	session: {},

	sessionTitle: {
		color: Colors.white,
		marginVertical: 10
	},

	sessionContent: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default styles;
