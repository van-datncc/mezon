import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, PermissionStatus, RESULTS, openSettings, request } from 'react-native-permissions';

const isIOS = Platform.OS === 'ios';
export const usePermission = () => {
	const [cameraStatus, setCameraStatus] = useState<PermissionStatus>();
	const [microphoneStatus, setMicrophoneStatus] = useState<PermissionStatus>();

	const requestCameraPermission = useCallback(async () => {
		switch (cameraStatus) {
			case RESULTS.BLOCKED:
			case RESULTS.DENIED:
				openSettings();
				break;
			default:
				break;
		}
		const camera = await request(isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
		setCameraStatus(camera);
		return camera === RESULTS.GRANTED;
	}, [cameraStatus]);

	const requestMicrophonePermission = useCallback(async () => {
		switch (microphoneStatus) {
			case RESULTS.BLOCKED:
			case RESULTS.DENIED:
				openSettings();
				break;
			default:
				break;
		}
		const microphone = await request(isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
		setMicrophoneStatus(microphone);
		return microphone === RESULTS.GRANTED;
	}, [microphoneStatus]);

	return {
		requestCameraPermission,
		requestMicrophonePermission
	};
};
