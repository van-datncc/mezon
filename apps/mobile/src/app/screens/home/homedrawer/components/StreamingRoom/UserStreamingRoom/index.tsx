import { useTheme } from '@mezon/mobile-ui';
import { UsersStreamEntity } from '@mezon/store-mobile';
import React from 'react';
import { View } from 'react-native';
import UserItem from './UserItem';
import { style } from './UserStreamingRoom.styles';

function UserStreamingRoom({ streamChannelMember }: { streamChannelMember: UsersStreamEntity[] }) {
	const users = [
		{
			name: 'ABC',
			avatar: 'https://cdn.mezon.vn/0/0/1779484387973271600/47New_Project__1_.png'
		}
		// {
		// 	name: 'ABC',
		// 	avatar: 'https://cdn.mezon.vn/0/0/1779484387973271600/47New_Project__1_.png'
		// }
	];
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return <View style={styles.gridContainer}>{streamChannelMember?.map((user, index) => <UserItem user={user} key={index} />)}</View>;
}

export default React.memo(UserStreamingRoom);
