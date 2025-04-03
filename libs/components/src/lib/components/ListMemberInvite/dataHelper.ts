import { DirectEntity, FriendsEntity, UsersEntity } from '@mezon/store';

// Define the return type for clarity
interface ProcessedUser {
	id: string;
	username: string;
	display_name: string;
	avatar_url: string;
}

export function processUserData(
	allUsesInAllClansEntities: Record<string, UsersEntity>,
	friends: FriendsEntity[],
	dmGroupChatList: DirectEntity[]
): ProcessedUser[] {
	const existingUsers = Object.values(allUsesInAllClansEntities);
	const existingIds = new Set(existingUsers.map((user) => user.id));

	const usersFromAllClans: ProcessedUser[] = existingUsers.map((user) => ({
		id: user.id || '',
		username: user.username || '',
		display_name: user.display_name || '',
		avatar_url: user.avatar_url || ''
	}));

	const usersFromFriends: ProcessedUser[] = friends
		.filter((friend) => friend?.user?.id && !existingIds.has(friend.user.id))
		.map((friend) => ({
			id: friend?.user?.id || '',
			username: friend?.user?.username || '',
			display_name: friend?.user?.display_name || '',
			avatar_url: friend?.user?.avatar_url || ''
		}));

	const usersFromDmGroupChat: ProcessedUser[] = [];

	dmGroupChatList.forEach((chat) => {
		if (chat?.user_id && Array.isArray(chat.user_id)) {
			for (let i = 0; i < chat.user_id.length; i++) {
				const userId = chat.user_id[i];

				if (!userId || existingIds.has(userId)) continue;

				if (usersFromDmGroupChat.some((u) => u.id === userId)) continue;

				const username = chat?.usernames?.[i] || '';
				const displayName = chat?.display_names?.[i] || username;
				const avatarUrl = chat?.channel_avatar?.[i] || '';

				usersFromDmGroupChat.push({
					id: userId,
					username: username,
					display_name: displayName,
					avatar_url: avatarUrl
				});

				existingIds.add(userId);
			}
		}
	});

	return [...usersFromAllClans, ...usersFromFriends, ...usersFromDmGroupChat];
}
