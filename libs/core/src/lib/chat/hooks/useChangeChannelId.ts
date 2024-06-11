import { channelsActions, selectCurrentClanId, selectIdChannelSelectedByClanId, useAppDispatch } from "@mezon/store";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export function useChangeChannelId() {
    const dispatch = useAppDispatch();
    const currentClanId = useSelector(selectCurrentClanId);
    const idChannelSelected = useSelector(selectIdChannelSelectedByClanId(currentClanId || ''));

    const setIdChannelSelected = useCallback(
		(channelId: string) => {
            dispatch(
                channelsActions.setIdChannelSelected({
                    clanId: currentClanId || '',
                    channelId,
                }),
            );
			
		},
		[currentClanId, dispatch],
	);

    return useMemo(
		() => ({
			currentClanId,
            idChannelSelected,
            setIdChannelSelected,
		}),
		[
            currentClanId,
            idChannelSelected,
            setIdChannelSelected,
        ],
	);
}