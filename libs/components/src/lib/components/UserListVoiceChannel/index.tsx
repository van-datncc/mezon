import { selectStreamMembersByChannelId, selectVoiceChannelMembersByChannelId } from '@mezon/store';
import { IChannelMember } from '@mezon/utils';
import { useSelector } from 'react-redux';
import UserListItem from './UserListItemVoiceChannel';

export type UserListVoiceChannelProps = {
	readonly channelID: string;
};

function UserListVoiceChannel({ channelID }: UserListVoiceChannelProps) {
	const voiceChannelMember = useSelector(selectVoiceChannelMembersByChannelId(channelID));
	const streamChannelMember = useSelector(selectStreamMembersByChannelId(channelID));
	const listMember = voiceChannelMember || streamChannelMember;

	return listMember?.map((item: IChannelMember, index: number) => {
		return (
			<div key={item.id}>
				<UserListItem user={item} channelID={channelID} />
			</div>
		);
	});
}

export default UserListVoiceChannel;
