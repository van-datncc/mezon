import { useAuth } from '@mezon/core';
import { selectMemberClanByUserId, selectTokenSocket } from '@mezon/store-mobile';
import { getNameForPrioritize } from '@mezon/utils';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

export const useTokenToast = () => {
	const { userId } = useAuth();
	const tokenSocket = useSelector(selectTokenSocket(userId ?? ''));
	const receiver = useSelector(selectMemberClanByUserId(tokenSocket?.receiver_id ?? ''));

	useEffect(() => {
		if (!!userId && !!tokenSocket && userId === tokenSocket?.receiver_id) {
			const name = getNameForPrioritize(receiver?.clan_nick ?? '', receiver?.user?.display_name ?? '', receiver?.user?.username ?? '');

			Toast.show({
				type: 'info',
				text1: `+1 token from ${name}`
			});
		}
	}, [tokenSocket?.receiver_id, receiver]);
};
