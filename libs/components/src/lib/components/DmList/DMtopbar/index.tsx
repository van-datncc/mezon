// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAppParams, useAuth, useMenu } from '@mezon/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
	DirectEntity,
	appActions,
	audioCallActions,
	selectCloseMenu,
	selectDmGroupCurrent,
	selectIsShowMemberListDM,
	selectIsUseProfileDM,
	selectJoinPTTByChannelId,
	selectPinMessageByChannelId,
	selectStatusMenu,
	selectTheme,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Icons } from '@mezon/ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useMezon } from '@mezon/transport';
import { isMacDesktop } from '@mezon/utils';
import { Tooltip } from 'flowbite-react';
import { ChannelStreamMode, ChannelType, WebrtcSignalingType } from 'mezon-js';
import { useCallback, useEffect, useRef, useState } from 'react';
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
	isHaveCallInChannel?: boolean;
};

// Todo: move to utils
export const compress = async (str: string, encoding = 'gzip' as CompressionFormat) => {
	const byteArray = new TextEncoder().encode(str);
	const cs = new CompressionStream(encoding);
	const writer = cs.writable.getWriter();
	writer.write(byteArray);
	writer.close();
	const arrayBuffer = await new Response(cs.readable).arrayBuffer();
	return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};

// Todo: move to utils
export const decompress = async (compressedStr: string, encoding = 'gzip' as CompressionFormat) => {
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

function DmTopbar({ dmGroupId, isHaveCallInChannel = false }: ChannelTopbarProps) {
	const dispatch = useAppDispatch();
	const currentDmGroup = useSelector(selectDmGroupCurrent(dmGroupId ?? ''));
	const { setStatusMenu } = useMenu();
	const closeMenu = useSelector(selectCloseMenu);
	const statusMenu = useSelector(selectStatusMenu);
	const isShowMemberListDM = useSelector(selectIsShowMemberListDM);
	const appearanceTheme = useSelector(selectTheme);
	const isUseProfileDM = useSelector(selectIsUseProfileDM);
	// const dmCallingRef = useRef<{ triggerCall: (isVideoCall?: boolean) => void }>(null);

	const setIsUseProfileDM = useCallback(
		async (status: boolean) => {
			await dispatch(appActions.setIsUseProfileDM(status));
		},
		[dispatch]
	);

	const setIsShowMemberListDM = useCallback(
		async (status: boolean) => {
			await dispatch(appActions.setIsShowMemberListDM(status));
		},
		[dispatch]
	);

	const handleStartCall = (isVideoCall = false) => {
		dispatch(audioCallActions.startDmCall({ groupId: dmGroupId, isVideo: isVideoCall }));
		dispatch(audioCallActions.setGroupCallId(dmGroupId));
	};

	return (
		<>
			{/* {!isHaveCallInChannel && ( */}
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
								<button onClick={() => handleStartCall()}>
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
								<button onClick={() => handleStartCall(true)}>
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
			{/* )
			} */}
			{/* <DmCalling ref={dmCallingRef} dmGroupId={dmGroupId} /> */}
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

function PTTButton({ isLightMode, channelId }: { isLightMode: boolean; channelId: string }) {
	const [isShow, setIsShow] = useState<boolean>(false);
	const [isJoined, setIsJoined] = useState<boolean>(false);
	const threadRef = useRef<HTMLDivElement>(null);
	const remoteAudioRef = useRef<HTMLAudioElement>(null);
	const mezon = useMezon();
	const { userId } = useAuth();
	const joinPTTData = useAppSelector((state) => selectJoinPTTByChannelId(state, userId));
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
	const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null);
	const [isTalking, setIsTalking] = useState(false);

	useEffect(() => {
		if (!peerConnection) return;

		peerConnection.onicecandidate = async (event: any) => {
			if (event && event.candidate) {
				if (mezon.socketRef.current?.isOpen() === true) {
					await mezon.socketRef.current?.joinPTTChannel(
						channelId,
						WebrtcSignalingType.WEBRTC_ICE_CANDIDATE,
						JSON.stringify(event.candidate)
					);
				}
			}
		};

		peerConnection.ontrack = (event) => {
			if (event.track.kind === 'audio') {
				if (remoteAudioRef.current) {
					remoteAudioRef.current.srcObject = event.streams[0];
				}
			}
		};

		if (!joinPTTData?.[joinPTTData?.length - 1]) return;
		const data = joinPTTData?.[joinPTTData?.length - 1]?.joinPttData;
		switch (data.data_type) {
			case WebrtcSignalingType.WEBRTC_SDP_OFFER:
				{
					const processData = async () => {
						const dataDec = await decompress(data?.json_data);
						const objData = JSON.parse(dataDec || '{}');

						// Get peerConnection from receiver event.receiverId
						await peerConnection.setRemoteDescription(new RTCSessionDescription(objData));
						const answer = await peerConnection.createAnswer();
						await peerConnection.setLocalDescription(answer);

						const answerEnc = await compress(JSON.stringify(answer));
						await mezon.socketRef.current?.joinPTTChannel(channelId, WebrtcSignalingType.WEBRTC_SDP_ANSWER, answerEnc);
					};
					processData().catch(console.error);
				}
				break;
			case WebrtcSignalingType.WEBRTC_ICE_CANDIDATE:
				{
					const processData = async () => {
						const objData = JSON.parse(data?.json_data || '{}');
						if (peerConnection.remoteDescription) {
							await peerConnection.addIceCandidate(new RTCIceCandidate(objData));
						}
					};
					processData().catch(console.error);
				}
				break;
			default:
				break;
		}

		return () => {
			peerConnection.onicecandidate = null;
			peerConnection.onconnectionstatechange = null;
			peerConnection.ontrack = null;
		};
	}, [mezon.socketRef, peerConnection, joinPTTData, channelId]);

	const startJoinPTT = async () => {
		try {
			if (mezon.socketRef.current) {
				if (peerConnection) {
					peerConnection.close();
					setPeerConnection(null);
				}
				const newPeerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
				setPeerConnection(newPeerConnection);
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

				// mute
				const audioTrack = stream.getAudioTracks()[0];
				setAudioTrack(audioTrack);
				audioTrack.enabled = false;
				stream.getTracks().forEach((track) => {
					newPeerConnection.addTrack(track, stream);
				});

				// set peer & call join to server
				await mezon.socketRef.current?.joinPTTChannel(channelId, WebrtcSignalingType.WEBRTC_SDP_OFFER, '');
				setIsJoined(true);
			}
		} catch (err) {
			console.error('Failed to get local media:', err);
		}
	};

	const startTalking = async () => {
		if (!peerConnection) {
			console.error('PeerConnection is not initialized.');
			return;
		}

		// not use
		// await mezon.socketRef.current?.talkPTTChannel(channelId, WebrtcSignalingType.WEBRTC_SDP_OFFER, '', 0);
		// await sleep(1000);

		if (audioTrack) {
			audioTrack.enabled = true;
		}
		setIsTalking(true);
	};

	const stopTalking = async () => {
		if (!peerConnection) {
			console.error('PeerConnection is not initialized.');
			return;
		}
		if (audioTrack) {
			audioTrack.enabled = false;
		}
		setIsTalking(false);
	};

	const handleShow = async () => {
		setIsShow(true);
	};

	const quitPTT = async () => {
		setIsShow(false);
		setIsTalking(false);
		setIsJoined(false);
		if (peerConnection) {
			peerConnection.close();
			setPeerConnection(null);
		}
		await mezon.socketRef.current?.joinPTTChannel(channelId, WebrtcSignalingType.WEBRTC_SDP_QUIT, '{}');
	};

	return (
		<div className="relative leading-5 size-6" ref={threadRef}>
			<Tooltip content="Start Video Call" trigger="hover" animation="duration-500" style={isLightMode ? 'light' : 'dark'}>
				<button className="focus-visible:outline-none" onClick={handleShow} onContextMenu={(e) => e.preventDefault()}>
					{/* <Icons.JoinPTT isWhite={isShow} /> */}
				</button>
			</Tooltip>
			{isShow && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					{/* Modal nội dung */}
					<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-[900px] max-h-[90vh] overflow-hidden flex flex-col items-center">
						<h2 className="text-lg font-semibold text-black dark:text-white mb-4">Video Call</h2>
						<div className="flex justify-between space-x-4">
							<audio ref={remoteAudioRef} autoPlay playsInline controls></audio>
						</div>
						<div className="flex space-x-4 mt-6">
							<button
								onClick={startJoinPTT}
								disabled={isJoined}
								className={`px-6 py-2 rounded shadow ${
									isJoined ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
								}`}
							>
								Join
							</button>
							<button
								onClick={isTalking ? stopTalking : startTalking}
								className={`px-6 py-2 rounded shadow ${
									isTalking ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
								}`}
							>
								<Tooltip
									content={isTalking ? 'Mute' : 'Talk'}
									trigger="hover"
									animation="duration-500"
									style={isLightMode ? 'light' : 'dark'}
								>
									{isTalking ? <Icons.MutePTT /> : <Icons.TalkPTT />} {}
								</Tooltip>
							</button>
							<button onClick={quitPTT} className="px-6 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">
								Quit
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

DmTopbar.Skeleton = () => {
	return (
		<div className="flex  h-heightTopBar min-w-0 items-center bg-bgSecondary border-b border-black px-3 pt-4 pb-6 flex-shrink">
			<Skeleton width={38} height={38} />
		</div>
	);
};

export default DmTopbar;
