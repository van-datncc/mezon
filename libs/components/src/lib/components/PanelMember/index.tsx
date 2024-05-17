import { useAuth } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/utils';
import { Dropdown } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { Coords } from '../ChannelLink';
import GroupPanelMember from './GroupPanelMember';
import ItemPanelMember from './ItemPanelMember';

type PanelMemberProps = {
	coords: Coords;
	member?: ChannelMembersEntity;
	onClose: () => void;
	onRemoveMember: () => void;
};

const typeChannel = {
	text: 1,
	voice: 4,
};

const PanelMember = ({ coords, member, onClose, onRemoveMember }: PanelMemberProps) => {
	const { userProfile } = useAuth();
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [positionTop, setPositionTop] = useState<boolean>(false);

	useEffect(() => {
		const heightPanel = panelRef.current?.clientHeight;
		if (heightPanel && heightPanel > coords.distanceToBottom) {
			setPositionTop(true);
		}
	}, [coords.distanceToBottom]);

	const handleRemoveMember = () => {
		onRemoveMember();
	};

	return (
		<div
			ref={panelRef}
			onMouseDown={(e) => e.stopPropagation()}
			onClick={(e) => console.log(123)}
			style={{
				left: coords.mouseX - 250,
				bottom: positionTop ? '12px' : 'auto',
				top: positionTop ? 'auto' : coords.mouseY,
			}}
			className="fixed top-full bg-bgProfileBody rounded-sm shadow z-20 w-[250px] py-[10px] px-[10px]"
		>
			<GroupPanelMember>
				<ItemPanelMember children="Profile" />
				<ItemPanelMember children="Mention" />
				<ItemPanelMember children="Message" />
				<ItemPanelMember children="Call" />
				<ItemPanelMember children="Add Note" />
				<ItemPanelMember children="Add Friend Nickname" />
			</GroupPanelMember>
			<GroupPanelMember>
				<ItemPanelMember children="Mute" type="checkbox" />
				<Dropdown
					trigger="hover"
					dismissOnClick={false}
					renderTrigger={() => (
						<div>
							<ItemPanelMember children="Invite to Server" dropdown />
						</div>
					)}
					label=""
					placement="left-start"
					className="!bg-bgProfileBody !left-[-6px] border-none py-[6px] px-[8px] w-[200px]"
				>
					<ItemPanelMember children="Komu" />
					<ItemPanelMember children="Clan 1" />
					<ItemPanelMember children="Clan 2" />
					<ItemPanelMember children="Clan 3" />
				</Dropdown>
				<ItemPanelMember children="Remove Friend" />
				<ItemPanelMember children="Block" />
			</GroupPanelMember>
			<GroupPanelMember>
				<ItemPanelMember children="Move View" />
				<ItemPanelMember children={`Timeout ${member?.user?.username}`} danger />
				<ItemPanelMember onClick={handleRemoveMember} children={`Kick ${member?.user?.username}`} danger />
				<ItemPanelMember children={`Ban ${member?.user?.username}`} danger />
			</GroupPanelMember>
		</div>
	);
};

export default PanelMember;
