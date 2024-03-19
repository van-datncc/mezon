import { useChatMessages } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
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
	const { channel } = props;
	const { messages } = useChatMessages({ channelId: channel.id });
	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
		<ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channel.id} />
	));
	const handleOpenInvite = () => {
		openInviteChannelModal();
	};

	useEffect(() => {
		// dispatch(channelsActions.setChannelLastMessageId({ channelId: channel.id, messageId: channel.last_message_id || '' }));
		// console.log('com', messages[0]?.id);
		// console.log('com', channel);
		// console.log(1);
	}, [messages]);

	return (
		<ChannelLink
			clanId={channel?.clan_id}
			channel={channel}
			active={currentChanel?.id === channel.id}
			key={channel.id}
			createInviteLink={handleOpenInvite}
			isPrivate={channel.channel_private}
			isUnReadChannel={channel.last_message_id === channel.last_seen_message_id}
		/>
	);
};

export default ChannelListItem;
