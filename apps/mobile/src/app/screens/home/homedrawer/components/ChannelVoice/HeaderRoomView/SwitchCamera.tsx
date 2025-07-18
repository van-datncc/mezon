import { useLocalParticipant } from '@livekit/react-native';
import { size, useTheme } from '@mezon/mobile-ui';
import { Room, Track, createLocalVideoTrack } from 'livekit-client';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { style } from '../styles';

const SwitchCamera = memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { cameraTrack, isCameraEnabled, localParticipant } = useLocalParticipant();

	const handleSwitchCamera = async () => {
		try {
			if (cameraTrack && cameraTrack.track) {
				const videoPublication = localParticipant.getTrackPublication(Track.Source.Camera);
				const videoTrack = videoPublication?.track;
				const facingModeCurrent = videoPublication.track?.mediaStreamTrack?.getSettings?.()?.facingMode;
				if (videoTrack) {
					await localParticipant.unpublishTrack(videoTrack);
				}
				const newFacingMode = facingModeCurrent === 'user' ? 'environment' : 'user';
				const devices = await Room.getLocalDevices('videoinput');
				const targetCamera = devices.find((d: any) => d?.facing === (newFacingMode === 'user' ? 'front' : 'environment'));
				const newTrack = await createLocalVideoTrack({
					deviceId: targetCamera.deviceId,
					facingMode: newFacingMode
				});
				await localParticipant.publishTrack(newTrack);
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (!isCameraEnabled) return null;

	return (
		<TouchableOpacity onPress={() => handleSwitchCamera()} style={[styles.buttonCircle]}>
			<MezonIconCDN icon={IconCDN.cameraFront} height={size.s_24} width={size.s_24} color={themeValue.white} />
		</TouchableOpacity>
	);
});

export default React.memo(SwitchCamera);
