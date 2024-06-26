import { ChannelMembersEntity } from "@mezon/utils";
import ItemPanel from "../../../PanelChannel/ItemPanel"
import { useFriends } from "@mezon/core";

export const PopupFriend = ({user}:{user: ChannelMembersEntity | null;}) => {
    const {deleteFriend} = useFriends();
    return(
        <div 
            className="absolute sbm:left-9 right-9 top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1]" 
            onClick={() => {
                if(user){
                    deleteFriend(user?.user?.username || '',user?.user?.id || '');
                }
            }}
        >
            <ItemPanel children="Remove Friend" />
        </div>
    )
}

export const PopupAddFriend = ({user}:{user: ChannelMembersEntity | null;}) => {
    const {addFriend} = useFriends();
    return(
        <div 
            className="absolute sbm:left-9 right-9 top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1]"
            onClick={() => {
                if(user){
                    addFriend({
                        usernames: [user.user?.username || ''],
                        ids: [],
                    });
                }
            }}
        >
            <ItemPanel children="Add Friend" />
        </div>
    )
}

export const PopupOption = () => {
    return(
        <div className="absolute sbm:left-9 right-9 top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1]">
            <ItemPanel children="View Full Profile" />
            <ItemPanel children="Block" />
            <ItemPanel children="Report User Profile" />
        </div>
    )
}