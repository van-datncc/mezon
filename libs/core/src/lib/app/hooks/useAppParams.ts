import { useMemo } from "react";
import { useParams } from "react-router-dom";

export function useAppParams() {
    const { serverId, channelId, directId, type } = useParams();

    return useMemo(
        () => ({
            serverId,
            channelId,
            directId,
            type,
        }),
        [serverId, channelId, directId, type],
    );
}
