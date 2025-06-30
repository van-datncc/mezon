import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { addQuickMenuAccess, listQuickMenuAccess, updateQuickMenuAccess, useAppDispatch } from '@mezon/store-mobile';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MezonInput from '../../../componentUI/MezonInput';
import { style } from './quickAction.style';
interface ModalQuickMenuProps {
	readonly initialFormKey: string;
	readonly initialFormValue: string;
	readonly editKey: string;
	readonly channelId: string;
	readonly clanId: string;
}

export default function ModalQuickMenu({ initialFormKey, initialFormValue, editKey, channelId, clanId }: ModalQuickMenuProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('channelSetting');
	const dispatch = useAppDispatch();
	const [formKey, setFormKey] = useState(initialFormKey);
	const [formValue, setFormValue] = useState(initialFormValue);

	const onSubmit = async () => {
		if (!formKey || !formValue || !clanId) return;
		try {
			if (editKey) {
				await dispatch(
					updateQuickMenuAccess({
						id: editKey,
						channelId,
						clanId,
						menu_name: formKey,
						action_msg: formValue
					})
				).unwrap();
			} else {
				await dispatch(
					addQuickMenuAccess({
						channelId,
						clanId,
						menu_name: formKey,
						action_msg: formValue
					})
				).unwrap();
			}

			await dispatch(listQuickMenuAccess({ channelId }));
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: `Error: ${error.message}`
			});
		}
	};

	const onCancel = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalBox}>
				<MezonInput placeHolder={t('quickAction.keyTitle')} value={formKey} onTextChange={setFormKey} />
				<MezonInput
					placeHolder={t('quickAction.valueTitle')}
					value={formValue}
					onTextChange={setFormValue}
					textarea={true}
					maxCharacter={300}
				/>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: size.s_10 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: baseColor.bgButtonPrimary,
							padding: size.s_12,
							borderRadius: size.s_6,
							marginRight: size.s_6
						}}
						onPress={onSubmit}
					>
						<Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{t('quickAction.save')}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: baseColor.bgButtonSecondary,
							padding: size.s_12,
							borderRadius: size.s_6,
							marginLeft: size.s_6
						}}
						onPress={onCancel}
					>
						<Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{t('quickAction.cancel')}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity style={styles.backdrop} onPress={onCancel} />
		</View>
	);
}
