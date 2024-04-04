import { selectCurrentChannel, selectIsUnreadChannelById, selectLastChannelTimestamp, selectNotificationMentionCountByChannelId } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { Fragment } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ChannelLink from '../../ChannelLink';
import ModalInvite from '../../ListMemberInvite/modalInvite';
import UserListVoiceChannel from '../../UserListVoiceChannel';

// TODO: move this to core
function useChannelBadgeCount(channelId: string) {
	const lastChannelTimestamp = useSelector(selectLastChannelTimestamp(channelId));
	const numberNotification = useSelector(selectNotificationMentionCountByChannelId(channelId, lastChannelTimestamp));

	return numberNotification;
}

type ChannelListItemProp = {
	channel: IChannel;
};

const ChannelListItem = (props: ChannelListItemProp) => {
	const { channel } = props;

	const currentChanel = useSelector(selectCurrentChannel);
	const isUnReadChannel = useSelector(selectIsUnreadChannelById(channel.id));
	const numberNotification = useChannelBadgeCount(channel.id);

	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
		<ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channel.id} />
	));
	
	const handleOpenInvite = () => {
		openInviteChannelModal();
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
				isUnReadChannel={isUnReadChannel}
				numberNotication={numberNotification}
			/>
			<UserListVoiceChannel channelID={channel.channel_id ?? ""} />
		</Fragment>
	);
};

export default ChannelListItem;
