import { IChannel } from "@mezon/utils"
import ChannelLink from "../../ChannelLink"
import { useSelector } from "react-redux"
import { selectCurrentChannel } from "@mezon/store"
import { useModal } from "react-modal-hook"
import ModalInvite from "../../ListMemberInvite/modalInvite"
type ChannelListItemProp = {
    channel: IChannel;
}
const ChannelListItem = (props: ChannelListItemProp) => {
    const currentChanel = useSelector(selectCurrentChannel);
    const { channel } = props
    const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => (
        <ModalInvite onClose={closeInviteChannelModal} open={true} channelID={channel.id}/>
		));
    const handleOpenInvite = () => {
        openInviteChannelModal();
    };
    
    return(
        <ChannelLink
            clanId={channel?.clan_id}
            channel={channel}
            active={currentChanel?.id === channel.id}
            key={channel.id}
            createInviteLink={handleOpenInvite}
            isPrivate={channel.channel_private}
        />
    )
}

export default ChannelListItem