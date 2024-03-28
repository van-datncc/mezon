import { useAuth } from '@mezon/core';
import { IChannel } from '@mezon/utils';
import { Dropdown } from 'flowbite-react';
import { Coords } from '../ChannelLink';
import GroupPanels from './GroupPanels';
import ItemPanel from './ItemPanel';

type PanelChannel = {
	coords: Coords;
	channel: IChannel;
};

const PanelChannel = ({ coords, channel }: PanelChannel) => {
	const { userProfile } = useAuth();

	console.log('channel.category_id', channel.creator_id, userProfile?.user?.id);
	return (
		<div
			style={{ left: coords.mouseX, top: coords.mouseY }}
			className="fixed top-full bg-[#111214] rounded-sm shadow z-10 w-[200px] py-[10px] px-[10px]"
		>
			<GroupPanels>
				<ItemPanel children="Mark As Read" />
			</GroupPanels>
			<GroupPanels>
				<ItemPanel children="Invite People" />
				<ItemPanel children="Copy link" />
			</GroupPanels>
			{channel.type === 4 && (
				<GroupPanels>
					<ItemPanel children="Open Chat" />
					<ItemPanel children="Hide Names" type="checkbox" />
				</GroupPanels>
			)}
			<GroupPanels>
				<Dropdown
					trigger="hover"
					dismissOnClick={false}
					renderTrigger={() => (
						<div>
							<ItemPanel children="Mute Channel" dropdown="change here" />
						</div>
					)}
					label=""
					placement="right-start"
					className="bg-[#111214] border-none ml-[3px] py-[6px] px-[8px] w-[200px]"
				>
					<ItemPanel children="For 15 Minutes" />
					<ItemPanel children="For 1 Hour" />
					<ItemPanel children="For 3 Hour" />
					<ItemPanel children="For 8 Hour" />
					<ItemPanel children="For 24 Hour" />
					<ItemPanel children="Until I turn it back on" />
				</Dropdown>
				{channel.type === 1 && (
					<Dropdown
						trigger="hover"
						dismissOnClick={false}
						renderTrigger={() => (
							<div>
								<ItemPanel children="Notification Settings" dropdown="change here" />
							</div>
						)}
						label=""
						placement="right-start"
						className="bg-[#111214] border-none ml-[3px] py-[6px] px-[8px] w-[200px]"
					>
						<ItemPanel children="Use Category Default" type="radio" />
						<ItemPanel children="All Messages" type="radio" />
						<ItemPanel children="Only @mentions" type="radio" />
						<ItemPanel children="Nothing" type="radio" />
					</Dropdown>
				)}
			</GroupPanels>

			{/* Group panel creator */}
			{channel.creator_id === userProfile?.user?.id && (
				<GroupPanels>
					<ItemPanel children="Edit Channel" />
					<ItemPanel children="Duplicate Channel" />
					{channel.type === 1 && <ItemPanel children="Create Text Channel" />}
					{channel.type === 4 && <ItemPanel children="Create Voice Channel" />}
					<ItemPanel children="Delete Channel" />
				</GroupPanels>
			)}
		</div>
	);
};

export default PanelChannel;
