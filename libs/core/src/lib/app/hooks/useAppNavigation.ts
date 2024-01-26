import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const toChannelPage = useCallback((channelId: string) => {
    return `/channel/${channelId}`;
  }, []);

  const toClanPage = useCallback(() => {
    return `/clan`;
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
