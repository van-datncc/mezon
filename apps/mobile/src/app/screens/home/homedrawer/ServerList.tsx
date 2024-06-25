import { Colors } from '@mezon/mobile-ui';
import { appActions, clansActions, getStoreAsync, selectAllClans, selectCurrentClan } from '@mezon/store-mobile';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useSelector } from 'react-redux';
import LogoMezon from '../../../../assets/svg/logoMezon.svg';
import { ClanIcon } from './Reusables';
import ListClanPopupProps from './components/ListClanPopup';
import { styles } from './styles';
import { UnreadDMBadgeList } from './components/UnreadDMBadgeList';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { SeparatorWithLine } from '../../../components/Common';
import { PlusGreenIcon } from '@mezon/mobile-components';

const ServerList = React.memo((props: any) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const clans = useSelector(selectAllClans);
	const currentClan = useSelector(selectCurrentClan);
	const timeoutRef = useRef<any>();

	const handleChangeClan = async (clanId: string) => {
		timeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, 200);
		const store = await getStoreAsync();
		store.dispatch(appActions.setLoadingMainMobile(true));
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
	}

	return (
		<View style={styles.wrapperServerList}>
			<TouchableOpacity onPress={() => navigateToDM()}>
				<LogoMezon width={50} height={50} />
			</TouchableOpacity>

			<SeparatorWithLine style={{width: '60%'}} />

			<UnreadDMBadgeList />

			<ClanIcon data={currentClan} onPress={handleChangeClan} isActive={true} />

			<Tooltip
				isVisible={isVisible}
				closeOnBackgroundInteraction={true}
				disableShadow={true}
				closeOnContentInteraction={true}
				content={<ListClanPopupProps handleChangeClan={handleChangeClan} clans={clans} />}
				contentStyle={{ backgroundColor: Colors.secondary }}
				placement="bottom"
				onClose={() => setIsVisible(false)}
			>
				<Pressable
					style={styles.wrapperPlusClan}
					onPress={() => {
						setIsVisible(!isVisible);
					}}
				>
					<PlusGreenIcon width={30} height={30}/>
				</Pressable>
			</Tooltip>
		</View>
	);
});

export default ServerList;
