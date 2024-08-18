import { Dropdown } from 'flowbite-react';
import ItemPanelMember from './ItemPanelMember';
import { useAppNavigation, useAppParams } from '@mezon/core';
import { fetchDirectMessage, removeMemberChannel, selectCurrentUserId, useAppDispatch, useAppSelector } from '@mezon/store';

interface PanelGroupDMPProps {
	isDmGroupOwner: boolean;
	dmGroupId?: string;
}

const PanelGroupDM = ({ isDmGroupOwner, dmGroupId }: PanelGroupDMPProps) => {
	const dispatch = useAppDispatch();
	const { directId } = useAppParams();
	const currentUserId = useAppSelector(selectCurrentUserId)
	const { navigate } = useAppNavigation();
	const handleLeaveDmGroup = async () => {
		const isLeaveGroup = await dispatch(removeMemberChannel({ channelId: dmGroupId || "", userIds: [currentUserId], kickMember: false }));
    if (isLeaveGroup && directId === dmGroupId) {
			navigate("/chat/direct/friends");
		}
    await dispatch(fetchDirectMessage({ noCache: true }));
	}
	return (
		<>
			<div className="border-b dark:border-[#2e2f34]">
				<ItemPanelMember children="Mark as read" />
			</div>
			<div className="border-b dark:border-[#2e2f34]">
				{isDmGroupOwner && <ItemPanelMember children="Invites" />}
				<ItemPanelMember children="Change icon" />
			</div>
			<div className="border-b dark:border-[#2e2f34]">
				<Dropdown
					trigger="hover"
					dismissOnClick={false}
					renderTrigger={() => (
						<div>
							<ItemPanelMember children="Invite to Clan" dropdown />
						</div>
					)}
					label=""
					placement="left-start"
					className="dark:!bg-bgProfileBody !bg-bgLightPrimary !left-[-6px] border-none py-[6px] px-[8px] w-[200px]"
				>
					<ItemPanelMember children="For 15 Minutes" />
					<ItemPanelMember children="For 1 Hour" />
					<ItemPanelMember children="For 3 Hours" />
					<ItemPanelMember children="For 8 Hours" />
					<ItemPanelMember children="For 24 Hours" />
					<ItemPanelMember children="Until I turn it back on" />
				</Dropdown>
			</div>
			<ItemPanelMember children="Leave Group" danger onClick={handleLeaveDmGroup} />
		</>
	);
};

export default PanelGroupDM;
