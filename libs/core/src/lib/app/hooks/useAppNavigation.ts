import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export type ToClanPageArgs = {
  clanId: string;
}

export function useAppNavigation() {
  const navigate = useNavigate();

  const toLoginPage = useCallback(() => {
    return `/guest/login`;
  }, []);

  const toHomePage = useCallback(() => {
    return `/`;
  }, []);

  const toDirectMessagePage = useCallback(() => {
    return `/direct-message`;
  }, []);

  const toChannelPage = useCallback((channelId: string, clanId: string) => {
    return `/chat/servers/${clanId}/channels/${channelId}`;
  }, []);

  const toClanPage = useCallback((clanId: string) => {
    return `/chat/servers/${clanId}/channels`;
  }, []);

  return useMemo(
    () => ({
      navigate,
      toLoginPage,
      toHomePage,
      toDirectMessagePage,
      toChannelPage,
      toClanPage,
    }),
    [
      navigate,
      toLoginPage,
      toHomePage,
      toDirectMessagePage,
      toChannelPage,
      toClanPage,
    ],
  );
}
