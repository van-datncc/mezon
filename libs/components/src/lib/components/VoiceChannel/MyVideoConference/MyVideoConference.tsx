import {
	ConnectionStateToast,
	isTrackReference,
	LayoutContextProvider,
	RoomAudioRenderer,
	TrackReferenceOrPlaceholder,
	useCreateLayoutContext,
	usePinnedTracks,
	useRoomContext,
	useTracks
} from '@livekit/components-react';
import { selectCurrentClan, topicsActions, useAppDispatch, voiceActions } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { LocalParticipant, LocalTrackPublication, RoomEvent, Track } from 'livekit-client';
import Tooltip from 'rc-tooltip';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RedDot } from '../../ChannelTopbar';
import NotificationList from '../../NotificationList';
import { ControlBar } from '../ControlBar/ControlBar';
import { CarouselLayout } from './FocusLayout/CarouselLayout/CarouselLayout';
import { FocusLayout, FocusLayoutContainer } from './FocusLayout/FocusLayoutContainer';
import { GridLayout } from './GridLayout/GridLayout';
import { ParticipantTile } from './ParticipantTile/ParticipantTile';
import { ReactionCallHandler } from './Reaction';
import { useSoundReactions } from './Reaction/useSoundReactions';

interface MyVideoConferenceProps {
	channelLabel?: string;
	onLeaveRoom: () => void;
	onFullScreen: () => void;
	isExternalCalling?: boolean;
	tracks?: TrackReferenceOrPlaceholder[];
	isShowChatVoice?: boolean;
	onToggleChat?: () => void;
	currentChannel?: any;
}

export function MyVideoConference({
	channelLabel,
	onLeaveRoom,
	onFullScreen,
	isExternalCalling = false,
	tracks: propTracks,
	isShowChatVoice,
	onToggleChat,
	currentChannel
}: MyVideoConferenceProps) {
	const lastAutoFocusedScreenShareTrack = useRef<TrackReferenceOrPlaceholder | null>(null);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const { activeSoundReactions, handleSoundReaction } = useSoundReactions();

	const tracksFromHook = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false }
	);

	const tracks = propTracks || tracksFromHook;

	const layoutContext = useCreateLayoutContext();

	const screenShareTracks = useMemo(() => {
		return tracks.filter(isTrackReference).filter((track) => track.publication.source === Track.Source.ScreenShare);
	}, [tracks]);

	const focusTrack = usePinnedTracks(layoutContext)?.[0];

	useEffect(() => {
		// If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
		if (screenShareTracks.some((track) => track.publication.isSubscribed) && lastAutoFocusedScreenShareTrack.current === null) {
			layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
			lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
		} else if (
			lastAutoFocusedScreenShareTrack.current &&
			!screenShareTracks.some((track) => track.publication.trackSid === lastAutoFocusedScreenShareTrack.current?.publication?.trackSid)
		) {
			layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
			lastAutoFocusedScreenShareTrack.current = null;
		}

		if (focusTrack && !isTrackReference(focusTrack)) {
			const updatedFocusTrack = tracks.find(
				(tr) => tr.participant.identity === focusTrack.participant.identity && tr.source === focusTrack.source
			);
			if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
				layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: updatedFocusTrack });
			}
		}
	}, [screenShareTracks, focusTrack?.publication?.trackSid, tracks, layoutContext?.pin]);

	const [isShowMember, setIsShowMember] = useState<boolean>(true);

	const handleShowMember = useCallback(() => {
		setIsShowMember((prevState) => !prevState);
	}, []);

	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setIsShowInbox(false);
	};

	const dispatch = useAppDispatch();
	const [isShowInbox, setIsShowInbox] = useState<boolean>(false);
	const currentClan = useSelector(selectCurrentClan);
	const inboxRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isShowInbox) {
			dispatch(topicsActions.fetchTopics({ clanId: currentClan?.clan_id as string }));
		}
	}, [isShowInbox]);

	const handleShowInbox = () => {
		setIsShowInbox(!isShowInbox);
	};

	useEffect(() => {
		setIsFocused(!!focusTrack);
		setIsGridView(!focusTrack);
	}, [focusTrack]);

	const toggleViewMode = () => {
		if (isFocused) {
			layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
			setIsGridView(true);
		} else {
			const firstTrack = screenShareTracks[0] || tracks.find(isTrackReference) || tracks[0];
			if (firstTrack) {
				layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: firstTrack });
				setIsGridView(false);
			}
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (!inboxRef.current) return;
		if (!inboxRef.current.contains(event.target as Node)) {
			setIsShowInbox(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const userTracks = tracks.filter((track) => track.source !== 'screen_share' && track.source !== 'screen_share_audio');
	const room = useRoomContext();

	useEffect(() => {
		const handleDisconnected = () => {
			onLeaveRoom();
		};
		const handleTrackPublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
			if (publication.source === Track.Source.ScreenShare) {
				dispatch(voiceActions.setShowScreen(false));
			}
			if (publication.source === Track.Source.Camera) {
				dispatch(voiceActions.setShowCamera(false));
			}
		};

		room?.on('disconnected', handleDisconnected);
		room?.on('localTrackUnpublished', handleTrackPublished);
		return () => {
			room?.off('disconnected', handleDisconnected);
		};
	}, [room]);

	const onToggleChatBox = () => {
		if (isExternalCalling) {
			dispatch(voiceActions.setToggleChatBox());
		} else {
			onToggleChat?.();
		}
	};

	return (
		<div className="lk-video-conference flex-1">
			<ReactionCallHandler currentChannel={currentChannel} onSoundReaction={handleSoundReaction} />
			<LayoutContextProvider value={layoutContext}>
				<div
					className="lk-video-conference-inner relative bg-gray-100 dark:bg-black"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{!focusTrack ? (
						<div className="lk-grid-layout-wrapper bg-gray-300 dark:bg-black !h-full !py-[68px]">
							<GridLayout tracks={tracks}>
								<ParticipantTile isExtCalling={isExternalCalling} activeSoundReactions={activeSoundReactions} />
							</GridLayout>
						</div>
					) : (
						<div className={`lk-focus-layout-wrapper !h-full  ${isShowMember ? '!py-[68px]' : ''}`}>
							<FocusLayoutContainer isShowMember={isShowMember}>
								{focusTrack && <FocusLayout trackRef={focusTrack} isExtCalling={isExternalCalling} />}
								{isShowMember && (
									<CarouselLayout tracks={tracks}>
										<ParticipantTile isExtCalling={isExternalCalling} activeSoundReactions={activeSoundReactions} />
									</CarouselLayout>
								)}
							</FocusLayoutContainer>
							{isHovered && (
								<Tooltip
									key={+isShowMember}
									placement="top"
									overlay={
										<span className="bg-[#2B2B2B] p-2 rounded !text-[16px]">
											{isShowMember ? 'Hide Members' : 'Show Members'}
										</span>
									}
									overlayClassName="whitespace-nowrap z-50 !p-0 !pt-4"
									getTooltipContainer={() => document.getElementById('livekitRoom') || document.body}
									destroyTooltipOnHide
								>
									<div
										className={`absolute bg-[#2B2B2B] left-1/2 ${isShowMember ? 'bottom-[178px]' : 'bottom-[140px]'}
											transform -translate-x-1/2 flex flex-row items-center gap-[2px] p-[2px] rounded-[20px]`}
										onClick={handleShowMember}
									>
										{isShowMember ? <Icons.VoiceArowDownIcon /> : <Icons.VoiceArowUpIcon />}
										<p className="flex gap-1">
											<span>
												<Icons.MemberList defaultFill="text-white" />
											</span>
											<span className="pr-[6px]">{userTracks.length}</span>
										</p>
									</div>
								</Tooltip>
							)}
						</div>
					)}
					<div
						className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
					>
						<div className="w-full h-[68px] flex justify-between items-center p-2 !pr-5 ">
							<div className="flex justify-start gap-2">
								<span>
									{!isExternalCalling ? (
										<Icons.Speaker
											defaultSize="w-6 h-6"
											defaultFill={` ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
												? 'text-theme-primary '
												: 'text-gray-300 '}`}
										/>
									) : (
										<Icons.SpeakerLocked
											defaultSize="w-6 h-6"
												defaultFill={` ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
													? 'text-theme-primary '
													: 'text-gray-300 '}`}
										/>
									)}
								</span>
								<p
									className={`text-base font-semibold cursor-default one-line ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
										? 'text-theme-primary '
										: 'text-gray-300 '}`}
								>
									{channelLabel}
								</p>
							</div>
							<div className="flex justify-start gap-4">
								{!isExternalCalling && !propTracks && (
									<div className="relative leading-5 h-5" ref={inboxRef}>
										<button
											title="Inbox"
											className={`focus-visible:outline-none  ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
												? 'text-theme-primary text-theme-primary-hover'
												: 'text-gray-300 hover:text-white'}`}
											onClick={handleShowInbox}
											onContextMenu={(e) => e.preventDefault()}
										>
											<Icons.Inbox defaultSize="size-6" />
											{(currentClan?.badge_count ?? 0) > 0 && <RedDot />}
										</button>
										{isShowInbox && <NotificationList rootRef={inboxRef} />}
									</div>
								)}

								<Tooltip
									showArrow={{ className: '!top-[6px]' }}
									key={+focusTrack}
									placement="bottomRight"
									align={{
										offset: [11, -4]
									}}
									overlay={
										<span className={`${isShowMember ? 'bg-[#2B2B2B]' : 'bg-[#2B2B2B]'} rounded p-[6px] text-[14px]`}>
											{focusTrack ? 'Grid' : 'Focus'}
										</span>
									}
									overlayInnerStyle={{ background: 'none', boxShadow: 'none' }}
									overlayClassName="whitespace-nowrap z-50 !p-0 !pt-4"
									getTooltipContainer={() => document.getElementById('livekitRoom') || document.body}
								>
									<span onClick={toggleViewMode} className="cursor-pointer">
										{focusTrack ? (
											<Icons.VoiceGridIcon
												className={` ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
													? 'text-theme-primary text-theme-primary-hover'
													: 'text-gray-300 hover:text-white'}`}
											/>
										) : (
											<Icons.VoiceFocusIcon
													className={` ${(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
														? 'text-theme-primary text-theme-primary-hover'
														: 'text-gray-300 hover:text-white'}`}
											/>
										)}
									</span>
								</Tooltip>

								<button
									className="relative focus-visible:outline-none"
									title="Chat"
									onClick={onToggleChatBox}
									style={{ marginLeft: 8 }}
								>
									<Icons.Chat
										defaultSize="w-5 h-5"
										defaultFill={(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
											? 'text-theme-primary text-theme-primary-hover'
											: 'text-gray-300 hover:text-white'}
										className={isShowChatVoice ? 'text-white' : 'text-white hover:text-gray-200'}
									/>
								</button>
							</div>
						</div>
					</div>
					<div
						className={`absolute ${isShowMember ? 'bottom-0' : focusTrack ? 'bottom-8' : 'bottom-0'} left-0 w-full transition-opacity duration-300 ${
							isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
						}`}
					>
						<ControlBar
							isExternalCalling={isExternalCalling}
							onLeaveRoom={onLeaveRoom}
							onFullScreen={onFullScreen}
							currentChannel={currentChannel}
							isShowMember={isShowMember}
							isGridView={isGridView}
						/>
					</div>
				</div>
			</LayoutContextProvider>
			<RoomAudioRenderer />
			{!propTracks && <ConnectionStateToast />}
		</div>
	);
}
