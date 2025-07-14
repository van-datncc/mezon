import { useLocalParticipant } from '@livekit/react-native';
import { useTheme } from '@mezon/mobile-ui';
import * as Sentry from '@sentry/react-native';
import { Track, createLocalAudioTrack } from 'livekit-client';
import React from 'react';
import { Alert, Linking, Platform, TouchableOpacity } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { style } from '../styles';

const ButtonToggleMic = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();

	const checkAndRequestMicPermission = async () => {
		if (Platform.OS === 'ios') {
			let result = await check(PERMISSIONS.IOS.MICROPHONE);
			if (result !== RESULTS.GRANTED) {
				result = await request(PERMISSIONS.IOS.MICROPHONE);
			}
			return result === RESULTS.GRANTED;
		} else if (Platform.OS === 'android') {
			let result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
			if (result !== RESULTS.GRANTED) {
				result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
			}
			return result === RESULTS.GRANTED;
		}
		return false;
	};

	const showPermissionAlert = () => {
		Alert.alert('Microphone Permission Required', 'Please allow microphone access in your device settings to use this feature.', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Open Settings',
				onPress: () => {
					Linking.openSettings();
				}
			}
		]);
	};

	const createAndPublishAudioTrack = async (localParticipant: any) => {
		let newAudioTrack;
		try {
			newAudioTrack = await createLocalAudioTrack();
		} catch (createError) {
			console.error('Error enabling microphone:', createError);
			Sentry.captureException('ToogleMicMezonMeet', { extra: { createError } });
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const audioInputDevices = devices?.filter((device) => device?.kind === 'audioinput');
				if (audioInputDevices?.length === 0) {
					Toast.show({
						type: 'error',
						text1: 'No audio input devices found'
					});
					return;
				}
				newAudioTrack = await createLocalAudioTrack({
					deviceId: { exact: audioInputDevices?.[0]?.deviceId }
				});
			} catch (deviceError) {
				console.error('Error creating audio track with device:', deviceError);
				Toast.show({
					type: 'error',
					text1: `Error creating audio device: ${JSON.stringify(deviceError)}`
				});
				return;
			}
		}

		try {
			const oldAudioPublication = Array.from(localParticipant.audioTrackPublications.values()).find(
				(publication) => publication?.source === Track.Source.Microphone
			);
			if (oldAudioPublication && oldAudioPublication?.track) {
				await localParticipant.unpublishTrack(oldAudioPublication?.track, true);
			}
			await localParticipant.publishTrack(newAudioTrack);
		} catch (publishError) {
			console.error('Error publish audio track:', publishError);
		}
	};

	const handleToggleMicrophone = async () => {
		try {
			if (isMicrophoneEnabled) {
				await localParticipant.setMicrophoneEnabled(false);
				return;
			}

			try {
				await localParticipant.setMicrophoneEnabled(true);
			} catch (enableError) {
				console.error('Error enabling microphone:', enableError);

				if (enableError?.message === 'Permission denied.') {
					const hasPermission = await checkAndRequestMicPermission();
					if (!hasPermission) {
						showPermissionAlert();
						return;
					}
				}

				await createAndPublishAudioTrack(localParticipant);
			}
		} catch (error) {
			console.error('Error toggling microphone:', error);
		}
	};
	return (
		<TouchableOpacity onPress={handleToggleMicrophone} style={styles.menuIcon}>
			<MezonIconCDN icon={isMicrophoneEnabled ? IconCDN.microphoneIcon : IconCDN.microphoneSlashIcon} color={themeValue.textStrong} />
		</TouchableOpacity>
	);
};

export default React.memo(ButtonToggleMic);
