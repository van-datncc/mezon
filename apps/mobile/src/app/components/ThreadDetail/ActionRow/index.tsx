import { useNavigation } from '@react-navigation/native';

import { MuteIcon, SearchIcon, SettingIcon, ThreadIcon } from '@mezon/mobile-components';
import { Pressable, Text, View } from 'react-native';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import styles from './style';
import { useContext, useMemo } from 'react';
import { threadDetailContext } from '../MenuThreadDetail';
import { ChannelType } from 'mezon-js';

export default function ActionRow() {
	const navigation = useNavigation();
	const currentChannel = useContext(threadDetailContext);

	const actionList = useMemo(() => {
		const actions = [
			{
				key: 1,
				title: 'Search',
				action: () => {},
				icon: <SearchIcon width={22} height={22} />,
			},
			{
				key: 2,
				title: 'Threads',
				action: () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD });
				},
				icon: <ThreadIcon width={22} height={22} />,
			},
			{
				key: 3,
				title: 'Mute',
				action: () => {},
				icon: <MuteIcon width={22} height={22} />,
			},
			{
				key: 4,
				title: 'Settings',
				action: () => {},
				icon: <SettingIcon width={22} height={22} />,
			},
		];

		if ([ChannelType.CHANNEL_TYPE_DM, ChannelType.CHANNEL_TYPE_GROUP].includes(currentChannel?.type)) {
			return actions.filter((action) => ['Search', 'Mute'].includes(action.title))
		}
		return actions;
	}, [currentChannel])

	return (
		<View style={styles.container}>
			{actionList.map((action) => (
				<Pressable key={action.key} onPress={action.action}>
					<View style={styles.iconBtn}>
						<View style={styles.iconWrapper}>{action.icon}</View>

						<Text style={styles.optionText}>{action.title}</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
}
