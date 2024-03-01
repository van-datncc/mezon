import { FriendsEntity } from "@mezon/store"
import FriendsListItem from "./FriendsListItem"

type ListFriendsProps = {
    listFriendFilter: FriendsEntity[]
}
const FriendList = ({ listFriendFilter }: ListFriendsProps) => {
    return (
        <>
            {listFriendFilter.map((friend: FriendsEntity) => (
                <FriendsListItem friend={friend} />
            ))}</>
    )
}

export default FriendList;