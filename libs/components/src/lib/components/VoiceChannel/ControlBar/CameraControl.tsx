import { useLocalParticipant, useLocalParticipantPermissions, usePersistentUserChoices } from '@livekit/components-react';
import { useAppDispatch, voiceActions } from '@mezon/store';
import { Track } from 'livekit-client';
import { memo, useCallback, useMemo } from 'react';
import { BackgroundEffectsMenu } from './BackgroundEffectMenu';
import { CAMERA_DEVICE_KINDS, MediaDeviceMenu } from './MediaDeviceMenu/MediaDeviceMenu';
import { TrackToggle } from './TrackToggle/TrackToggle';
import { trackSourceToProtocol } from './hooks/useControlBarPermissions';

interface CameraControlProps {
	isShowMember?: boolean;
	isExternalCalling?: boolean;
	saveUserChoices?: boolean;
	onDeviceError?: (error: Error) => void;
	permissionState?: 'granted' | 'denied' | 'prompt' | null;
	onPermissionRequest?: () => Promise<void>;
}

export const CameraControl = memo(
	({ isShowMember, isExternalCalling, saveUserChoices = true, onDeviceError, permissionState, onPermissionRequest }: CameraControlProps) => {
		const dispatch = useAppDispatch();
		const localParticipant = useLocalParticipant();
		const localPermissions = useLocalParticipantPermissions();

		const { saveVideoInputDeviceId, saveVideoInputEnabled } = usePersistentUserChoices({
			preventSave: !saveUserChoices
		});

		const isSupport = useMemo(() => {
			const sender = RTCRtpSender.prototype as any;
			const supports =
				(typeof sender.createEncodedStreams === 'function' || typeof sender.createEncodedVideoStreams === 'function') &&
				typeof (window as any).VideoFrame === 'function';
			return supports;
		}, []);

		const canPublishCamera = useCallback(() => {
			if (!localPermissions) return false;
			return (
				localPermissions.canPublish &&
				(localPermissions.canPublishSources.length === 0 ||
					localPermissions.canPublishSources.includes(trackSourceToProtocol(Track.Source.Camera)))
			);
		}, [localPermissions]);

		const handleChange = useCallback(
			async (enabled: boolean, isUserInitiated: boolean) => {
				if (!isUserInitiated) return;

				if (enabled && !canPublishCamera()) {
					console.warn('Cannot enable camera: insufficient permissions');
					return;
				}

				if (enabled && permissionState !== 'granted' && onPermissionRequest) {
					await onPermissionRequest();
					return;
				}

				saveVideoInputEnabled(enabled);
				dispatch(voiceActions.setShowCamera(enabled));
			},
			[dispatch, saveVideoInputEnabled, canPublishCamera, permissionState, onPermissionRequest]
		);

		const showWarning = permissionState === 'denied';

		return (
			<div className="relative rounded-full bg-gray-300 dark:bg-black">
				<TrackToggle
					id="btn-meet-camera"
					className={`w-14 h-14 max-md:w-10 max-md:h-10 max-md:p-2 !rounded-full flex justify-center items-center border-none dark:border-none ${isShowMember ? 'bg-zinc-500 dark:bg-zinc-900' : 'bg-zinc-700'}`}
					source={Track.Source.Camera}
					onChange={handleChange}
					onDeviceError={onDeviceError}
				/>
				{showWarning && (
					<div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center z-10">
						<span className="text-black text-xs font-bold">!</span>
					</div>
				)}
				<div className="lk-button-group-menu">
					<MediaDeviceMenu
						kinds={CAMERA_DEVICE_KINDS}
						onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? 'default')}
					/>
				</div>
				{isExternalCalling && isSupport && <BackgroundEffectsMenu participant={localParticipant.localParticipant} />}
			</div>
		);
	}
);
