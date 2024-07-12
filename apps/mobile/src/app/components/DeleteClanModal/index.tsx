import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './DeleteClanModal.styles';
import { clansActions, getStoreAsync, selectAllClans, selectCurrentClan, useAppDispatch } from '@mezon/store-mobile';
import { useSelector } from 'react-redux';
import { remove, STORAGE_CHANNEL_CURRENT_CACHE } from '@mezon/mobile-components';
import { useNavigation } from '@react-navigation/native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { useTranslation } from 'react-i18next';

const DeleteClanModal = ({ isVisibleModal, visibleChange,  }: { isVisibleModal: boolean; visibleChange: (isVisible: boolean) => void }) => {
  const { dismiss } = useBottomSheetModal();
	const currentClan = useSelector(selectCurrentClan);
  const { t } = useTranslation(["deleteClan"]);
	const dispatch = useAppDispatch();
	const clans = useSelector(selectAllClans);
  const navigation = useNavigation<any>();

  const onConfirm = async () => {
    const store = await getStoreAsync();
    navigation.navigate(APP_SCREEN.HOME);
    dismiss();
    visibleChange(false);
    await dispatch(clansActions.deleteClan({clanId: currentClan?.clan_id || ""}));
		await remove(STORAGE_CHANNEL_CURRENT_CACHE);
		store.dispatch(clansActions.joinClan({ clanId: clans[0]?.clan_id }));
		store.dispatch(clansActions.changeCurrentClan({ clanId: clans[0]?.clan_id }));
  };

  const onCancel = () => {
    visibleChange(false)
  };
	return (
		<Modal
			isVisible={isVisibleModal}
			animationIn={'fadeIn'}
			hasBackdrop={true}
			coverScreen={true}
			avoidKeyboard={false}
			backdropColor={'rgba(0, 0, 0, 0.5)'}
		>
			<View style={styles.modalContainer}>
				<Text style={styles.title}>{t("deleteClanModal.title")}</Text>
				<Text style={styles.description}>{t("deleteClanModal.description",{currentClan:  currentClan?.clan_name})}</Text>
				<View>
					<TouchableOpacity
						onPress={onConfirm}
						style={styles.yesButton}
					>
						<Text style={styles.textButton}>{t("deleteClanModal.confirm")}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onCancel} style={styles.noButton}>
						<Text style={styles.textButton}>{t("deleteClanModal.cancel")}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default DeleteClanModal;
