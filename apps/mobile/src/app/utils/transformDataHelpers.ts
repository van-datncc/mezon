import { UsersClanEntity } from '@mezon/store-mobile';

export const transformListUserMention = (users: UsersClanEntity[]) => {

	return users?.length ? ( [
		...users,
		{
			user: {
				id: '1775731111020111321',
				display_name: 'here',
				username: 'here',
				avatarUrl: '',
			},
		},
	]) as UsersClanEntity[] : [];
};
