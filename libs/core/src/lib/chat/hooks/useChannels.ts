import { useSelector } from "react-redux";
import { selectAllChannels } from "@mezon/store";

export function useChannels() {
    const channels = useSelector(selectAllChannels);
    
    return {
        channels
    };
}