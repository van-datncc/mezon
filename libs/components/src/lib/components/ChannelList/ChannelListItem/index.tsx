import { selectArrayUnreadChannel, selectCurrentChannel } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { useEffect } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ChannelLink from '../../ChannelLink';
import ModalInvite from '../../ListMemberInvite/modalInvite';
type ChannelListItemProp = {
	channel: IChannel;
};
const ChannelListItem = (props: ChannelListItemProp) => {
	// const dispatch = useDispatch();
	const currentChanel = useSelector(selectCurrentChannel);
	const arrayUnreadChannel = useSelector(selectArrayUnreadChannel);
	const { channel } = props;
	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
		<ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channel.id} />
	));
	const handleOpenInvite = () => {
		openInviteChannelModal();
	};

	useEffect(() => {
		console.log(arrayUnreadChannel);
	}, [arrayUnreadChannel]);

	const isUnReadChannel = (channelId: string) => {
		const channel = arrayUnreadChannel.find((item) => item.channelId === channelId);
		if (channel && channel.channelLastMessageId === channel.channelLastSeenMesageId) {
			return true;
		}
		return false;
	};

	return (
		<ChannelLink
			clanId={channel?.clan_id}
			channel={channel}
			active={currentChanel?.id === channel.id}
			key={channel.id}
			createInviteLink={handleOpenInvite}
			isPrivate={channel.channel_private}
			isUnReadChannel={isUnReadChannel(channel.id)}
		/>
	);
};

export default ChannelListItem;
