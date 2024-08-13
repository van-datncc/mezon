import { PlusAltIcon } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { ClansEntity, selectCurrentClan } from '@mezon/store-mobile';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ClanIcon } from '../ClanIcon';
import CreateClanModal from '../CreateClanModal';
import { style } from './styles';

interface ListClanPopupProps {
	clans: ClansEntity[];
	handleChangeClan: (clan_id: string) => void;
}

const ListClanPopupProps: React.FC<ListClanPopupProps> = React.memo(({ clans, handleChangeClan }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const currentClan = useSelector(selectCurrentClan);
	const [isVisibleCreateClanModal, setIsVisibleCreateClanModal] = useState<boolean>(false);

	const visibleCreateClanModal = (value) => {
		setIsVisibleCreateClanModal(value);
	};

	return (
		<View style={styles.clansBox}>
			{clans?.length > 0
				? clans?.map((clan) => (
						<ClanIcon
							data={clan}
              clanIconStyle={styles.mt10}
							onPress={handleChangeClan}
							isActive={currentClan?.clan_id === clan?.clan_id}
						/>
					))
				: null}

			<Pressable
				style={styles.createClan}
				onPress={() => {
					setIsVisibleCreateClanModal(!isVisibleCreateClanModal);
				}}
			>
				<View style={styles.wrapperPlusClan}>
					<PlusAltIcon width={size.s_14} height={size.s_14} />
				</View>
			</Pressable>
			<CreateClanModal visible={isVisibleCreateClanModal} setVisible={visibleCreateClanModal} />
		</View>
	);
});

export default ListClanPopupProps;
