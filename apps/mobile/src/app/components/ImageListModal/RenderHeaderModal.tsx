import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CloseSmallIcon } from '../../../../../../libs/mobile-components/src/lib/icons2';
import { style } from './styles';

interface IRenderFooterModalProps {
	onClose?: any;
}

export const RenderHeaderModal = React.memo((props: IRenderFooterModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={props.onClose} style={styles.btnCloseHeader}>
			<CloseSmallIcon width={30} height={30} color={'white'} />
		</TouchableOpacity>
	);
});
