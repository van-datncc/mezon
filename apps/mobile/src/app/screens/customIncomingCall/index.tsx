import * as React from 'react';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import type { CustomIncomingActivityProps } from 'react-native-full-screen-notification-incoming-call';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';

export default function CustomIncomingCall(props: CustomIncomingActivityProps) {
	useEffect(() => {
		BootSplash.hide({ fade: true });
	}, []);
	return (
		<View style={styles.container}>
			{/* Caller Info */}
			<Text style={styles.callerName}>{props.name || 'Unknown Caller'}</Text>
			<Image
				source={{
					uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKet-b99huP_BtZT_HUqvsaSz32lhrcLtIDQ&s'
				}}
				style={styles.callerImage}
			/>

			{/* Decline and Answer Buttons */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.button, styles.declineButton]}
					onPress={() => {
						RNNotificationCall?.declineCall?.(props.uuid, props.payload);
					}}
				>
					<Text style={styles.buttonText}>Decline</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, styles.answerButton]}
					onPress={() => {
						RNNotificationCall?.answerCall?.(props.uuid, props.payload);
					}}
				>
					<Text style={styles.buttonText}>Answer</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1c1d22',
		paddingHorizontal: 20
	},
	callerName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginVertical: 10,
		color: 'white'
	},
	callerImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 30
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '90%',
		marginTop: 30
	},
	button: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 15,
		marginHorizontal: 10,
		borderRadius: 10
	},
	declineButton: {
		backgroundColor: '#ff4d4d'
	},
	answerButton: {
		backgroundColor: '#4CAF50'
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600'
	}
});
