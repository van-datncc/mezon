import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { Buffer } from 'buffer';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import { style } from './styles';
global.Buffer = Buffer;

interface IBuzzMessageModalProps {
	onSubmit: (text: string) => void;
}

export const ModalConfirmPin = memo((props: IBuzzMessageModalProps) => {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [pin, setPin] = useState<string>('');
	const { t } = useTranslation(['token']);

	const onConfirm = async () => {
		if (pin?.length !== 6) {
			Toast.show({
				type: 'error',
				text1: t('pinNotEnough')
			});
			return;
		}
		props.onSubmit(pin);
		// onClose();
	};

	const onClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	return (
		<View style={styles.main}>
			<View style={[styles.container, isTabletLandscape && { maxWidth: '40%' }]}>
				<View style={styles.headerTitle}>
					<MezonIconCDN icon={IconCDN.lockIcon} height={size.s_20} width={size.s_20} color={'white'} />
					<Text style={styles.title}>{t('securityVerification')}</Text>
				</View>
				<Text style={styles.subTitle}>{t('enter6Digit')}</Text>
				<View style={styles.textBox}>
					<TextInput
						style={styles.input}
						autoFocus={true}
						value={pin}
						secureTextEntry={true}
						maxLength={6}
						onChangeText={setPin}
						keyboardType={'numeric'}
					/>
				</View>
				<Text style={styles.description}>{t('dataIsEncrypted')}</Text>

				<View style={styles.buttonsWrapper}>
					<TouchableOpacity onPress={onConfirm} style={styles.yesButton}>
						<MezonIconCDN icon={IconCDN.lockIcon} height={size.s_20} width={size.s_20} color={'white'} />
						<Text style={styles.buttonText}>{t('decryptAndShow')}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity style={styles.backdrop} onPress={onClose} />
		</View>
	);
});
