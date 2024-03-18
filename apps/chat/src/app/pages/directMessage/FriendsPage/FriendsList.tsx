import { FriendsEntity } from "@mezon/store"
import FriendsListItem from "./FriendsListItem"
import { ChannelVoice } from "@mezon/components"
import { useAuth, useClans } from "@mezon/core"

type ListFriendsProps = {
    listFriendFilter: FriendsEntity[]
}
const FriendList = ({ listFriendFilter }: ListFriendsProps) => {
    const { currentClan } = useClans();
	const { userProfile } = useAuth();
    
    return (
        <>
            <ChannelVoice channelLabel={'General'} clanName={currentClan?.clan_name} userName={userProfile?.user?.username || "unknown"} />
            {listFriendFilter.map((friend: FriendsEntity) => (
                <FriendsListItem friend={friend} key={friend.id}/>
            ))}
        </>
    )
}

export default FriendList;