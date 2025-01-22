import { Icons } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { CanvasAPIEntity } from '@mezon/store-mobile';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { style } from './styles';

type CanvasItemProps = {
	canvas: CanvasAPIEntity;
	onPressItem?: () => void;
	onPressDelete?: (canvasId: string) => void;
	onCopyLink?: (canvasId: string) => void;
};

const CanvasItem = memo(({ canvas, onPressItem, onPressDelete, onCopyLink }: CanvasItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const title = canvas?.title ? canvas?.title?.replace(/\n/g, ' ') : 'Untitled';

	const handleDeleteCanvas = () => {
		onPressDelete(canvas?.id);
	};

	const handleCopyLinkToClipboard = () => {
		onCopyLink(canvas?.id);
	};

	return (
		<TouchableOpacity style={styles.container} onPress={onPressItem}>
			<Text style={styles.title} numberOfLines={1}>
				{title}
			</Text>
			<View style={styles.buttonGroup}>
				<TouchableOpacity style={styles.button} onPress={handleCopyLinkToClipboard}>
					<Icons.CopyLink height={size.s_16} width={size.s_16} color={themeValue.text} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={handleDeleteCanvas}>
					<Icons.CircleXIcon height={size.s_30} width={size.s_30} color={baseColor.redStrong} />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
});

export default CanvasItem;
