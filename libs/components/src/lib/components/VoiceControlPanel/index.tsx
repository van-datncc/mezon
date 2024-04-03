import { ChannelsEntity, selectCurrentClan, selectShowScreen, useAppDispatch, voiceActions } from '@mezon/store';
import { useMezonVoice } from '@mezon/transport';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons';

export type VoiceControlPanelProps = {
	channelCurrent: ChannelsEntity;
};

function VoiceControlPanel({ channelCurrent }: VoiceControlPanelProps) {
	const dispatch = useAppDispatch();
	const currentClan = useSelector(selectCurrentClan);
	const voice = useMezonVoice();
	const showScreen = useSelector(selectShowScreen);

	const startScreenShare = useCallback(() => {
		voice.createScreenShare();
		dispatch(voiceActions.setShowScreen(true));
	}, [voice]);

	const stopScreenShare = useCallback(() => {
		voice.stopScreenShare();
		dispatch(voiceActions.setShowScreen(false));
	}, [voice]);

	const leaveVoiceChannel = useCallback(() => {
		voice.voiceDisconnect();
	}, [voice]);
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
					<a href="">
						<div className="text-[12px] font-normal text-gray-400 hover:underline">
							{channelCurrent.channel_label} / {currentClan?.clan_name}
						</div>
					</a>
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
						<div className=" w-[18px] h-[20px]">
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
