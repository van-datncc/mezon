import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';

import { MyVideoConference, PreJoinVoiceChannel } from '@mezon/components';
import { EmojiSuggestionProvider, useAppParams, useAuth } from '@mezon/core';
import {
	appActions,
	channelsActions,
	generateMeetToken,
	getStoreAsync,
	handleParticipantVoiceState,
	selectCurrentChannel,
	selectCurrentClan,
	selectIsShowChatStream,
	selectIsShowSettingFooter,
	selectShowCamera,
	selectShowMicrophone,
	selectShowModelEvent,
	selectStatusMenu,
	selectTokenJoinVoice,
	selectVoiceFullScreen,
	selectVoiceInfo,
	selectVoiceJoined,
	selectVoiceOpenPopOut,
	useAppDispatch,
	useAppSelector,
	voiceActions
} from '@mezon/store';

import { ParticipantMeetState, isLinuxDesktop, isWindowsDesktop } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ChatStream from '../chatStream';

const ChannelVoice = memo(
	() => {
		const isJoined = useAppSelector(selectVoiceJoined);
		const token = useAppSelector(selectTokenJoinVoice);
		const voiceInfo = useAppSelector(selectVoiceInfo);
		const [loading, setLoading] = useState<boolean>(false);
		const [showJoinConfirm, setShowJoinConfirm] = useState(false);
		const dispatch = useAppDispatch();
		const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;
		const showMicrophone = useAppSelector(selectShowMicrophone);
		const showCamera = useAppSelector(selectShowCamera);
		const isVoiceFullScreen = useAppSelector(selectVoiceFullScreen);
		const isShowChatStream = useAppSelector(selectIsShowChatStream);
		const currentChannel = useAppSelector(selectCurrentChannel);
		const isChannelMezonVoice = currentChannel?.type === ChannelType.CHANNEL_TYPE_MEZON_VOICE;
		const containerRef = useRef<HTMLDivElement | null>(null);
		const isShowSettingFooter = useAppSelector(selectIsShowSettingFooter);
		const showModalEvent = useAppSelector(selectShowModelEvent);
		const { channelId } = useAppParams();
		const isOpenPopOut = useAppSelector(selectVoiceOpenPopOut);
		const isOnMenu = useAppSelector(selectStatusMenu);
		const { userProfile } = useAuth();

		const participantMeetState = async (state: ParticipantMeetState, clanId?: string, channelId?: string): Promise<void> => {
			if (!clanId || !channelId || !userProfile?.user?.id) return;

			await dispatch(
				handleParticipantVoiceState({
					clan_id: clanId,
					channel_id: channelId,
					display_name: userProfile?.user?.display_name ?? '',
					state
				})
			);
		};

		const handleJoinRoom = async () => {
			dispatch(voiceActions.setOpenPopOut(false));
			const store = await getStoreAsync();
			const currentClan = selectCurrentClan(store.getState());
			if (!currentClan || !currentChannel?.meeting_code) return;
			setLoading(true);

			try {
				const result = await dispatch(
					generateMeetToken({
						channelId: currentChannel?.channel_id as string,
						roomName: currentChannel?.meeting_code
					})
				).unwrap();

				if (result) {
					if (isJoined && voiceInfo) {
						handleLeaveRoom();
					}
					await dispatch(
						channelsActions.joinChannel({

							clanId: currentChannel?.clan_id as string,
							channelId: currentChannel?.channel_id as string,
							noFetchMembers: false,


						})
					),
						await dispatch(channelsActions.joinChat({
							clanId: currentChannel?.clan_id as string,
							channelId: currentChannel?.channel_id as string,
							channelType: ChannelType.CHANNEL_TYPE_MEZON_VOICE,
							isPublic: currentChannel?.channel_private === 0,
						})

						);
					await participantMeetState(ParticipantMeetState.JOIN, currentChannel?.clan_id as string, currentChannel?.channel_id as string);
					dispatch(voiceActions.setJoined(true));
					dispatch(voiceActions.setToken(result));
					dispatch(
						voiceActions.setVoiceInfo({
							clanId: currentClan?.clan_id as string,
							clanName: currentClan?.clan_name as string,
							channelId: currentChannel?.channel_id as string,
							channelLabel: currentChannel?.channel_label as string
						})
					);
				} else {
					dispatch(voiceActions.setToken(''));
				}
			} catch (err) {
				console.error('Failed to generate token room:', err);
				dispatch(voiceActions.setToken(''));
			} finally {
				setLoading(false);
			}
		};

		const handleLeaveRoom = useCallback(async () => {
			if (!voiceInfo?.clanId || !voiceInfo?.channelId) return;
			dispatch(voiceActions.resetVoiceSettings());
			await participantMeetState(ParticipantMeetState.LEAVE, voiceInfo.clanId, voiceInfo.channelId);
		}, [dispatch, voiceInfo]);

		const handleFullScreen = useCallback(() => {
			if (!containerRef.current) return;

			if (!document.fullscreenElement) {
				containerRef.current
					.requestFullscreen()
					.then(() => dispatch(voiceActions.setFullScreen(true)))
					.catch((err) => {
						console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
					});
			} else {
				document.exitFullscreen().then(() => dispatch(voiceActions.setFullScreen(false)));
			}
		}, [dispatch]);

		useEffect(() => {
			const handleFullscreenChange = () => {
				if (!document.fullscreenElement) {
					dispatch(voiceActions.setFullScreen(false));
				}
			};

			document.addEventListener('fullscreenchange', handleFullscreenChange);
			return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
		}, [dispatch]);
		const isShow = isJoined && voiceInfo?.clanId === currentChannel?.clan_id && voiceInfo?.channelId === currentChannel?.channel_id;
		useEffect(() => {
			if (isShow) {
				setShowJoinConfirm(true);
				const timer = setTimeout(() => setShowJoinConfirm(false), 2000);
				return () => clearTimeout(timer);
			}
		}, [isShow]);



		const toggleChat = () => {
			dispatch(appActions.setIsShowChatStream(!isShowChatStream));
		};

		return (
			<>
				<div
					className={`${!isChannelMezonVoice || showModalEvent || isShowSettingFooter?.status || !channelId ? 'hidden' : ''} absolute ${isWindowsDesktop || isLinuxDesktop ? 'bottom-[21px]' : 'bottom-0'} right-0 ${!isOnMenu ? ' max-sbm:left-0 max-sbm:!w-full max-sbm:!h-[calc(100%_-_50px)]' : ''} z-30`}
					style={{ width: 'calc(100% - 72px - 272px)', height: isWindowsDesktop || isLinuxDesktop ? 'calc(100% - 21px)' : '100%' }}
				>
					{token === '' || !serverUrl ? (
						<PreJoinVoiceChannel
							channel={currentChannel || undefined}
							roomName={currentChannel?.meeting_code}
							loading={loading}
							handleJoinRoom={handleJoinRoom}
						/>
					) : (
						<>
							<PreJoinVoiceChannel
								channel={currentChannel || undefined}
								roomName={currentChannel?.meeting_code}
								loading={loading}
								handleJoinRoom={handleJoinRoom}
								isCurrentChannel={isShow}
							/>

							<LiveKitRoom
								ref={containerRef}
								id="livekitRoom"
								key={token}
								className={`${!isShow || isOpenPopOut ? '!hidden' : ''} ${isVoiceFullScreen ? '!fixed !inset-0 !z-50 !w-screen !h-screen' : ''} flex`}
								audio={showMicrophone}
								video={showCamera}
								token={token}
								serverUrl={serverUrl}
								data-lk-theme="default"
							>
								<div className="flex-1 relative flex">
									<MyVideoConference
										channelLabel={currentChannel?.channel_label as string}
										onLeaveRoom={handleLeaveRoom}
										onFullScreen={handleFullScreen}
										isShowChatStream={isShowChatStream}
										onToggleChat={toggleChat}
										currentChannel={currentChannel}
									/>
									<EmojiSuggestionProvider>
										{isShowChatStream && (
											<div className=" h-100vh w-[400px] border-l border-border dark:border-bgTertiary z-40 bg-bgPrimary flex-shrink-0">
												<ChatStream currentChannel={currentChannel} />
											</div>
										)}</EmojiSuggestionProvider>
								</div>

							</LiveKitRoom>
							{isOpenPopOut && (
								<div className="flex items-center justify-center h-full w-full text-center text-lg font-semibold text-gray-500">
									You are currently in the popout window
								</div>
							)}
						</>
					)}
				</div>
			</>
		);
	},
	() => true
);

export default ChannelVoice;
