import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';

import { MuteIcon, SearchIcon, SettingIcon, ThreadIcon, UnMuteIcon } from '@mezon/mobile-components';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import useStatusMuteChannel, { EActionMute } from '../../../hooks/useStatusMuteChannel';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { threadDetailContext } from '../MenuThreadDetail';
import styles from './style';

export const ActionRow = React.memo(() => {
	const currentChannel = useContext(threadDetailContext);
	const navigation = useNavigation<any>();
	const { statusMute } = useStatusMuteChannel();
	const [isChannel, setIsChannel] = useState<boolean>();
	useEffect(() => {
		setIsChannel(!!currentChannel?.channel_label && !Number(currentChannel?.parrent_id));
	}, [currentChannel]);
	const actionList = [
		{
			title: 'Search',
			action: () => {},
			icon: <SearchIcon width={22} height={22} />,
			hidden: true,
		},
		{
			title: 'Threads',
			action: () => {
				navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD });
			},
			icon: <ThreadIcon width={22} height={22} />,
			hidden: isChannel,
		},
		{
			title: 'Mute',
			action: () => {
				navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.MUTE_THREAD_DETAIL_CHANNEL });
			},
			icon: statusMute === EActionMute.Mute ? <MuteIcon width={22} height={22} /> : <UnMuteIcon width={22} height={22} />,
			hidden: true,
		},
		{
			title: 'Settings',
			action: () => {
				navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
					screen: APP_SCREEN.MENU_CHANNEL.SETTINGS,
					params: {
						channelId: currentChannel?.channel_id,
					},
				});
			},
			icon: <SettingIcon width={22} height={22} />,
			hidden: true,
		},
	];

	const filteredActionList = useMemo(() => {
		if (currentChannel?.clan_id === '0') {
			return actionList.filter((item) => ['Mute', 'Search'].includes(item.title));
		}
		return actionList;
	}, [currentChannel, isChannel]);
	return (
		<View style={styles.container}>
			{filteredActionList.map((action, index) =>
				action?.hidden ? (
					<Pressable key={index.toString()} onPress={action.action}>
						<View style={styles.iconBtn}>
							<View style={styles.iconWrapper}>{action.icon}</View>
							<Text style={styles.optionText}>{action.title}</Text>
						</View>
					</Pressable>
				) : null,
			)}
		</View>
	);
});
