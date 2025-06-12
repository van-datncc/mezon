import { useFriends } from '@mezon/core';
import { CheckIcon, CloseIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @nx/enforce-module-boundaries
import Toast from 'react-native-toast-message';

export function useFriendsBlock() {
	const { blockFriend, unBlockFriend } = useFriends();
	const { t } = useTranslation('dmMessage');

	const onBlockFriend = useCallback(
		async (username: string, id: string) => {
			try {
				const isBlocked = await blockFriend(username, id);
				if (isBlocked) {
					Toast.show({
						type: 'success',
						props: {
							text2: t('notification.blockUser.success'),
							leadingIcon: <CheckIcon color={Colors.green} width={20} height={20} />
						}
					});
				}
			} catch (error) {
				Toast.show({
					type: 'error',
					props: {
						text2: t('notification.blockUser.error'),
						leadingIcon: <CloseIcon color={Colors.red} width={20} height={20} />
					}
				});
			}
		},
		[blockFriend, t]
	);

	const onUnblockFriend = useCallback(
		async (username: string, id: string) => {
			try {
				const isUnblocked = await unBlockFriend(username, id);
				if (isUnblocked) {
					Toast.show({
						type: 'success',
						props: {
							text2: t('notification.unblockUser.success'),
							leadingIcon: <CheckIcon color={Colors.green} width={20} height={20} />
						}
					});
				}
			} catch (error) {
				Toast.show({
					type: 'error',
					props: {
						text2: t('notification.unblockUser.error'),
						leadingIcon: <CloseIcon color={Colors.red} width={20} height={20} />
					}
				});
			}
		},
		[unBlockFriend, t]
	);

	return {
		onBlockFriend,
		onUnblockFriend
	};
}
