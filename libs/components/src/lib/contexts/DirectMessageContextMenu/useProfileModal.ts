import { useModal } from 'react-modal-hook';
import UserProfileModalInner from '../../components/UserProfileModalInner';

interface UseProfileModalParams {
	currentUser: any;
}

export function useProfileModal({ currentUser }: UseProfileModalParams) {
	const [openUserProfile, closeUserProfile] = useModal(() => {
		if (!currentUser) return null;

		const userId = currentUser?.id || currentUser?.user_id?.[0];
		const directId = (currentUser as any)?.channel_id || currentUser?.channelId;
		const avatar = currentUser?.avatar_url || currentUser?.channel_avatar?.[0];
		const name = currentUser?.display_name || currentUser?.username || currentUser?.display_names?.[0];
		const isOnline = typeof currentUser?.metadata === 'object' ? currentUser?.metadata?.status === 'ONLINE' : false;
		const isMobile = currentUser?.is_mobile;
		const customStatus = typeof currentUser?.metadata === 'object' ? currentUser?.metadata?.status : undefined;

		return UserProfileModalInner({
			userId,
			directId,
			onClose: closeUserProfile,
			isDM: true,
			user: currentUser,
			avatar,
			name,
			status: {
				status: isOnline,
				isMobile
			},
			customStatus
		});
	}, [currentUser]);

	return {
		openUserProfile,
		closeUserProfile
	};
}
