import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, PermissionStatus, RESULTS, openSettings, request } from 'react-native-permissions';

const isIOS = Platform.OS === 'ios';
export const usePermission = () => {
	const [cameraStatus, setCameraStatus] = useState<PermissionStatus>();
	const [microphoneStatus, setMicrophoneStatus] = useState<PermissionStatus>();

	const requestCameraPermission = useCallback(() => {
		switch (cameraStatus) {
			case RESULTS.BLOCKED:
				openSettings();
				break;
			default:
				request(isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
				break;
		}
	}, [cameraStatus]);

	const requestMicrophonePermission = useCallback(() => {
		switch (microphoneStatus) {
			case RESULTS.BLOCKED:
				openSettings();
				break;
			default:
				request(isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
				break;
		}
	}, [microphoneStatus]);

	const checkPermission = useCallback(async () => {
		const camera = await request(isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
		const microphone = await request(isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
		if (camera === RESULTS.DENIED) {
			requestCameraPermission();
		}
		if (microphone === RESULTS.DENIED) {
			requestMicrophonePermission();
		}
		setCameraStatus(camera);
		setMicrophoneStatus(microphone);
	}, [requestCameraPermission, requestMicrophonePermission]);

	useEffect(() => {
		checkPermission();
	}, [checkPermission]);

	return {
		cameraPermissionGranted: cameraStatus === RESULTS.GRANTED,
		microphonePermissionGranted: microphoneStatus === RESULTS.GRANTED,
		checkPermission,
		requestCameraPermission,
		requestMicrophonePermission
	};
};
