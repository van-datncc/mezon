import {
	EStateFriend,
	friendsActions,
	requestAddFriendParam,
	selectAllFriends,
	selectCurrentUserId,
	selectDmGroupCurrentId,
	selectGrouplMembers,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// check later
export function useFriends() {
	const friends = useSelector(selectAllFriends);
	const currentDM = useSelector(selectDmGroupCurrentId);
	const groupDmMember = useAppSelector((state) => selectGrouplMembers(state, currentDM as string));
	const numberMemberInDmGroup = useMemo(() => groupDmMember.length, [groupDmMember]);
	const currentUserId = useSelector(selectCurrentUserId);
	const dispatch = useAppDispatch();

	const quantityPendingRequest = useMemo(() => {
		return friends.filter((obj) => obj.state === 2).length || 0;
	}, [friends]);

	const addFriend = useCallback(
		async (requestAddFriend: requestAddFriendParam) => {
			await dispatch(friendsActions.sendRequestAddFriend(requestAddFriend));
		},
		[dispatch]
	);

	const acceptFriend = useCallback(
		(username: string, id: string) => {
			const body = {
				usernames: [username],
				ids: [id]
			};
			dispatch(friendsActions.sendRequestAddFriend(body));
		},
		[dispatch]
	);

	const deleteFriend = useCallback(
		(username: string, id: string) => {
			const body = {
				usernames: [username],
				ids: [id]
			};
			dispatch(friendsActions.sendRequestDeleteFriend(body));
		},
		[dispatch]
	);

	const blockFriend = useCallback(
		async (username: string, id: string) => {
			const body = {
				usernames: [username],
				ids: [id]
			};
			const response = await dispatch(friendsActions.sendRequestBlockFriend(body));

			if (response?.meta?.requestStatus === 'fulfilled') {
				dispatch(
					friendsActions.updateFriendState({
						userId: id,
						friendState: EStateFriend.BLOCK,
						sourceId: currentUserId
					})
				);
				return true;
			}
			return false;
		},
		[dispatch, currentUserId]
	);

	const unBlockFriend = useCallback(
		async (username: string, id: string) => {
			const body = {
				usernames: [username],
				ids: [id]
			};
			const response = await dispatch(friendsActions.sendRequestDeleteFriend(body));
			if (response?.meta?.requestStatus === 'fulfilled') {
				return true;
			}
			return false;
		},
		[dispatch]
	);

	const onBlockFriend = useCallback(
		async (username: string, id: string) => {
			try {
				const isBlocked = await blockFriend(username, id);
				if (isBlocked) {
					toast.success('User blocked successfully');
				}
			} catch (error) {
				toast.error('Failed to block user');
			}
		},
		[blockFriend]
	);

	const onUnblockFriend = useCallback(
		async (username: string, id: string) => {
			try {
				const isUnblocked = await unBlockFriend(username, id);
				if (isUnblocked) {
					toast.success('User unblocked successfully');
				}
			} catch (error) {
				toast.error('Failed to unblock user');
			}
		},
		[unBlockFriend]
	);

	const filteredFriends = useCallback(
		(searchTerm: string, isAddMember?: boolean) => {
			if (isAddMember) {
				return friends.filter((friend) => {
					if (friend.user?.display_name?.toUpperCase().includes(searchTerm) || friend.user?.username?.toUpperCase().includes(searchTerm)) {
						if (!Object.values(groupDmMember)?.some((user) => user.id === friend.id)) {
							return friend;
						}
					}
				});
			}
			return friends.filter(
				(friend) => friend.user?.display_name?.toUpperCase().includes(searchTerm) || friend.user?.username?.toUpperCase().includes(searchTerm)
			);
		},
		[friends]
	);

	return useMemo(
		() => ({
			friends,
			quantityPendingRequest,
			addFriend,
			acceptFriend,
			deleteFriend,
			blockFriend,
			unBlockFriend,
			onBlockFriend,
			onUnblockFriend,
			filteredFriends,
			numberMemberInDmGroup
		}),
		[
			friends,
			quantityPendingRequest,
			addFriend,
			acceptFriend,
			deleteFriend,
			blockFriend,
			unBlockFriend,
			onBlockFriend,
			onUnblockFriend,
			filteredFriends,
			numberMemberInDmGroup
		]
	);
}
