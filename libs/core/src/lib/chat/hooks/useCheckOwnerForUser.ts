import { selectCurrentChannel, selectCurrentClan } from "@mezon/store";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export function useCheckOwnerForUser() {
	const currentClan = useSelector(selectCurrentClan);
	const currentChannel = useSelector(selectCurrentChannel);
	
	const checkClanOwner = useCallback(
        (userId: string) => currentClan?.creator_id === userId
	, [currentClan?.creator_id]);

    const checkChannelOwner = useCallback(
        (userId: string) => currentChannel?.creator_id === userId
	, [currentChannel?.creator_id]);
	
	return useMemo(() => (
        [
            checkClanOwner,
            checkChannelOwner,
        ]
    ),
        [
            checkClanOwner,
            checkChannelOwner,
        ]
    );
}