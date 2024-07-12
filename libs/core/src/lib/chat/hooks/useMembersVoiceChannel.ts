import { channelsActions, useAppDispatch } from "@mezon/store";
import { useCallback, useMemo } from "react";

export function useMembersVoiceChannel() {
    const dispatch = useAppDispatch();

    const setMembersVoiceChannel = useCallback(
		(channelId: string, member: string) => {
			dispatch(channelsActions.setMembersVoiceChannel({channelId, member}));
		},
		[dispatch],
	);

    return useMemo(
		() => ({
			setMembersVoiceChannel,
		}),
		[
            setMembersVoiceChannel,
        ],
	);
}