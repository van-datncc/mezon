import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_CLAN_ID, remove, save, setDefaultChannelLoader } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { channelsActions, clansActions, getStoreAsync, selectAllClans, selectCurrentClan, useAppDispatch } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { MezonConfirm } from '../../temp-ui';
import { styles } from './DeleteClanModal.styles';

const DeleteClanModal = ({ isVisibleModal, visibleChange }: { isVisibleModal: boolean; visibleChange: (isVisible: boolean) => void }) => {
	const { dismiss } = useBottomSheetModal();
	const currentClan = useSelector(selectCurrentClan);
	const { t } = useTranslation(['deleteClan']);
	const dispatch = useAppDispatch();
	const clans = useSelector(selectAllClans);
	const navigation = useNavigation<any>();
	const { themeValue } = useTheme();

	const [inputValue, setInputValue] = useState('');
	const [inputValueIsMatchClanName, setInputValueIsMatchClanName] = useState(true);

	const onConfirm = async () => {
		if (inputValue === currentClan?.clan_name) {
			const store = await getStoreAsync();
			navigation.navigate(APP_SCREEN.HOME);
			dismiss();
			visibleChange(false);
			await dispatch(clansActions.deleteClan({ clanId: currentClan?.clan_id || '' }));
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
			store.dispatch(clansActions.joinClan({ clanId: clans?.[0]?.clan_id }));
			save(STORAGE_CLAN_ID, clans?.[0]?.clan_id);
			store.dispatch(clansActions.changeCurrentClan({ clanId: clans[0]?.clan_id }));
			const respChannel = await store.dispatch(channelsActions.fetchChannels({ clanId: clans[0]?.clan_id, noCache: true }));
			await setDefaultChannelLoader(respChannel.payload, clans[0]?.clan_id);
			visibleChange(false)
		} else {
			setInputValueIsMatchClanName(false)
		}
	};

	const handleClanNameChange =(text: string) => {
		setInputValue(text)
	}

	const handleCancel = () => {
		visibleChange(false)
	}

	return (
		<MezonConfirm
			visible={isVisibleModal}
			onCancel={handleCancel}
			confirmText={t('deleteClanModal.confirm')}
			title={t('deleteClanModal.title')}
			children={(
				<>
					<Text style={styles.contentText}>
						{t('deleteClanModal.description', { currentClan: currentClan?.clan_name })}
					</Text>
					<Text style={styles.label}>
						{t('deleteClanModal.inputClanName')}
					</Text>
					<TextInput 
						style={[styles.input, {backgroundColor: themeValue.bgInputPrimary}]}
						value={inputValue}
						onChangeText={handleClanNameChange}
						autoFocus
					/>
					{!inputValueIsMatchClanName && 
						<Text style={styles.inputError}>{t('deleteClanModal.inputError')}</Text>
					}
				</>
			)}
			onConfirm={onConfirm}
		/>
	);
};

export default DeleteClanModal;
