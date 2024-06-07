import { TickIcon } from '@mezon/mobile-components';
import { Colors } from '@mezon/mobile-ui';
import { ClansEntity, clansActions, getStoreAsync, selectCurrentClan } from '@mezon/store-mobile';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import PlusGreenIcon from '../../../../../../assets/svg/guildAddCategoryChannel.svg';
import { ClanIcon } from '../../Reusables';
import CreateClanModal from '../CreateClanModal';
import { styles } from './ListClanPopup.styles';

interface ListClanPopupProps {
	clans: ClansEntity[];
  handleChangeClan: (clan_id: string)=> void;
}

const ListClanPopupProps: React.FC<ListClanPopupProps> = React.memo(({ clans, handleChangeClan }) => {
	const { t } = useTranslation(['clan']);
	const scrollViewRef = useRef(null);
	const currentClan = useSelector(selectCurrentClan);
	const [isVisibleCreateClanModal, setIsVisibleCreateClanModal] = useState<boolean>(false);

	const visibleCreateClanModal = (value) => {
		setIsVisibleCreateClanModal(value);
	};

	useEffect(() => {
		if (currentClan) {
			scrollToCurrentClan();
		}
	}, [currentClan]);

	const scrollToCurrentClan = () => {
		const currentIndex = clans.findIndex((server) => server.clan_id === currentClan.clan_id);

		if (currentIndex !== -1 && scrollViewRef.current) {
			const itemHeight = 50;
			const scrollOffset = currentIndex * itemHeight;

			scrollViewRef.current.scrollTo({ y: scrollOffset, animated: true });
		}
	};

	return (
		<View style={styles.clansBox}>
			<ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
				{clans.map((server) => (
					<Pressable
						onPress={() => {
							handleChangeClan(server.clan_id);
						}}
						key={server.id}
						style={[styles.serverItem, { backgroundColor: currentClan?.clan_id === server?.clan_id ? '#141c2a' : Colors.secondary }]}
					>
						<View style={styles.serverName}>
							<ClanIcon data={server} />
							<Text style={styles.clanName} numberOfLines={1} ellipsizeMode='tail'>{server?.clan_name}</Text>
						</View>
						{currentClan?.clan_id === server?.clan_id && <TickIcon width={10} height={10} color={Colors.azureBlue} />}
					</Pressable>
				))}
			</ScrollView>
			<Pressable
				onPress={() => {
					setIsVisibleCreateClanModal(!isVisibleCreateClanModal);
				}}
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? Colors.bgDarkMidnightBlue : Colors.secondary,
					},
					styles.createClan,
				]}
			>
				<View style={styles.wrapperPlusClan}>
					<PlusGreenIcon width={30} height={30} />
				</View>
				<Text style={styles.clanName}>{t('addClan')}</Text>
			</Pressable>
			<CreateClanModal visible={isVisibleCreateClanModal} setVisible={visibleCreateClanModal} />
		</View>
	);
});

export default ListClanPopupProps;
