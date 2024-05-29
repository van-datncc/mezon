import { useNavigation } from '@react-navigation/native';

import { MuteIcon, SearchIcon, SettingIcon, ThreadIcon } from '@mezon/mobile-components';
import { Pressable, Text, View } from 'react-native';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import styles from './style';
import { IChannel } from '@mezon/utils';
import { useMemo } from 'react';

export default function ActionRow({directMessage} : {directMessage: IChannel}) {
	const navigation = useNavigation();

	const actionList = useMemo(() => {
		const actions = [
			{
				title: 'Search',
				action: () => {},
				icon: <SearchIcon width={22} height={22} />,
			},
			{
				title: 'Threads',
				action: () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD });
				},
				icon: <ThreadIcon width={22} height={22} />,
			},
			{
				title: 'Mute',
				action: () => {},
				icon: <MuteIcon width={22} height={22} />,
			},
			{
				title: 'Settings',
				action: () => {},
				icon: <SettingIcon width={22} height={22} />,
			},
		];

		if (directMessage?.id) {
			return actions.filter((action) => ['Search', 'Mute'].includes(action.title))
		}
		return actions;
	}, [directMessage])

	return (
		<View style={styles.container}>
			{actionList.map((action, index) => (
				<Pressable key={index.toString()} onPress={action.action}>
					<View style={styles.iconBtn}>
						<View style={styles.iconWrapper}>{action.icon}</View>

						<Text style={styles.optionText}>{action.title}</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
}
