import { ChannelType } from '@mezon/mezon-js';
import { selectArrayUnreadChannel, selectCurrentChannel, selectEntitiesChannel, selectMessageByMessageId } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { Fragment } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ChannelLink from '../../ChannelLink';
import ModalInvite from '../../ListMemberInvite/modalInvite';
import UserListVoiceChannel from '../../UserListVoiceChannel';
type ChannelListItemProp = {
	channel: IChannel;
};
const ChannelListItem = (props: ChannelListItemProp) => {
	const currentChanel = useSelector(selectCurrentChannel);
	const arrayUnreadChannel = useSelector(selectArrayUnreadChannel);
	const entitiesChannel = useSelector(selectEntitiesChannel);

	const { channel } = props;

	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
		<ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channel.id} />
	));
	const handleOpenInvite = () => {
		openInviteChannelModal();
	};

	const isUnReadChannel = (channelId: string) => {
		const channel = arrayUnreadChannel.find((item) => item.channelId === channelId);
		const checkTypeChannel = entitiesChannel[channelId];
		if (checkTypeChannel && checkTypeChannel.type === 4) {
			return true;
		} else {
			if (channel && channel.channelLastMessageId === channel.channelLastSeenMesageId) {
				return true;
			}
		}

		return false;
	};

	const useNotication = (channelId: string) => {
		const channel = arrayUnreadChannel.find((item) => item.channelId === channelId);
		const messageLast = useSelector(selectMessageByMessageId(channel?.channelLastMessageId || ''));

		return 2;
	};

	return (
		<Fragment>
			<ChannelLink
				clanId={channel?.clan_id}
				channel={channel}
				active={currentChanel?.id === channel.id}
				key={channel.id}
				createInviteLink={handleOpenInvite}
				isPrivate={channel.channel_private}
				isUnReadChannel={isUnReadChannel(channel.id)}
				numberNotication={useNotication(channel.id)}
			/>
			{channel.type === ChannelType.CHANNEL_TYPE_VOICE && (
				<UserListVoiceChannel channelID={channel.id} channelType={ChannelType.CHANNEL_TYPE_VOICE} />
			)}
		</Fragment>
	);
};

export default ChannelListItem;
