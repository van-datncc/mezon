import { useTheme } from '@mezon/mobile-ui';
import { IMessageRatioOption } from '@mezon/utils';
import { memo } from 'react';
import { Text, View } from 'react-native';
import MezonRadioButton from '../../../../../../../componentUI/MezonRadioButton';
import { style } from './styles';

interface EmbedRadioProps {
	option: IMessageRatioOption;
	checked: boolean;
	onCheck: () => void;
}

export const EmbedRadioButton = memo(({ option, checked, onCheck }: EmbedRadioProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={styles.option}>
			<View style={styles.itemDetail}>
				{option?.label && <Text style={styles.name}>{option?.label}</Text>}
				{option?.description && <Text style={styles.value}>{option?.description}</Text>}
			</View>
			<MezonRadioButton checked={checked} onChange={onCheck} />
		</View>
	);
});
