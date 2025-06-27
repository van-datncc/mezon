import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import MezonInput from '../../../componentUI/MezonInput';
import { style } from './quickAction.style';

interface ModalQuickMenuProps {
	readonly formKey: string;
	readonly formValue: string;
	readonly setFormKey: (v: string) => void;
	readonly setFormValue: (v: string) => void;
	readonly onSave: () => void;
}

export default function ModalQuickMenu({ formKey, formValue, setFormKey, setFormValue, onSave }: ModalQuickMenuProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('channelSetting');

	const onCancel = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalBox}>
				<MezonInput placeHolder={t('quickAction.keyTitle')} value={formKey} onTextChange={setFormKey} />
				<MezonInput placeHolder={t('quickAction.valueTitle')} value={formValue} onTextChange={setFormValue} textarea={true} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: size.s_10 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: baseColor.bgButtonPrimary,
							padding: size.s_12,
							borderRadius: size.s_6,
							marginRight: size.s_6
						}}
						onPress={onSave}
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
		</View>
	);
}
