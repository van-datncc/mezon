import { size, useTheme } from '@mezon/mobile-ui';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import { style } from './styles';

interface ISlashCommandMessageProps {
	message: string;
	onCancel?: () => void;
}

export const SlashCommandMessage = memo(({ message, onCancel }: ISlashCommandMessageProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>{message}</Text>
			<Pressable style={styles.cancelButton} onPress={onCancel}>
				<MezonIconCDN icon={IconCDN.closeIcon} color={themeValue.textStrong} width={size.s_16} height={size.s_16} />
			</Pressable>
		</View>
	);
});
