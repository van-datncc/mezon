import { useMemberStatus } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { EventManagementEntity, selectEventById, selectMemberClanByUserId2, useAppSelector } from '@mezon/store-mobile';
import { Text, View } from 'react-native';
import MezonAvatar from '../../../componentUI/MezonAvatar';
import { getUserStatusByMetadata } from '../../../utils/helpers';
import { style } from './styles';

interface IEventMemberProps {
	event: EventManagementEntity;
}

const Avatar = ({ id, index }: { id: string; index: number }) => {
	const user = useAppSelector((state) => selectMemberClanByUserId2(state, id || ''));
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const userStatus = useMemberStatus(id || '');

	const customStatus = getUserStatusByMetadata(user?.user?.metadata);

	return (
		<View style={styles.item}>
			<MezonAvatar
				key={index.toString()}
				height={40}
				width={40}
				avatarUrl={user?.clan_avatar || user?.user?.avatar_url}
				username={user?.clan_nick || user?.user?.display_name || user?.user?.username}
				userStatus={userStatus}
				customStatus={customStatus}
			/>
			<Text style={styles.text}>{user?.clan_nick || user?.user?.display_name || user?.user?.username}</Text>
		</View>
	);
};

export function EventMember({ event }: IEventMemberProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const currentEvent = useAppSelector((state) => selectEventById(state, event?.clan_id ?? '', event?.id ?? ''));

	return <View style={styles.container}>{currentEvent?.user_ids?.map((uid, index) => <Avatar id={uid} index={index} />)}</View>;
}
