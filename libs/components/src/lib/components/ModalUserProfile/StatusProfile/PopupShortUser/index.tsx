import { ChannelMembersEntity } from "@mezon/utils";
import ItemPanel from "../../../PanelChannel/ItemPanel"
import { useFriends } from "@mezon/core";

export const PopupFriend = ({user, showPopupLeft}:{user: ChannelMembersEntity | null; showPopupLeft?: boolean}) => {
    const {deleteFriend} = useFriends();
    return(
        <div 
            className={`absolute top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1] ${showPopupLeft ? 'right-9' : 'sbm:left-9 right-9'}`} 
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

export const PopupAddFriend = ({user, showPopupLeft}:{user: ChannelMembersEntity | null; showPopupLeft?: boolean}) => {
    const {addFriend} = useFriends();
    return(
        <div 
            className={`absolute top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1] ${showPopupLeft ? 'right-9' : 'sbm:left-9 right-9'}`}
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

export const PopupOption = ({showPopupLeft}: {showPopupLeft?: boolean}) => {
    return(
        <div className={`absolute top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1] ${showPopupLeft ? 'right-9' : 'sbm:left-9 right-9'}`}>
            <ItemPanel children="View Full Profile" />
            <ItemPanel children="Block" />
            <ItemPanel children="Report User Profile" />
        </div>
    )
}