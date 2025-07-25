import {
	ControlBarControls,
	useLocalParticipant,
	useLocalParticipantPermissions,
	usePersistentUserChoices,
	useTracks
} from '@livekit/components-react';
import {
	selectGroupCallJoined,
	selectShowCamera,
	selectShowMicrophone,
	selectShowScreen,
	selectShowSelectScreenModal,
	selectStreamScreen,
	selectVoiceFullScreen,
	selectVoiceOpenPopOut,
	useAppDispatch,
	voiceActions
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EmojiPlaces, requestMediaPermission, useMediaPermissions } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';

import { EmojiSuggestionProvider } from '@mezon/core';
import isElectron from 'is-electron';
import { LocalTrackPublication, RoomEvent, ScreenSharePresets, Track, VideoPresets } from 'livekit-client';
import Tooltip from 'rc-tooltip';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import { usePopup } from '../../DraggablePopup/usePopup';
import { GifStickerEmojiPopup } from '../../GifsStickersEmojis';
import SoundSquare from '../../GifsStickersEmojis/SoundSquare';
import ScreenSelectionModal from '../../ScreenSelectionModal/ScreenSelectionModal';
import { ReactionChannelInfo } from '../MyVideoConference/Reaction/types';
import { useSendReaction } from '../MyVideoConference/Reaction/useSendReaction';
import VoicePopout from '../VoicePopout/VoicePopout';
import { BackgroundEffectsMenu } from './BackgroundEffectsMenu';
import { MediaDeviceMenu } from './MediaDeviceMenu/MediaDeviceMenu';
import { ScreenShareToggleButton } from './TrackToggle/ScreenShareToggleButton';
import { TrackToggle } from './TrackToggle/TrackToggle';
interface ControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
	onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
	variation?: 'minimal' | 'verbose' | 'textOnly';
	controls?: ControlBarControls;
	saveUserChoices?: boolean;
	onLeaveRoom: () => void;
	onFullScreen: () => void;
	isExternalCalling?: boolean;
	currentChannel?: ReactionChannelInfo;
	isShowMember?: boolean;
	isGridView?: boolean;
}

export function ControlBar({
	variation,
	controls,
	saveUserChoices = true,
	onDeviceError,
	onLeaveRoom,
	onFullScreen,
	isExternalCalling,
	currentChannel,
	isShowMember = true,
	isGridView = true
}: ControlBarProps) {
	const dispatch = useAppDispatch();
	const isTooLittleSpace = useMediaQuery('max-width: 760px');
	const audioScreenTrackRef = useRef<LocalTrackPublication | null>(null);

	const { hasCameraAccess, hasMicrophoneAccess } = useMediaPermissions();

	const isGroupCall = useSelector(selectGroupCallJoined);

	const { sendEmojiReaction, sendSoundReaction } = useSendReaction({ currentChannel: currentChannel });

	const screenTrackRef = useRef<LocalTrackPublication | null>(null);
	const isDesktop = isElectron();
	const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
	variation ??= defaultVariation;
	const stream = useSelector(selectStreamScreen);
	const visibleControls = { leave: true, ...controls };

	const showScreen = useSelector(selectShowScreen);
	const showCamera = useSelector(selectShowCamera);
	const showMicrophone = useSelector(selectShowMicrophone);

	const isFullScreen = useSelector(selectVoiceFullScreen);
	const isShowSelectScreenModal = useSelector(selectShowSelectScreenModal);
	const localPermissions = useLocalParticipantPermissions();
	const localParticipant = useLocalParticipant();
	const isOpenPopOut = useSelector(selectVoiceOpenPopOut);

	if (!localPermissions) {
		visibleControls.camera = false;
		visibleControls.microphone = false;
		visibleControls.screenShare = false;
	} else {
		visibleControls.camera ??= localPermissions.canPublish;
		visibleControls.microphone ??= localPermissions.canPublish;
		visibleControls.screenShare ??= localPermissions.canPublish;
	}

	const browserSupportsScreenSharing = supportsScreenSharing();

	const { saveAudioInputDeviceId, saveVideoInputDeviceId } = usePersistentUserChoices({
		preventSave: !saveUserChoices
	});

	useEffect(() => {
		if (!isOpenPopOut) {
			closeVoicePopup();
		}
	}, [isOpenPopOut]);

	const handleRequestCameraPermission = useCallback(async () => {
		const permissionStatus = await requestMediaPermission('video');
		if (permissionStatus === 'granted') {
			dispatch(voiceActions.setShowCamera(true));
		}
	}, [dispatch]);

	const handleRequestMicrophonePermission = useCallback(async () => {
		const permissionStatus = await requestMediaPermission('audio');
		if (permissionStatus === 'granted') {
			dispatch(voiceActions.setShowMicrophone(true));
		}
	}, [dispatch]);

	const microphoneOnChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (isUserInitiated) {
				if (!hasMicrophoneAccess && enabled) {
					handleRequestMicrophonePermission();
				} else {
					dispatch(voiceActions.setShowMicrophone(enabled));
				}
			}
		},
		[hasMicrophoneAccess, dispatch, handleRequestMicrophonePermission]
	);

	const cameraOnChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (isUserInitiated) {
				if (!hasCameraAccess && enabled) {
					handleRequestCameraPermission();
				} else {
					dispatch(voiceActions.setShowCamera(enabled));
				}
			}
		},
		[hasCameraAccess, dispatch, handleRequestCameraPermission]
	);

	useEffect(() => {
		if (isShowSelectScreenModal) {
			openScreenSelection();
		}
	}, [isShowSelectScreenModal]);

	const [openScreenSelection, closeScreenSelection] = useModal(() => {
		return <ScreenSelectionModal onClose={closeScreenSelection} />;
	});

	useEffect(() => {
		if (!showScreen && isDesktop) {
			if (screenTrackRef.current?.track) {
				localParticipant.localParticipant.unpublishTrack(screenTrackRef.current.track);
			}
			dispatch(voiceActions.setStreamScreen(null));
		}
	}, [dispatch, showScreen]);

	useEffect(() => {
		const publishScreenTrack = async () => {
			if (screenTrackRef.current?.track) {
				screenTrackRef.current.track.stop?.();
				await localParticipant.localParticipant.unpublishTrack(screenTrackRef.current.track);
				screenTrackRef.current = null;
			}
			if (!stream) return;
			const videoTrack = stream.getVideoTracks()[0];
			try {
				const trackPublication = await localParticipant.localParticipant.publishTrack(videoTrack, {
					name: 'screen-share',
					source: Track.Source.ScreenShare,
					simulcast: false,
					screenShareSimulcastLayers: [
						// 720p
						{
							...VideoPresets.h720,
							encoding: ScreenSharePresets.h720fps30.encoding,
							resolution: ScreenSharePresets.h720fps30.resolution
						},
						// 1080p
						{
							...VideoPresets.h1080,
							encoding: ScreenSharePresets.h1080fps30.encoding,

							resolution: ScreenSharePresets.h1080fps30.resolution
						},
						{
							...VideoPresets.h1440,
							encoding: ScreenSharePresets.original.encoding,

							resolution: ScreenSharePresets.original.resolution
						}
					]
				});

				screenTrackRef.current = trackPublication;
			} catch (error) {
				console.error('Error publishing screen track:', error);
			}
		};
		const publishScreenAudioTrack = async () => {
			if (audioScreenTrackRef.current?.track) {
				audioScreenTrackRef.current.track.stop?.();
				localParticipant.localParticipant.unpublishTrack(audioScreenTrackRef.current.track);
				audioScreenTrackRef.current = null;
			}
			if (!stream) return;

			const audioTrack = stream.getAudioTracks()[0];
			if (audioTrack) {
				try {
					const audioPublication = await localParticipant.localParticipant.publishTrack(audioTrack, {
						name: 'screen-share-audio',
						source: Track.Source.ScreenShareAudio
					});

					audioScreenTrackRef.current = audioPublication;
				} catch (error) {
					console.error('Error publishing audio track:', error);
				}
			}
		};

		publishScreenAudioTrack();
		publishScreenTrack();
		return () => {
			if (screenTrackRef.current?.track) {
				screenTrackRef.current.track.stop?.();
				localParticipant.localParticipant.unpublishTrack(screenTrackRef.current.track);
				screenTrackRef.current = null;
			}
			if (audioScreenTrackRef.current?.track) {
				audioScreenTrackRef.current.track.stop?.();
				localParticipant.localParticipant.unpublishTrack(audioScreenTrackRef.current.track);
				audioScreenTrackRef.current = null;
			}
		};
	}, [stream]);

	const handleOpenScreenSelection = useCallback(() => {
		if (isDesktop) {
			if (!showScreen) {
				dispatch(voiceActions.setShowSelectScreenModal(true));
			} else {
				dispatch(voiceActions.setShowScreen(false));
			}
		}
	}, [isDesktop, openScreenSelection, showScreen]);

	const onScreenShare = useCallback(
		async (enabled: boolean, isUserInitiated: boolean) => {
			if (enabled) {
				dispatch(voiceActions.setFullScreen(false));
			}

			if (isUserInitiated) {
				dispatch(voiceActions.setShowScreen(enabled));
			}
		},
		[dispatch]
	);

	const screenShareTracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false }
	);

	const [openVoicePopup, closeVoicePopup] = usePopup(
		({ closePopup }) => (
			<VoicePopout
				tracks={screenShareTracks}
				onClose={() => {
					closePopup();
				}}
			/>
		),
		{
			title: 'Voice Channel',
			handleClose: () => dispatch(voiceActions.setOpenPopOut(false))
		}
	);

	const togglePopout = useCallback(() => {
		if (isOpenPopOut) {
			closeVoicePopup();
			dispatch(voiceActions.setOpenPopOut(false));
		} else {
			openVoicePopup();
			dispatch(voiceActions.setOpenPopOut(true));
		}
	}, [dispatch, isOpenPopOut, openVoicePopup, closeVoicePopup]);

	const [showEmojiPanel, setShowEmojiPanel] = useState(false);
	const [showSoundPanel, setShowSoundPanel] = useState(false);

	useEffect(() => {
		if (!showEmojiPanel) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' || e.key === 'Esc') {
				setShowEmojiPanel(false);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [showEmojiPanel]);

	useEffect(() => {
		if (!showSoundPanel) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' || e.key === 'Esc') {
				setShowSoundPanel(false);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [showSoundPanel]);

	const handleEmojiSelect = useCallback(
		(emoji: string, emojiId: string) => {
			sendEmojiReaction(emoji, emojiId);
		},
		[sendEmojiReaction]
	);

	const handleSoundSelect = useCallback(
		(soundId: string, soundUrl: string) => {
			sendSoundReaction(soundId);
		},
		[sendSoundReaction]
	);

	return (
		<div className="lk-control-bar !flex !justify-between !border-none !bg-transparent max-md:flex-col">
			<div className="flex justify-start gap-4 max-md:hidden">
				{!isGroupCall && (
					<>
						<Tooltip
							placement="topLeft"
							trigger={['click']}
							overlayClassName="w-auto"
							visible={showEmojiPanel}
							onVisibleChange={setShowEmojiPanel}
							overlay={
								<EmojiSuggestionProvider>
									<GifStickerEmojiPopup
										showTabs={{ emojis: true }}
										mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
										emojiAction={EmojiPlaces.EMOJI_REACTION}
										onEmojiSelect={handleEmojiSelect}
									/>
								</EmojiSuggestionProvider>
							}
							destroyTooltipOnHide
						>
							<div>
								<Icons.VoiceEmojiControlIcon
									className={`cursor-pointer  ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
										? 'text-theme-primary text-theme-primary-hover'
										: 'text-gray-300 hover:text-white'}`}
								/>
							</div>
						</Tooltip>

						<Tooltip
							placement="topLeft"
							trigger={['click']}
							overlayClassName="w-auto"
							visible={showSoundPanel}
							onVisibleChange={setShowSoundPanel}
							overlay={
								<SoundSquare
									channel={currentChannel as any}
									mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
									onClose={() => {}}
									onSoundSelect={handleSoundSelect}
								/>
							}
							destroyTooltipOnHide
						>
							<div>
								<Icons.VoiceSoundControlIcon
									className={`cursor-pointer  ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
										? 'text-theme-primary text-theme-primary-hover'
										: 'text-gray-300 hover:text-white'}`}
								/>
							</div>
						</Tooltip>
					</>
				)}
			</div>
			<div className="flex justify-center gap-3 flex-1">
				{visibleControls.microphone && (
					<div className="relative rounded-full bg-gray-300 dark:bg-black">
						<TrackToggle
							key={+showMicrophone}
							initialState={showMicrophone}
							className={`w-14 aspect-square max-md:w-10 max-md:p-2 !rounded-full flex justify-center items-center border-none dark:border-none ${isShowMember ? 'bg-zinc-500 dark:bg-zinc-900' : 'bg-zinc-700'}`}
							source={Track.Source.Microphone}
							onChange={microphoneOnChange}
							onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
						/>
						{hasMicrophoneAccess && (
							<MediaDeviceMenu
								kind="audioinput"
								onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? 'default')}
							/>
						)}
					</div>
				)}
				{visibleControls.camera && (
					<div className="relative rounded-full ">
						<TrackToggle
							key={+showCamera}
							initialState={showCamera}
							className={`w-14 aspect-square max-md:w-10 max-md:p-2 !rounded-full flex justify-center items-center border-none dark:border-none ${isShowMember ? 'bg-zinc-500 dark:bg-zinc-900' : 'bg-zinc-700'}`}
							source={Track.Source.Camera}
							onChange={cameraOnChange}
							onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Camera, error })}
						/>
						{hasCameraAccess && (
							<>
								<MediaDeviceMenu
									kind="videoinput"
									onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? 'default')}
								/>
								{showCamera && typeof window !== 'undefined' && 'MediaStreamTrackGenerator' in window && (
									<BackgroundEffectsMenu participant={localParticipant.localParticipant} />
								)}
							</>
						)}
					</div>
				)}
				{visibleControls.screenShare &&
					browserSupportsScreenSharing &&
					(!isDesktop ? (
						<TrackToggle
							key={+showScreen}
							initialState={showScreen}
							className={`w-14 aspect-square max-md:w-10 max-md:p-2 !rounded-full flex justify-center items-center border-none dark:border-none ${isShowMember ? 'bg-zinc-500 dark:bg-zinc-900' : 'bg-zinc-700'}`}
							source={Track.Source.ScreenShare}
							captureOptions={{ audio: true, selfBrowserSurface: 'include', resolution: VideoPresets.h720.resolution }}
							publishOptions={{
								simulcast: false,
								videoEncoding: {
									...VideoPresets.h720.encoding,
									priority: 'high'
								}
							}}
							onChange={onScreenShare}
							onDeviceError={(error) => onDeviceError?.({ source: Track.Source.ScreenShare, error })}
						/>
					) : (
						<ScreenShareToggleButton
							onClick={handleOpenScreenSelection}
							className={`w-14 aspect-square max-md:w-10 max-md:p-2 !rounded-full flex justify-center items-center ${!isShowMember && 'text-white'}`}
						/>
					))}
				{visibleControls.leave && (
					<div
						onClick={onLeaveRoom}
						className="w-14 aspect-square max-md:w-10 bg-[#da373c] hover:bg-[#a12829] cursor-pointer rounded-full flex justify-center items-center"
					>
						<Icons.EndCall className="w-6 aspect-square max-md:w-4" />
					</div>
				)}
			</div>
			<div className="flex justify-end gap-4 max-md:hidden">
				{!isExternalCalling && (
					<div onClick={togglePopout}>
						{isOpenPopOut ? (
							<span>
								<Icons.VoicePopOutIcon
									className={`cursor-pointer rotate-180  ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
										? 'text-theme-primary text-theme-primary-hover'
										: 'text-gray-300 hover:text-white'}`}
								/>
							</span>
						) : (
							<span>
								<Icons.VoicePopOutIcon
										className={`  ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
											? 'text-theme-primary text-theme-primary-hover'
											: 'text-gray-300 hover:text-white'} cursor-pointer `}
								/>
							</span>
						)}
					</div>
				)}

				<div onClick={onFullScreen}>
					{isFullScreen ? (
						<span>
							<Icons.ExitFullScreen
								className={`  ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
									? 'text-theme-primary text-theme-primary-hover'
									: 'text-gray-300 hover:text-white'}  cursor-pointer `}
							/>
						</span>
					) : (
						<span>
							<Icons.FullScreen
									className={`cursor-pointer ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
										? 'text-theme-primary text-theme-primary-hover'
										: 'text-gray-300 hover:text-white'}`}
							/>
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

function useMediaQuery(query: string): boolean {
	const getMatches = (query: string): boolean => {
		// Prevents SSR issues
		if (typeof window !== 'undefined') {
			return window.matchMedia(query).matches;
		}
		return false;
	};

	const [matches, setMatches] = useState<boolean>(getMatches(query));

	function handleChange() {
		setMatches(getMatches(query));
	}

	useEffect(() => {
		const matchMedia = window.matchMedia(query);

		// Triggered at the first client-side load and if query changes
		handleChange();

		// Listen matchMedia
		if (matchMedia.addListener) {
			matchMedia.addListener(handleChange);
		} else {
			matchMedia.addEventListener('change', handleChange);
		}

		return () => {
			if (matchMedia.removeListener) {
				matchMedia.removeListener(handleChange);
			} else {
				matchMedia.removeEventListener('change', handleChange);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return matches;
}

const supportsScreenSharing = () => {
	return typeof navigator !== 'undefined' && navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
};
