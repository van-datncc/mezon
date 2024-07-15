import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';

interface IMezonConfirmProps {
	visible?: boolean;
	title: string;
	children?: ReactNode;
	confirmText: string;
	content?: string;
	onVisibleChange?: (visible: boolean) => void;
	onConfirm?: () => void;
}
export default function MezonConfirm({ children, visible, onVisibleChange, title, confirmText, content, onConfirm }: IMezonConfirmProps) {
	function handleClose() {
		onVisibleChange && onVisibleChange(false);
	}

	function handleConfirm() {
		onConfirm && onConfirm();
		onVisibleChange && onVisibleChange(false);
	}

	return (
		<Modal
			isVisible={visible}
			animationIn={'bounceIn'}
			animationOut={'bounceOut'}
			hasBackdrop={true}
			coverScreen={true}
			avoidKeyboard={false}
			onBackdropPress={handleClose}
			onSwipeComplete={handleClose}
			backdropColor={'rgba(0,0,0, 0.7)'}
		>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>{title}</Text>
				</View>

				{children ? children : <Text style={styles.contentText}>{content || ''}</Text>}

				<View style={styles.btnWrapper}>
					<TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => handleConfirm()}>
						<Text style={styles.btnText}>{confirmText}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btn} onPress={() => handleClose()}>
						<Text style={styles.btnText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}
