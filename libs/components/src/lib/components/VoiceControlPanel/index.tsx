import { useAppNavigation } from '@mezon/core';
import { ChannelType } from '@mezon/mezon-js';
import {
	ChannelsEntity,
	channelsActions,
	selectChannelById,
	selectCurrentClan,
	selectCurrentVoiceChannelId,
	selectShowScreen,
	selectStatusCall,
	useAppDispatch,
	voiceActions,
} from '@mezon/store';
import { useMezonVoice } from '@mezon/transport';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Icons from '../Icons';

export type VoiceControlPanelProps = {
	channelCurrent: ChannelsEntity | null | undefined;
};

function VoiceControlPanel({ channelCurrent }: VoiceControlPanelProps) {
	const dispatch = useAppDispatch();
	const currentClan = useSelector(selectCurrentClan);
	const voice = useMezonVoice();
	const showScreen = useSelector(selectShowScreen);
	const currentVoiceChannelId = useSelector(selectCurrentVoiceChannelId);
	const currentVoiceChannel = useSelector(selectChannelById(currentVoiceChannelId));
	const statusCall = useSelector(selectStatusCall);

	const startScreenShare = useCallback(() => {
		voice.createScreenShare();
		dispatch(voiceActions.setShowScreen(true));
	}, [voice]);

	const stopScreenShare = useCallback(() => {
		voice.stopScreenShare();
		dispatch(voiceActions.setShowScreen(false));
	}, [voice]);

	const leaveVoiceChannel = useCallback(() => {
		if (!statusCall) {
			dispatch(voiceActions.setStatusCall(false));
			return;
		}
		stopScreenShare();
		voice.voiceDisconnect();
		dispatch(voiceActions.setStatusCall(false));
		dispatch(channelsActions.setCurrentVoiceChannelId(''));
	}, [voice]);

	const openCamera = useCallback(() => {
		voice.createLocalTrack(['video']);
	}, [voice]);

	const { toChannelPage } = useAppNavigation();
	const channelPath = toChannelPage(currentVoiceChannelId, currentVoiceChannel?.clan_id || '');

	useEffect(() => {
		if (channelCurrent?.type === ChannelType.CHANNEL_TYPE_VOICE) {
			dispatch(channelsActions.setCurrentVoiceChannelId(channelCurrent.id));
		}
	}, []);

	return (
		<div className="p-2 absolute w-full bottom-[57px] bg-bgSurface border-borderDefault ">
			<div className="flex items-center gap-2 iconHover justify-between">
				<div className="">
					<div className="flex items-center whitespace-nowrap text-ellipsis overflow-hidden pb-[2px]">
						<WifiButton />
						<button>
							<div className="text-[14px] font-bold text-green-600 hover:underline">Voice Connected</div>
						</button>
					</div>

					<div className="text-[12px] font-normal text-gray-400 hover:underline">
						<Link to={channelPath}>
							{currentVoiceChannel?.channel_label}/ {currentClan?.clan_name}
						</Link>
					</div>
				</div>
				<div className="flex">
					<button className="button w-[20px] h-[20px]">
						<Icons.LookBlankIcon />
					</button>
					<button className="button" onClick={leaveVoiceChannel}>
						<Icons.PhoneIcon />
					</button>
				</div>
			</div>
			<div className="actionButtons">
				<button className="button-icon bg-[#2B2D31] hover:bg-gray-600">
					<div className="flex items-center">
						<div className=" w-[18px] h-[20px]" onClick={openCamera}>
							<Icons.CameraIcon />
						</div>
					</div>
				</button>
				<button className="button-icon bg-[#2B2D31] hover:bg-gray-600">
					<div>
						<div className="flex w-[18px] h-[20px]" onClick={showScreen ? stopScreenShare : startScreenShare}>
							<Icons.ShareIcon defaultFill={showScreen ? 'white' : '#AEAEAE'} />
						</div>
					</div>
				</button>
				<button className="button-icon bg-[#2B2D31] hover:bg-gray-600">
					<div>
						<div className="flex w-[18px] h-[20px]">
							<Icons.RocketIcon />
						</div>
					</div>
				</button>
				<button className="button-icon bg-[#2B2D31] hover:bg-gray-600">
					<div>
						<div className="flex w-[18px] h-[20px]">
							<Icons.BellIcon />
						</div>
					</div>
				</button>
			</div>
		</div>
	);
}

function WifiButton() {
	return (
		<button className="text-green-600 mr-[4px] ">
			<Icons.WifiIcon />
		</button>
	);
}

export default VoiceControlPanel;
