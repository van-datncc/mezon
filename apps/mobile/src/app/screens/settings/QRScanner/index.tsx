import { Icons } from '@mezon/mobile-components';
import { baseColor, Block, size } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { styles } from './styles';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import BG_LOGIN from './bgLoginQR.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ICON_LOGIN from './iconLogin.png';

export const QRScanner = () => {
	const [hasPermission, setHasPermission] = useState(false);
	const device = useCameraDevice('back');
	const navigation = useNavigation<any>();
	const [isActive, setIsActive] = useState(true);
	const [valueCode, setValueCode] = useState('');

	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (codes) => {
			setIsActive(false); // Deactivate the camera
			setValueCode(codes?.[0]?.value);
		}
	});

	useEffect(() => {
		const requestCameraPermission = async () => {
			const permission = await Camera.requestCameraPermission();
			setHasPermission(permission === 'granted');
		};

		requestCameraPermission();
	}, []);

	if (device == null || !hasPermission) {
		return (
			<View style={styles.wrapper}>
				<Text style={{ backgroundColor: 'white' }}>Camera not available or not permitted</Text>
			</View>
		);
	}

	const onGoback = () => {
		navigation.goBack();
	};

	return (
		<View style={styles.wrapper}>
			<Camera codeScanner={codeScanner} style={StyleSheet.absoluteFill} device={device} isActive={isActive} />
			{isActive ? (
				<Block flex={1}>
					<TouchableOpacity
						style={styles.backHeader}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<Icons.CloseSmallBoldIcon width={size.s_28} height={size.s_28} color={baseColor.white} />
					</TouchableOpacity>
					<View style={styles.mainOverlay}></View>
					<View style={styles.overlayCenter}>
						<View style={styles.overlayCenterSub} />
						<View style={styles.square} />
						<View style={styles.overlayCenterSub} />
					</View>
					<View style={styles.mainOverlay}></View>
				</Block>
			) : (
				<ImageBackground source={BG_LOGIN} style={styles.popupLogin}>
					<View style={styles.popupLoginSub}>
						<FastImage source={ICON_LOGIN} style={styles.iconLogin} />
						<Text style={styles.title}>Log in on a new device?</Text>
						<Text style={styles.subTitle}>Newer scan a lgin QR code from another user.</Text>
						<TouchableOpacity style={styles.button} onPress={onGoback}>
							<Text style={styles.buttonText}>Log in</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.button, { backgroundColor: 'transparent' }]} onPress={onGoback}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</ImageBackground>
			)}
		</View>
	);
};
