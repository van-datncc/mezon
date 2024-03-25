import { ChannelType } from '@mezon/mezon-js';
import { ChannelStatusEnum, IChannel } from '@mezon/utils';
import { useState } from 'react';
import * as Icons from '../Icons';

export type ChannelSettingItemProps = {
	onItemClick: (settingName: string) => void;
	channel: IChannel;
	openModal: () => void;
};

const ChannelSettingItem = (props: ChannelSettingItemProps) => {
	const { onItemClick, channel, openModal } = props;
	const isPrivate = channel.channel_private;
	const [selectedButton, setSelectedButton] = useState<string | null>('Overview');
	const handleButtonClick = (buttonName: string) => {
		setSelectedButton(buttonName);
	};

	return (
		<div className=" overflow-y-auto w-1/6 xl:w-1/4 min-w-56 bg-black flex justify-end pt-96 pr-2 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 2xl:flex-grow hide-scrollbar flex-grow">
			<div className="w-170px">
				<div className="flex justify-start">
					{isPrivate === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_VOICE && (
						<Icons.SpeakerLocked defaultSize="w-5 h-5" />
					)}
					{isPrivate === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_TEXT && (
						<Icons.HashtagLocked defaultSize="w-5 h-5 -mt-1" />
					)}
					{isPrivate === undefined && channel.type === ChannelType.CHANNEL_TYPE_VOICE && <Icons.Speaker defaultSize="w-5 5-5" />}
					{isPrivate === undefined && channel.type === ChannelType.CHANNEL_TYPE_TEXT && <Icons.Hashtag defaultSize="w-5 h-5 -mt-1" />}
					<p className="text-[#84ADFF] font-bold text-sm tracking-wider max-w-[160px] overflow-x-hidden text-ellipsis uppercase one-line">
						{channel.channel_label}
					</p>
				</div>
				<button
					className={`text-[#AEAEAE] w-[170px] text-[15px] rounded-[5px] text-left ml-[-8px] p-2 mt-4 hover:text-white ${selectedButton === 'Overview' ? 'bg-[#232E3B] text-white' : ''}`}
					onClick={() => {
						handleButtonClick('Overview');
						onItemClick && onItemClick('Overview');
					}}
				>
					Overview
				</button>
				<br />
				<button
					className={`p-2 text-[#AEAEAE] text-[15px] pl-2 ml-[-8px] hover:text-white ${selectedButton === 'Permissions' ? 'bg-[#232E3B] text-white' : ''} mt-1 w-[170px] text-left rounded-[5px]`}
					onClick={() => {
						handleButtonClick('Permissions');
						onItemClick && onItemClick('Permissions');
					}}
				>
					Permissions
				</button>
				<br />
				<button
					className={`p-2 text-[#AEAEAE] text-[15px] pl-2 ml-[-8px] hover:text-white ${selectedButton === 'Invites' ? 'bg-[#232E3B] text-white' : ''} mt-1 w-[170px] text-left rounded-[5px]`}
					onClick={() => {
						handleButtonClick('Invites');
						onItemClick && onItemClick('Invites');
					}}
				>
					Invites
				</button>
				<br />
				<button
					className={`p-2 text-[#AEAEAE] text-[15px] pl-2 ml-[-8px] hover:text-white ${selectedButton === 'Integrations' ? 'bg-[#232E3B] text-white' : ''} mt-1 w-[170px] text-left rounded-[5px]`}
					onClick={() => {
						handleButtonClick('Integrations');
						onItemClick && onItemClick('Integrations');
					}}
				>
					Integrations
				</button>
				<hr className="border-t border-solid border-borderDefault my-4" />
				<button
					className={`p-2 text-[#AEAEAE] text-[15px] pl-2 ml-[-8px] hover:text-white ${selectedButton === 'Delete' ? 'bg-[#232E3B] text-white' : ''} w-[170px] text-left rounded-[5px]`}
					onClick={() => {
						handleButtonClick('Delete');
						openModal();
					}}
				>
					Delete Channel
				</button>
			</div>
		</div>
	);
};

export default ChannelSettingItem;
