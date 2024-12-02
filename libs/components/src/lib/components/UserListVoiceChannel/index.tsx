import { IPttUsersEntity, UsersStreamEntity, VoiceEntity } from '@mezon/store';
import { IChannelMember } from '@mezon/utils';
import UserListItem from './UserListItemVoiceChannel';

export type UserListVoiceChannelProps = {
	readonly channelID: string;
	channelType?: number;
	memberList: VoiceEntity[] | UsersStreamEntity[] | IPttUsersEntity[];
};

function UserListVoiceChannel({ channelID, channelType, memberList }: UserListVoiceChannelProps) {
	return memberList?.map((item: IChannelMember, index: number) => {
		return (
			<div key={item.id}>
				<UserListItem user={item} channelID={channelID} />
			</div>
		);
	});
}

export default UserListVoiceChannel;
