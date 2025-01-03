import { Icons } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { CanvasAPIEntity } from '@mezon/store-mobile';
import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { style } from './styles';

type CanvasItemProps = {
	canvas: CanvasAPIEntity;
	onPressItem?: () => void;
};

const CanvasItem = memo(({ canvas, onPressItem }: CanvasItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const title = canvas?.title ? canvas?.title?.replace(/\n/g, ' ') : 'Untitled';

	return (
		<TouchableOpacity style={styles.container} onPress={onPressItem}>
			<Text style={styles.title} numberOfLines={1}>
				{title}
			</Text>
			<Icons.ChevronSmallRightIcon height={size.s_16} width={size.s_16} color={themeValue.text} />
		</TouchableOpacity>
	);
});

export default CanvasItem;
