import { useFriends } from '@mezon/core';
import { Icons, STORAGE_CHANNEL_CURRENT_CACHE, remove } from '@mezon/mobile-components';
import { baseColor, useTheme } from '@mezon/mobile-ui';
import { clansActions, getStoreAsync, selectAllClans, selectCurrentClan } from '@mezon/store-mobile';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSelector } from 'react-redux';
import LogoMezon from '../../../../../assets/svg/logoMezon.svg';
import { SeparatorWithLine } from '../../../../components/Common';
import { APP_SCREEN } from '../../../../navigation/ScreenTypes';
import { ClanIcon } from '../components/ClanIcon';
import ListClanPopupProps from '../components/ListClanPopup';
import { UnreadDMBadgeList } from '../components/UnreadDMBadgeList';
import { style } from './styles';

const ServerList = React.memo((props: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const clans = useSelector(selectAllClans);
	const currentClan = useSelector(selectCurrentClan);
	const timeoutRef = useRef<any>();
	const { quantityPendingRequest } = useFriends();

	const handleChangeClan = async (clanId: string) => {
		timeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, 200);
		const store = await getStoreAsync();
		await remove(STORAGE_CHANNEL_CURRENT_CACHE);
		store.dispatch(clansActions.joinClan({ clanId: clanId }));
		store.dispatch(clansActions.changeCurrentClan({ clanId: clanId }));
	};

	useEffect(() => {
		return () => {
			timeoutRef?.current && clearTimeout(timeoutRef.current);
		};
	}, []);

	const navigateToDM = () => {
		props.navigation.navigate(APP_SCREEN.MESSAGES.HOME);
	};

	return (
		<View style={styles.wrapperServerList}>
			<TouchableOpacity onPress={() => navigateToDM()}>
				<LogoMezon width={50} height={50} />
				{quantityPendingRequest ? (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{quantityPendingRequest}</Text>
					</View>
				) : null}
			</TouchableOpacity>

			<SeparatorWithLine style={{ width: '60%' }} />

			<UnreadDMBadgeList />

			<ClanIcon data={currentClan} onPress={handleChangeClan} isActive={true} />

			<Tooltip
				isVisible={isVisible}
				closeOnBackgroundInteraction={true}
				disableShadow={true}
				closeOnContentInteraction={true}
				content={<ListClanPopupProps handleChangeClan={handleChangeClan} clans={clans} />}
				contentStyle={{ backgroundColor: themeValue.primary }}
				placement="bottom"
				onClose={() => setIsVisible(false)}
			>
				<Pressable
					style={styles.wrapperPlusClan}
					onPress={() => {
						setIsVisible(!isVisible);
					}}
				>
					<Icons.PlusLargeIcon color={baseColor.green} />
				</Pressable>
			</Tooltip>
		</View>
	);
});

export default ServerList;
