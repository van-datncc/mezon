import { size, useTheme } from '@mezon/mobile-ui';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import { style } from './styles';

interface IClipboardImagePreviewProps {
	imageBase64: string;
	message?: string;
	onCancel?: () => void;
}

export const ClipboardImagePreview = memo(({ imageBase64, message, onCancel }: IClipboardImagePreviewProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue, message);

	return (
		<View style={styles.content}>
			<FastImage
				style={styles.image}
				source={{
					uri: imageBase64,
					priority: FastImage.priority.high,
					cache: FastImage.cacheControl.immutable
				}}
				resizeMode={FastImage.resizeMode.cover}
			/>
			{message && (
				<View style={styles.messageContainer}>
					<Text style={styles.message}>{message}</Text>
				</View>
			)}
			{onCancel && (
				<Pressable style={styles.cancelButton} onPress={onCancel}>
					<MezonIconCDN icon={IconCDN.closeIcon} width={size.s_20} height={size.s_20} color={themeValue.text} />
				</Pressable>
			)}
		</View>
	);
});
