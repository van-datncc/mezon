import { ChannelsEntity, selectCurrentClan } from '@mezon/store';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons';

export type VoiceControlPanelProps = {
	channel: ChannelsEntity;
};

function VoiceControlPanel({ channel }: VoiceControlPanelProps) {
	const currentClan = useSelector(selectCurrentClan);
	return (
		<div className="p-[8px] absolute w-full bottom-[57px] bg-bgSurface border-borderDefault ">
			<div className="flex items-center gap-2 iconHover justify-between">
				<div className="">
					<div className="flex items-center whitespace-nowrap text-ellipsis overflow-hidden pb-[2px]">
						<WifiButton />
						<button>
							<div className="text-[14px] font-bold text-green-600">Voice Connected</div>
						</button>
					</div>
					<a href="">
						<div className="text-[12px] font-normal text-gray-400">
							{channel.channel_label} / {currentClan?.clan_name}
						</div>
					</a>
				</div>
				<div className="flex">
					<button className="button w-[20px] h-[20px]">
						<Icons.LookBlankIcon />
					</button>
					<button className="button">
						<Icons.PhoneIcon />
					</button>
				</div>
			</div>
			<div className="actionButtons">
				<button className="button-icon bg-gray-600">
					<div className="flex items-center">
						<div className=" w-[18px] h-[20px]">
							<Icons.CameraIcon />
						</div>
					</div>
				</button>
				<button className="button-icon bg-gray-600">
					<div>
						<div className="flex w-[18px] h-[20px]">
							<Icons.ShareIcon />
						</div>
					</div>
				</button>
				<button className="button-icon bg-gray-600">
					<div>
						<div className="flex w-[18px] h-[20px]">
							<Icons.RocketIcon />
						</div>
					</div>
				</button>
				<button className="button-icon bg-gray-600">
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
