import { useFriends } from '@mezon/core';
import { STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_CLAN_ID, remove, save, setDefaultChannelLoader } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { channelsActions, clansActions, getStoreAsync, selectAllClans } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import LogoMezon from '../../../../../assets/svg/logoMezon.svg';
import { SeparatorWithLine } from '../../../../components/Common';
import { APP_SCREEN } from '../../../../navigation/ScreenTypes';
import ListClanPopupProps from '../components/ListClanPopup';
import { UnreadDMBadgeList } from '../components/UnreadDMBadgeList';
import { style } from './styles';

const ServerList = React.memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const clans = useSelector(selectAllClans);
	const { quantityPendingRequest } = useFriends();
	const navigation = useNavigation<any>();

	const handleChangeClan = async (clanId: string) => {
		const store = await getStoreAsync();
		await remove(STORAGE_CHANNEL_CURRENT_CACHE);
		store.dispatch(clansActions.joinClan({ clanId: clanId }));
		save(STORAGE_CLAN_ID, clanId);
		store.dispatch(clansActions.changeCurrentClan({ clanId: clanId }));
		const respChannel = await store.dispatch(channelsActions.fetchChannels({ clanId: clanId, noCache: true }));
		await setDefaultChannelLoader(respChannel.payload, clanId);
	};

	const navigateToDM = () => {
		navigation.navigate(APP_SCREEN.MESSAGES.HOME);
	};

	return (
		<View style={styles.wrapperServerList}>
			<ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
				<TouchableOpacity onPress={() => navigateToDM()}>
					<LogoMezon width={50} height={50} />
					{quantityPendingRequest ? (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>{quantityPendingRequest}</Text>
						</View>
					) : null}
				</TouchableOpacity>
				<SeparatorWithLine style={styles.separatorLine} />
				<UnreadDMBadgeList />
				<ListClanPopupProps handleChangeClan={handleChangeClan} clans={clans} />
			</ScrollView>
		</View>
	);
});

export default ServerList;
