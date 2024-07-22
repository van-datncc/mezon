import { selectIsUnreadChannelById, selectLastChannelTimestamp, selectNotificationMentionCountByChannelId, selectNotifyListChannel, useAppDispatch } from '@mezon/store';
import { ChannelThreads } from '@mezon/utils';
import { Fragment } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ChannelLink from '../../ChannelLink';
import ModalInvite from '../../ListMemberInvite/modalInvite';
import ThreadListChannel from '../../ThreadListChannel';
import UserListVoiceChannel from '../../UserListVoiceChannel';

function useChannelBadgeCount(channelId: string) {
	const lastChannelTimestamp = useSelector(selectLastChannelTimestamp(channelId));
	const numberNotification = useSelector(selectNotificationMentionCountByChannelId(channelId, lastChannelTimestamp));
	return numberNotification;
}

type ChannelListItemProp = {
	channel: ChannelThreads;
};

const ChannelListItem = (props: ChannelListItemProp) => {
	const { channel } = props;
	const dispatch = useAppDispatch()
	const isUnReadChannel = useSelector(selectIsUnreadChannelById(channel.id));
	const numberNotification = useChannelBadgeCount(channel.id);

	const NotifyChannel = useSelector(selectNotifyListChannel());

	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
		<ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channel.id} />
	));

	const handleOpenInvite = () => {
		openInviteChannelModal();
	};

	console.log('NOTIFY: ', NotifyChannel)

	// useEffect(() => {
	// 	dispatch(channelsActions.setQuantityNotifyChannel({ channelId: channel.id ?? '', quantityNotify: numberNotification ?? 0 }))
	// }, [numberNotification]);
	return (
		<Fragment>
			<ChannelLink
				clanId={channel?.clan_id}
				channel={channel}
				key={channel.id}
				createInviteLink={handleOpenInvite}
				isPrivate={channel.channel_private}
				isUnReadChannel={isUnReadChannel}
				numberNotification={numberNotification}
				channelType={channel?.type}
			/>
			{channel.threads && <ThreadListChannel threads={channel.threads} />}
			<UserListVoiceChannel channelID={channel.channel_id ?? ''} />
		</Fragment>
	);
};

export default ChannelListItem;
