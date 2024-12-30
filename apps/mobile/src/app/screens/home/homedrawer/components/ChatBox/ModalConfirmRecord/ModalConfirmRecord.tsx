import { Block, size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { style } from './styles';

interface IModalConfirmRecordProps {
	visible: boolean;
	onConfirm: () => void;
	onBack: () => void;
}
const ModalConfirmRecord = ({ visible, onBack, onConfirm }: IModalConfirmRecordProps) => {
	const { t } = useTranslation(['recordChatMessage']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<Modal statusBarTranslucent={true} animationType="fade" transparent={true} visible={visible}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.modalContainer}>
					<View style={[styles.modalContent, { backgroundColor: themeValue.white }]}>
						<Text style={styles.modalText}>{t('confirmDeleteRecording')}</Text>
						<Block width={'100%'} height={1} backgroundColor={themeValue.borderRadio}></Block>
						<Block flexDirection="row" alignItems="center" justifyContent="flex-end" gap={size.s_20} width={'100%'}>
							<TouchableOpacity style={styles.btn} onPress={onBack}>
								<Text style={styles.hideText}>{t('goBack')}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.btn} onPress={onConfirm}>
								<Text style={styles.yesText}>{t('deleteRecording')}</Text>
							</TouchableOpacity>
						</Block>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

export default React.memo(ModalConfirmRecord);
