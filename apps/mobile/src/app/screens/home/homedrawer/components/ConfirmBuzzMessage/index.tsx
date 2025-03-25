import { useTheme } from '@mezon/mobile-ui';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import useTabletLandscape from '../../../../../hooks/useTabletLandscape';
import { style } from './styles';

interface IBuzzMessageModalProps {
	isVisible: boolean;
	onClose: () => void;
	onSubmit: (text: string) => void;
}

export const ConfirmBuzzMessageModal = memo((props: IBuzzMessageModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { isVisible, onClose, onSubmit } = props;
	const isTabletLandscape = useTabletLandscape();
	const [messageBuzz, setMessageBuzz] = useState<string>('');
	const { t } = useTranslation('message');

	const onConfirm = async () => {
		onClose();
		onSubmit(messageBuzz);
	};
	return (
		<Modal
			isVisible={isVisible}
			animationIn={'fadeIn'}
			hasBackdrop={true}
			coverScreen={true}
			avoidKeyboard={false}
			backdropColor={'rgba(0,0,0, 0.7)'}
			onBackdropPress={onClose}
		>
			<View style={[styles.container, isTabletLandscape && { maxWidth: '40%' }]}>
				<View>
					<Text style={styles.title}>{t('buzz.description')}</Text>
				</View>
				<View style={styles.textBox}>
					<TextInput style={styles.input} onChangeText={setMessageBuzz} />
				</View>
				<View style={styles.buttonsWrapper}>
					<TouchableOpacity onPress={() => onConfirm()} style={styles.yesButton}>
						<Text style={styles.buttonText}>{t('buzz.confirmText')}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
});
