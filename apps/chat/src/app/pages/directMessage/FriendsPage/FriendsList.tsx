import { FriendsEntity } from "@mezon/store"
import FriendsListItem from "./FriendsListItem"
import { ChannelVoice } from "@mezon/components"

type ListFriendsProps = {
    listFriendFilter: FriendsEntity[]
}
const FriendList = ({ listFriendFilter }: ListFriendsProps) => {
    return (
        <>
            <ChannelVoice channelId='' clanId='' />
            {listFriendFilter.map((friend: FriendsEntity) => (
                <FriendsListItem friend={friend} key={friend.id}/>
            ))}
        </>
    )
}

export default FriendList;