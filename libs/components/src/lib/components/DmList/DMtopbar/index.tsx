// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAppParams, useAuth, useMenu } from '@mezon/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
	DMCallActions,
	DirectEntity,
	appActions,
	audioCallActions,
	selectAudioDialTone,
	selectAudioRingTone,
	selectCallerId,
	selectChannelCallId,
	selectCloseMenu,
	selectDmGroupCurrent,
	selectIsInCall,
	selectIsMuteMicrophone,
	selectIsShowMeetDM,
	selectIsShowMemberListDM,
	selectIsShowShareScreen,
	selectIsUseProfileDM,
	selectListOfCalls,
	selectLocalStream,
	selectPeerConnection,
	selectPinMessageByChannelId,
	selectSignalingDataByUserId,
	selectStatusMenu,
	selectTheme,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Icons } from '@mezon/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AvatarImage } from '@mezon/components';
import { createImgproxyUrl, isMacDesktop } from '@mezon/utils';
import { Tooltip } from 'flowbite-react';
import { ChannelStreamMode, ChannelType, WebrtcSignalingType } from 'mezon-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { HelpButton } from '../../ChannelTopbar';
import PinnedMessages from '../../ChannelTopbar/TopBarComponents/PinnedMessages';
import { MemberProfile } from '../../MemberProfile';
import SearchMessageChannel from '../../SearchMessageChannel';
import CreateMessageGroup from '../CreateMessageGroup';
import LabelDm from './labelDm';

export type ChannelTopbarProps = {
	readonly dmGroupId?: Readonly<string>;
};

// Todo: move to utils
const compress = async (str: string, encoding = 'gzip' as CompressionFormat) => {
	const byteArray = new TextEncoder().encode(str);
	const cs = new CompressionStream(encoding);
	const writer = cs.writable.getWriter();
	writer.write(byteArray);
	writer.close();
	const arrayBuffer = await new Response(cs.readable).arrayBuffer();
	return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};

// Todo: move to utils
const decompress = async (compressedStr: string, encoding = 'gzip' as CompressionFormat) => {
	const binaryString = atob(compressedStr);
	const byteArray = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		byteArray[i] = binaryString.charCodeAt(i);
	}

	const cs = new DecompressionStream(encoding);
	const writer = cs.writable.getWriter();
	writer.write(byteArray);
	writer.close();

	const arrayBuffer = await new Response(cs.readable).arrayBuffer();
	return new TextDecoder().decode(arrayBuffer);
};

function DmTopbar({ dmGroupId }: ChannelTopbarProps) {
	const dispatch = useAppDispatch();
	const currentDmGroup = useSelector(selectDmGroupCurrent(dmGroupId ?? ''));
	const { setStatusMenu } = useMenu();
	const closeMenu = useSelector(selectCloseMenu);
	const statusMenu = useSelector(selectStatusMenu);
	const isShowMemberListDM = useSelector(selectIsShowMemberListDM);
	const appearanceTheme = useSelector(selectTheme);
	const isUseProfileDM = useSelector(selectIsUseProfileDM);
	const listOfCalls = useSelector(selectListOfCalls) ?? [];
	const channelCallId = useSelector(selectChannelCallId) ?? [];
	const avatarImages = currentDmGroup?.channel_avatar || [];
	const isMuteMicrophone = useSelector(selectIsMuteMicrophone);
	const isShowShareScreen = useSelector(selectIsShowShareScreen);
	const isShowMeetDM = useSelector(selectIsShowMeetDM);
	const callerId = useSelector(selectCallerId);
	const localStream = useSelector(selectLocalStream);
	const peerConnection = useSelector(selectPeerConnection);
	const isInCall = useSelector(selectIsInCall);
	const { userId } = useAuth();
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userId || ''));

	const isInChannelCalled = useMemo(() => {
		return currentDmGroup?.user_id?.some((i) => i === signalingData?.[0]?.callerId);
	}, [currentDmGroup?.user_id, signalingData]);

	const setIsUseProfileDM = useCallback(
		async (status: boolean) => {
			await dispatch(appActions.setIsUseProfileDM(status));
		},
		[dispatch]
	);

	function createPeerConnection() {
		return new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19305' }] });
	}

	useEffect(() => {
		if (!peerConnection && isInChannelCalled) {
			dispatch(DMCallActions.setPeerConnection(createPeerConnection()));
		}
	}, [dispatch, isInChannelCalled, peerConnection]);

	const setIsShowMemberListDM = useCallback(
		async (status: boolean) => {
			await dispatch(appActions.setIsShowMemberListDM(status));
		},
		[dispatch]
	);

	const handleShowShareScreenToggle = () => {
		dispatch(DMCallActions.setIsShowShareScreen(!isShowShareScreen));
	};
	const handleShowMeetDm = () => {
		if (localStream) localStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
		dispatch(DMCallActions.setIsShowMeetDM(!isShowMeetDM));
	};
	const handleMuteToggle = () => {
		if (localStream) {
			if (localStream) localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
		}

		dispatch(DMCallActions.setIsMuteMicrophone(!isMuteMicrophone));
	};
	const dmUserId = currentDmGroup?.user_id && currentDmGroup.user_id.length > 0 ? currentDmGroup?.user_id[0] : '';
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const mezon = useMezon();
	const isPlayDialTone = useSelector(selectAudioDialTone);
	const isPlayRingTone = useSelector(selectAudioRingTone);

	const endCall = useCallback(async () => {
		const user = userId || '';
		const updatedCalls = { ...listOfCalls };
		if (updatedCalls[user]) {
			updatedCalls[user] = updatedCalls[user].filter((id) => id !== dmGroupId);
		}

		await dispatch(
			DMCallActions.setListOfCalls({
				userId: user,
				event: updatedCalls
			})
		);
	}, [dispatch, listOfCalls, dmGroupId]);

	const handleEndCall = async () => {
		await dispatch(audioCallActions.setIsDialTone(false));
		await dispatch(DMCallActions.setIsInCall(false));
		await dispatch(DMCallActions.removeAll());
		if (localStream) {
			localStream.getTracks().forEach((track) => track.stop());
			dispatch(DMCallActions.setLocalStream(null));
			peerConnection.getSenders().forEach((sender) => {
				if (peerConnection) peerConnection.removeTrack(sender);
			});

			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = null;
			}

			await mezon.socketRef.current?.forwardWebrtcSignaling(dmUserId, 0, '', dmGroupId ?? '', userId ?? '');
			if (
				signalingData?.[signalingData?.length - 1]?.signalingData.data_type === 0 &&
				signalingData?.[signalingData?.length - 1]?.signalingData.json_data === ''
			) {
				endCall();
				await mezon.socketRef.current?.forwardWebrtcSignaling(dmUserId, 4, '', dmGroupId ?? '', userId ?? '');
				peerConnection.close();
				dispatch(DMCallActions.setPeerConnection(createPeerConnection()));
			}
			dispatch(DMCallActions.setChannelCallId(''));
		}
	};
	const setListOfCalls = useCallback(
		async (dmGroupId: string, isVideoCall = false) => {
			// dispatch(audioCallActions.setIsDialTone(true));

			startCall({ isVideoCall });
			await dispatch(DMCallActions.setCallerId(userId));
			await dispatch(DMCallActions.setCalleeId(dmUserId));

			const updatedCalls = JSON.parse(JSON.stringify(listOfCalls));

			if (!updatedCalls[userId || '']) {
				updatedCalls[userId || ''] = [];
			}
			updatedCalls[userId || ''].push(dmGroupId);

			await dispatch(
				DMCallActions.setListOfCalls({
					userId: userId || '',
					event: updatedCalls
				})
			);
		},
		[dispatch, listOfCalls, userId, dmUserId]
	);

	useEffect(() => {
		if (signalingData?.[signalingData?.length - 1] && isInCall && isInChannelCalled) {
			peerConnection.onicecandidate = async (event: any) => {
				if (event && event.candidate) {
					if (mezon.socketRef.current?.isOpen() === true) {
						await mezon.socketRef.current?.forwardWebrtcSignaling(
							dmUserId,
							WebrtcSignalingType.WEBRTC_ICE_CANDIDATE,
							JSON.stringify(event.candidate),
							dmGroupId ?? '',
							userId ?? ''
						);
					}
				}
			};

			peerConnection.ontrack = (event: any) => {
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = event.streams[0];
				}
			};

			const data = signalingData?.[signalingData?.length - 1]?.signalingData;

			switch (signalingData?.[signalingData?.length - 1]?.signalingData.data_type) {
				case WebrtcSignalingType.WEBRTC_SDP_OFFER:
					{
						const processData = async () => {
							const dataDec = await decompress(data?.json_data);
							const objData = JSON.parse(dataDec || '{}');

							await peerConnection.setRemoteDescription(new RTCSessionDescription(objData));
							const answer = await peerConnection.createAnswer();
							await peerConnection.setLocalDescription(answer);

							const answerEn = await compress(JSON.stringify(answer));
							await mezon.socketRef.current?.forwardWebrtcSignaling(
								dmUserId,
								WebrtcSignalingType.WEBRTC_SDP_ANSWER,
								answerEn,
								dmGroupId ?? '',
								userId ?? ''
							);
						};
						processData().catch(console.error);
					}

					break;
				case WebrtcSignalingType.WEBRTC_SDP_ANSWER:
					{
						const processData = async () => {
							const dataDec = await decompress(data.json_data);
							const objData = JSON.parse(dataDec || '{}');
							await peerConnection.setRemoteDescription(new RTCSessionDescription(objData));
						};
						processData().catch(console.error);
					}
					break;
				case WebrtcSignalingType.WEBRTC_ICE_CANDIDATE:
					{
						const processData = async () => {
							const objData = JSON.parse(data?.json_data || '{}');
							await peerConnection.addIceCandidate(new RTCIceCandidate(objData));
						};
						processData().catch(console.error);
					}
					break;
				default:
					break;
			}
		}
	}, [mezon.socketRef, peerConnection, signalingData, channelCallId, isInCall, dmUserId, dmGroupId, userId, isInChannelCalled]);

	const startCall = async ({ isVideoCall = false }) => {
		let newPeerConnection = peerConnection;

		if (peerConnection.connectionState === 'closed') {
			newPeerConnection = createPeerConnection();
		}

		await dispatch(DMCallActions.setIsInCall(true));
		await dispatch(DMCallActions.setCallerId(userId));
		await dispatch(DMCallActions.setChannelCallId(dmGroupId));

		if (isPlayRingTone) {
			dispatch(audioCallActions.setIsRingTone(false));
		}
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(async (stream) => {
				dispatch(DMCallActions.setLocalStream(stream));
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
				stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
				const audioTrack = stream.getAudioTracks()[0];
				if (audioTrack) {
					dispatch(DMCallActions.setIsMuteMicrophone(!audioTrack.enabled));
				}

				if (!isVideoCall) {
					stream.getVideoTracks().forEach((track) => (track.enabled = false));
					dispatch(DMCallActions.setIsShowMeetDM(false));
				}
				const offer = await peerConnection.createOffer({
					iceRestart: true,
					offerToReceiveAudio: true,
					offerToReceiveVideo: true
				});
				await peerConnection.setLocalDescription(offer);
				if (offer && mezon.socketRef.current) {
					const offerEn = await compress(JSON.stringify(offer));
					await mezon.socketRef.current?.forwardWebrtcSignaling(
						dmUserId,
						WebrtcSignalingType.WEBRTC_SDP_OFFER,
						offerEn,
						dmGroupId ?? '',
						userId ?? ''
					);
				}
			})
			.catch((err) => console.error('Failed to get local media:', err));
	};

	const handleCloseCall = async () => {
		await mezon.socketRef.current?.forwardWebrtcSignaling(dmUserId, 4, '', dmGroupId ?? '', userId ?? '');
		await dispatch(audioCallActions.setIsDialTone(false));
		await dispatch(audioCallActions.setIsRingTone(false));
		await dispatch(DMCallActions.setIsInCall(false));
		await dispatch(DMCallActions.removeAll());
	};

	return (
		<>
			{!isInCall && !isInChannelCalled ? (
				<div
					className={`flex h-heightTopBar p-3 min-w-0 items-center dark:bg-bgPrimary bg-bgLightPrimary shadow border-b-[1px] dark:border-bgTertiary border-bgLightTertiary flex-shrink ${isMacDesktop ? 'draggable-area' : ''}`}
				>
					<div className="sbm:justify-start justify-between items-center gap-1 flex w-full">
						<div className="flex flex-row gap-1 items-center flex-1">
							<div onClick={() => setStatusMenu(true)} className={`mx-6 ${closeMenu && !statusMenu ? '' : 'hidden'}`} role="button">
								<Icons.OpenMenu defaultSize={`w-5 h-5`} />
							</div>
							<MemberProfile
								numberCharacterCollapse={22}
								avatar={
									Number(currentDmGroup?.type) === ChannelType.CHANNEL_TYPE_GROUP
										? 'assets/images/avatar-group.png'
										: (currentDmGroup?.channel_avatar?.at(0) ?? '')
								}
								name={currentDmGroup?.usernames || `${currentDmGroup?.creator_name}'s Group`}
								status={{ status: currentDmGroup?.is_online?.some(Boolean), isMobile: false }}
								isHideStatus={true}
								isHideIconStatus={Boolean(currentDmGroup?.user_id && currentDmGroup.user_id.length >= 2)}
								key={currentDmGroup?.channel_id}
								isHiddenAvatarPanel={true}
							/>
							<LabelDm dmGroupId={dmGroupId || ''} currentDmGroup={currentDmGroup} />
						</div>

						<div className=" items-center h-full ml-auto hidden justify-end ssm:flex">
							<div className=" items-center gap-2 flex">
								<div className="justify-start items-center gap-[15px] flex">
									<button onClick={() => setListOfCalls(dmGroupId ?? '')}>
										<Tooltip
											content="Start voice call"
											trigger="hover"
											animation="duration-500"
											style={appearanceTheme === 'light' ? 'light' : 'dark'}
										>
											<Icons.IconPhoneDM
												className={`dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode`}
											/>
										</Tooltip>
									</button>
									<button onClick={() => setListOfCalls(dmGroupId ?? '', true)}>
										<Tooltip
											content="Start Video Call"
											trigger="hover"
											animation="duration-500"
											style={appearanceTheme === 'light' ? 'light' : 'dark'}
										>
											<Icons.IconMeetDM
												className={`dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode`}
											/>
										</Tooltip>
									</button>
									<div>
										<PinButton isLightMode={appearanceTheme === 'light'} />
									</div>
									<AddMemberToGroupDm currentDmGroup={currentDmGroup} appearanceTheme={appearanceTheme} />
									{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_GROUP && (
										<button onClick={() => setIsShowMemberListDM(!isShowMemberListDM)}>
											<Tooltip
												content="Show Member List"
												trigger="hover"
												animation="duration-500"
												style={appearanceTheme === 'light' ? 'light' : 'dark'}
											>
												<Icons.MemberList isWhite={isShowMemberListDM} />
											</Tooltip>
										</button>
									)}
									{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM && (
										<button onClick={() => setIsUseProfileDM(!isUseProfileDM)}>
											<Tooltip
												content="Show User Profile"
												trigger="hover"
												animation="duration-500"
												style={appearanceTheme === 'light' ? 'light' : 'dark'}
											>
												<Icons.IconUserProfileDM isWhite={isUseProfileDM} />
											</Tooltip>
										</button>
									)}
								</div>
								<SearchMessageChannel
									mode={
										currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM
											? ChannelStreamMode.STREAM_MODE_DM
											: ChannelStreamMode.STREAM_MODE_GROUP
									}
								/>
								<div
									className={`gap-4 relative flex  w-fit h-8 justify-center items-center left-[345px] ssm:left-auto ssm:right-0`}
									id="inBox"
								>
									{/* <InboxButton /> */}
									<HelpButton />
								</div>
							</div>
						</div>
						{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_GROUP && (
							<button onClick={() => setIsShowMemberListDM(!isShowMemberListDM)} className="sbm:hidden">
								<Tooltip
									content="Show Member List"
									trigger="hover"
									animation="duration-500"
									style={appearanceTheme === 'light' ? 'light' : 'dark'}
								>
									<Icons.MemberList isWhite={isShowMemberListDM} />
								</Tooltip>
							</button>
						)}
						{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM && (
							<button onClick={() => setIsUseProfileDM(!isUseProfileDM)} className="sbm:hidden">
								<Tooltip
									content="Show User Profile"
									trigger="hover"
									animation="duration-500"
									style={appearanceTheme === 'light' ? 'light' : 'dark'}
								>
									<Icons.IconUserProfileDM isWhite={isUseProfileDM} />
								</Tooltip>
							</button>
						)}
					</div>
				</div>
			) : (
				<div
					className={`flex flex-col min-h-[240px] z-10 relative w-full h-heightTopBar p-3 min-w-0 items-center dark:bg-bgTertiary bg-bgLightPrimary shadow border-b-[1px] dark:border-bgTertiary border-bgLightTertiary flex-shrink ${isMacDesktop ? 'draggable-area' : ''}`}
				>
					<div className="sbm:justify-start justify-between items-center gap-1 flex w-full">
						<div className="flex flex-row gap-1 items-center flex-1">
							<div onClick={() => setStatusMenu(true)} className={`mx-6 ${closeMenu && !statusMenu ? '' : 'hidden'}`} role="button">
								<Icons.OpenMenu defaultSize={`w-5 h-5`} />
							</div>
							<MemberProfile
								numberCharacterCollapse={22}
								avatar={
									Number(currentDmGroup?.type) === ChannelType.CHANNEL_TYPE_GROUP
										? 'assets/images/avatar-group.png'
										: (currentDmGroup?.channel_avatar?.at(0) ?? '')
								}
								name={currentDmGroup?.usernames || `${currentDmGroup?.creator_name}'s Group`}
								status={{ status: currentDmGroup?.is_online?.some(Boolean), isMobile: false }}
								isHideStatus={true}
								isHideIconStatus={Boolean(currentDmGroup?.user_id && currentDmGroup.user_id.length >= 2)}
								key={currentDmGroup?.channel_id}
								isHiddenAvatarPanel={true}
							/>
							<LabelDm dmGroupId={dmGroupId || ''} currentDmGroup={currentDmGroup} />
						</div>

						<div className=" items-center h-full ml-auto hidden justify-end ssm:flex">
							<div className=" items-center gap-2 flex">
								<div className="justify-start items-center gap-[15px] flex">
									<div>
										<PinButton isLightMode={appearanceTheme === 'light'} />
									</div>
									<AddMemberToGroupDm currentDmGroup={currentDmGroup} appearanceTheme={appearanceTheme} />
									{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_GROUP && (
										<button onClick={() => setIsShowMemberListDM(!isShowMemberListDM)}>
											<Tooltip
												content="Show Member List"
												trigger="hover"
												animation="duration-500"
												style={appearanceTheme === 'light' ? 'light' : 'dark'}
											>
												<Icons.MemberList isWhite={isShowMemberListDM} />
											</Tooltip>
										</button>
									)}
									{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM && (
										<button onClick={() => setIsUseProfileDM(!isUseProfileDM)}>
											<Tooltip
												content="Show User Profile"
												trigger="hover"
												animation="duration-500"
												style={appearanceTheme === 'light' ? 'light' : 'dark'}
											>
												<Icons.IconUserProfileDM isWhite={isUseProfileDM} />
											</Tooltip>
										</button>
									)}
								</div>
								<SearchMessageChannel
									mode={
										currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM
											? ChannelStreamMode.STREAM_MODE_DM
											: ChannelStreamMode.STREAM_MODE_GROUP
									}
								/>
								<div
									className={`gap-4 relative flex  w-fit h-8 justify-center items-center left-[345px] ssm:left-auto ssm:right-0`}
									id="inBox"
								>
									{/* <InboxButton /> */}
									<HelpButton />
								</div>
							</div>
						</div>
						{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_GROUP && (
							<button onClick={() => setIsShowMemberListDM(!isShowMemberListDM)} className="sbm:hidden">
								<Tooltip
									content="Show Member List"
									trigger="hover"
									animation="duration-500"
									style={appearanceTheme === 'light' ? 'light' : 'dark'}
								>
									<Icons.MemberList isWhite={isShowMemberListDM} />
								</Tooltip>
							</button>
						)}
						{currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM && (
							<button onClick={() => setIsUseProfileDM(!isUseProfileDM)} className="sbm:hidden">
								<Tooltip
									content="Show User Profile"
									trigger="hover"
									animation="duration-500"
									style={appearanceTheme === 'light' ? 'light' : 'dark'}
								>
									<Icons.IconUserProfileDM isWhite={isUseProfileDM} />
								</Tooltip>
							</button>
						)}
					</div>
					<div className="w-full h-full flex flex-col justify-around">
						<div className="justify-center items-center gap-4 flex w-full">
							{avatarImages.map((avatar, index) => (
								<AvatarImage
									height={'75px'}
									alt={`Avatar ${index + 1}`}
									userName={`Avatar ${index + 1}`}
									className="min-w-[75px] min-h-[75px] max-w-[75px] max-h-[75px] font-semibold"
									srcImgProxy={createImgproxyUrl(avatar ?? '', { width: 300, height: 300, resizeType: 'fit' })}
									src={avatar}
									classNameText="!text-4xl font-semibold"
								/>
							))}
						</div>
						<div className="justify-center items-center gap-4 flex w-full">
							{(callerId === '' || channelCallId !== dmGroupId) && (
								<>
									<div
										className={`h-[56px] w-[56px] rounded-full bg-green-500 hover:bg-green-700 flex items-center justify-center cursor-pointer`}
										onClick={() => startCall({ isVideoCall: true })}
									>
										<Icons.IconMeetDM />
									</div>
									<div
										className={`h-[56px] w-[56px] rounded-full bg-green-500 hover:bg-green-700 flex items-center justify-center cursor-pointer`}
										onClick={() => startCall({ isVideoCall: false })}
									>
										<Icons.IconPhoneDM />
									</div>
									<div
										onClick={handleCloseCall}
										className={`h-[56px] w-[56px] rounded-full bg-red-500 hover:bg-red-700 flex items-center justify-center cursor-pointer`}
									>
										<Icons.CloseButton className={`w-[20px]`} />
									</div>
								</>
							)}
							{callerId === userId && channelCallId === dmGroupId && (
								<div className="h-[556px] ">
									<div className="flex justify-between space-x-4">
										<>
											{/* Local Video */}
											<video
												ref={localVideoRef}
												autoPlay
												muted
												playsInline
												style={{
													width: '400px',
													height: '300px',
													backgroundColor: 'black',
													borderRadius: '8px'
												}}
											/>
											{/* Remote Video */}
											<video
												ref={remoteVideoRef}
												autoPlay
												playsInline
												style={{
													width: '400px',
													height: '300px',
													backgroundColor: 'black',
													borderRadius: '8px'
												}}
											/>
										</>
									</div>
									<div className="flex flex-row space-x-4 justify-center">
										<div
											className={`h-[56px] w-[56px] rounded-full flex items-center justify-center cursor-pointer  ${isShowShareScreen ? 'dark:bg-bgSecondary bg-bgLightMode dark:hover:bg-neutral-400 hover:bg-neutral-400' : 'dark:bg-bgLightMode dark:hover:bg-neutral-400 bg-neutral-500 hover:bg-bgSecondary'}`}
											onClick={handleShowMeetDm}
										>
											<Icons.IconMeetDM
												className={`${isShowMeetDM ? 'text-bgPrimary dark:text-white' : 'text-white dark:text-bgTertiary'}`}
												isShowMeetDM={isShowMeetDM}
												isShowLine={true}
											/>
										</div>
										<div
											className={`h-[56px] w-[56px] rounded-full flex items-center justify-center cursor-pointer  ${isShowShareScreen ? 'dark:bg-bgSecondary bg-bgLightMode dark:hover:bg-neutral-400 hover:bg-neutral-400' : 'dark:bg-bgLightMode dark:hover:bg-neutral-400 bg-neutral-500 hover:bg-bgSecondary'}`}
											onClick={handleShowShareScreenToggle}
										>
											<Icons.ShareScreen
												className={`${isShowShareScreen ? 'text-bgPrimary dark:text-white' : 'text-white dark:text-bgTertiary'}`}
												isShowShareScreen={isShowShareScreen}
												isShowLine={true}
											/>
										</div>
										<div
											className={`h-[56px] w-[56px] rounded-full flex items-center justify-center cursor-pointer ${isMuteMicrophone ? 'dark:bg-bgSecondary bg-bgLightMode dark:hover:bg-neutral-400 hover:bg-neutral-400' : 'dark:bg-bgLightMode dark:hover:bg-neutral-400 bg-neutral-500 hover:bg-bgSecondary'}`}
											onClick={handleMuteToggle}
										>
											<Icons.Microphone
												className={`${isMuteMicrophone ? 'text-bgPrimary dark:text-white' : 'text-white dark:text-bgTertiary'}`}
												isMuteMicrophone={isMuteMicrophone}
												isShowLine={true}
											/>
										</div>
										<div
											className={`h-[56px] w-[56px] rounded-full bg-red-500 hover:bg-red-700 flex items-center justify-center cursor-pointer`}
											onClick={handleEndCall}
										>
											<Icons.StopCall />
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function PinButton({ isLightMode }: { isLightMode: boolean }) {
	const [isShowPinMessage, setIsShowPinMessage] = useState<boolean>(false);
	const threadRef = useRef<HTMLDivElement>(null);

	const handleShowPinMessage = () => {
		setIsShowPinMessage(!isShowPinMessage);
	};

	const handleClose = useCallback(() => {
		setIsShowPinMessage(false);
	}, []);

	const { directId } = useAppParams();
	const pinMsgs = useSelector(selectPinMessageByChannelId(directId));

	return (
		<div className="relative leading-5 size-6" ref={threadRef}>
			<Tooltip
				className={`${isShowPinMessage && 'hidden'} w-[142px]`}
				content="Pinned Messages"
				trigger="hover"
				animation="duration-500"
				style={isLightMode ? 'light' : 'dark'}
			>
				<button className="focus-visible:outline-none" onClick={handleShowPinMessage} onContextMenu={(e) => e.preventDefault()}>
					<Icons.PinRight isWhite={isShowPinMessage} />
				</button>
				{pinMsgs?.length > 0 && (
					<span className="w-[10px] h-[10px] rounded-full bg-[#DA373C] absolute bottom-0 right-[3px] border-[1px] border-solid dark:border-bgPrimary border-white"></span>
				)}
			</Tooltip>
			{isShowPinMessage && <PinnedMessages onClose={handleClose} rootRef={threadRef} />}
		</div>
	);
}

const AddMemberToGroupDm = ({ currentDmGroup, appearanceTheme }: { currentDmGroup: DirectEntity; appearanceTheme: string }) => {
	const [openAddToGroup, setOpenAddToGroup] = useState<boolean>(false);
	const handleOpenAddToGroupModal = () => {
		setOpenAddToGroup(!openAddToGroup);
	};
	const rootRef = useRef<HTMLDivElement>(null);
	return (
		<div onClick={handleOpenAddToGroupModal} ref={rootRef} className="cursor-pointer">
			{openAddToGroup && (
				<div className="relative top-4">
					<CreateMessageGroup
						currentDM={currentDmGroup}
						isOpen={openAddToGroup}
						onClose={handleOpenAddToGroupModal}
						classNames="right-0 left-auto"
						rootRef={rootRef}
					/>
				</div>
			)}
			<Tooltip content="Add friends to DM" trigger="hover" animation="duration-500" style={appearanceTheme === 'light' ? 'light' : 'dark'}>
				<Icons.IconAddFriendDM />
			</Tooltip>
		</div>
	);
};

DmTopbar.Skeleton = () => {
	return (
		<div className="flex  h-heightTopBar min-w-0 items-center bg-bgSecondary border-b border-black px-3 pt-4 pb-6 flex-shrink">
			<Skeleton width={38} height={38} />
		</div>
	);
};

export default DmTopbar;
