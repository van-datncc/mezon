import ItemPanel from "../../../PanelChannel/ItemPanel"

export const PopupFriend = () => {
    return(
        <div className="absolute right-8 -top-9 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1]">
            <ItemPanel children="Remove Friend" />
        </div>
    )
}

export const PopupAddFriend = () => {
    return(
        <div className="absolute right-8 -top-9 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1]">
            <ItemPanel children="Add Friend" />
        </div>
    )
}

export const PopupOption = () => {
    return(
        <div className="absolute left-9 top-0 dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow w-[165px] p-2 z-[1]">
            <ItemPanel children="View Full Profile" />
            <ItemPanel children="Block" />
            <ItemPanel children="Report User Profile" />
        </div>
    )
}