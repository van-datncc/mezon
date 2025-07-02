import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { memo, useState } from 'react';
import { DeviceEventEmitter, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-image-crop-picker';
import MezonSwitch from '../../../../componentUI/MezonSwitch';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import ImageNative from '../../../ImageNative';
import { style } from './style';

interface IShareEventModalProps {
	isSticker?: boolean;
	image: Image;
	onConfirm?: (image: Image, emojiName: string, isForSale: boolean) => void;
}
export const EmojiPreview = memo(({ isSticker = false, image, onConfirm }: IShareEventModalProps) => {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const styles = style(themeValue, isTabletLandscape);
	const [isForSale, setIsForSale] = useState<boolean>(false);
	const [emojiName, setEmojiName] = useState<string>(`${isSticker ? 'sticker' : 'emoji'}_${Date.now()}`);

	function handleClose() {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	}

	function handleUploadConfirm() {
		if (onConfirm) {
			onConfirm(image, emojiName, isForSale);
			handleClose();
		}
	}

	return (
		<View style={styles.main}>
			<View style={styles.container}>
				<Text style={styles.title}>{isSticker ? 'Sticker' : 'Emoji'} Preview</Text>
				<ImageNative url={image?.path} style={{ height: size.s_40, width: size.s_40 }} />
				<Text style={styles.title}>{isSticker ? 'Sticker' : 'Emoji'} Name</Text>
				<TextInput style={styles.textInput} value={emojiName} onChangeText={setEmojiName} />
				<View style={styles.row}>
					<MezonSwitch value={isForSale} onValueChange={setIsForSale} />
					<Text style={styles.title}>For sale</Text>
				</View>

				<TouchableOpacity style={styles.sendButton} onPress={handleUploadConfirm}>
					<Text style={styles.buttonText}>Upload</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.backdrop} onPress={handleClose} />
		</View>
	);
});
