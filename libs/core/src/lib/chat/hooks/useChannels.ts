import { useSelector } from "react-redux";
import { selectAllChannels, selectAllChannelMembers } from "@mezon/store";

export function useChannels() {
    const channels = useSelector(selectAllChannels);
    
    return {
        channels
    };
}

export function useChannelMembers() {
    const channelMembers = useSelector(selectAllChannelMembers);
    
    return {
        channelMembers
    };
}