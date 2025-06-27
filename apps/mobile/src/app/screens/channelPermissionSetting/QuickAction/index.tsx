import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, Text, useTheme } from '@mezon/mobile-ui';
import {
	deleteQuickMenuAccess,
	listQuickMenuAccess,
	selectChannelById,
	selectQuickMenuByChannelId,
	useAppDispatch,
	useAppSelector
} from '@mezon/store-mobile';
import { ApiQuickMenuAccess } from 'mezon-js/api.gen';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, FlatList, Platform, TouchableOpacity, View } from 'react-native';
import MezonConfirm from '../../../componentUI/MezonConfirm';
import MezonIconCDN from '../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../constants/icon_cdn';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import ModalQuickMenu from './ModalQuickMenu';
import { style } from './quickAction.style';

type QuickActionScreen = typeof APP_SCREEN.MENU_CHANNEL.QUICK_ACTION;

export function QuickAction({ navigation, route }) {
	const { channelId } = route.params;

	const { t } = useTranslation('channelSetting');

	const dispatch = useAppDispatch();
	const listQuickActions = useAppSelector((state) => selectQuickMenuByChannelId(state, channelId));
	const channel = useAppSelector((state) => selectChannelById(state, channelId || ''));
	const clanId = channel?.clan_id;

	const { themeValue } = useTheme();
	const styles = style(themeValue);

	useEffect(() => {
		dispatch(listQuickMenuAccess({ channelId }));
	}, [channelId, dispatch]);

	useEffect(() => {
		navigation.setOptions({
			headerStatusBarHeight: Platform.OS === 'android' ? 0 : undefined,
			headerTitle: () => (
				<View>
					<Text bold h3 color={themeValue?.white}>
						{t('quickAction.title')}
					</Text>
				</View>
			)
		});
	}, [navigation, listQuickActions]);

	const openModal = (item: ApiQuickMenuAccess | null = null) => {
		const data = {
			children: (
				<ModalQuickMenu
					initialFormKey={item?.menu_name || ''}
					initialFormValue={item?.action_msg || ''}
					editKey={item?.id}
					channelId={channelId}
					clanId={clanId}
				/>
			)
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	};

	const deleteItem = async (id: string) => {
		try {
			await dispatch(deleteQuickMenuAccess({ id, channelId }));
			await dispatch(listQuickMenuAccess({ channelId }));
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
		} catch (error) {
			console.error(error.message);
		}
	};

	const handlePressDeleteCategory = (id: string, item: any) => {
		const data = {
			children: (
				<MezonConfirm
					onConfirm={() => deleteItem(id)}
					title={t('quickAction.deleteModal')}
					confirmText={t('confirm.delete.confirmText')}
					content={t('quickAction.deleteTitle', {
						key: item.menu_name
					})}
				/>
			)
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	};

	const QuickActionItem = ({ item, themeValue, openModal, handleDelete }) => {
		return (
			<View style={styles.item}>
				<View style={{ flex: 1 }}>
					<View style={styles.keyContainer}>
						<Text style={styles.keyText}>/{item.menu_name}</Text>
					</View>
					<Text numberOfLines={1} style={styles.valueText}>
						{item.action_msg}
					</Text>
				</View>
				<TouchableOpacity onPress={() => openModal(item)}>
					<MezonIconCDN icon={IconCDN.editAction} height={size.s_20} width={size.s_30} color={themeValue.textStrong} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => handleDelete(item.id, item)}>
					<MezonIconCDN icon={IconCDN.deleteAction} height={size.s_20} width={size.s_20} color={baseColor.red} />
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: themeValue.primary, paddingHorizontal: size.s_12 }}>
			<FlatList
				data={listQuickActions}
				keyExtractor={(item) => item?.id}
				renderItem={({ item }) => (
					<QuickActionItem item={item} themeValue={themeValue} openModal={openModal} handleDelete={handlePressDeleteCategory} />
				)}
			/>

			<TouchableOpacity style={styles.addButton} onPress={() => openModal(null)}>
				<MezonIconCDN icon={IconCDN.addAction} height={size.s_40} width={size.s_40} color={themeValue.textStrong} />
			</TouchableOpacity>
		</View>
	);
}
