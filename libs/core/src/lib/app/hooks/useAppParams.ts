
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export function useAppParams() {
  const { serverId, channelId } = useParams()

  return useMemo(
    () => ({
        serverId,
        channelId
    }),
    [
        serverId,
        channelId
    ],
  );
}
