import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { style } from './styles';
import { Icons } from '@mezon/mobile-components';

interface IRenderFooterModalProps {
	onClose?: any;
}

export const RenderHeaderModal = React.memo((props: IRenderFooterModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={props.onClose} style={styles.btnCloseHeader}>
			<Icons.CloseSmallIcon color={'white'} height={30} width={30} />
		</TouchableOpacity>
	);
});
