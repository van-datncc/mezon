import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ChannelMembersEntity, ChannelsEntity, RolesClanEntity, UsersClanEntity } from '@mezon/store-mobile';
import { RefObject } from 'react';

export interface IMemberItemProps {
	member: ChannelMembersEntity | UsersClanEntity;
	channelId?: string;
	isCheckbox?: boolean;
	isChecked?: boolean;
}

export interface IRoleItemProps {
	role: RolesClanEntity;
	channel?: ChannelsEntity;
	isCheckbox?: boolean;
	isChecked?: boolean;
}

export interface IAddMemberOrRoleBSProps {
	bottomSheetRef: RefObject<BottomSheetModal>;
	channel: ChannelsEntity;
}
