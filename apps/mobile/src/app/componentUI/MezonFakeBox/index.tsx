import { useTheme } from '@mezon/mobile-ui';
import { ReactNode } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { style } from './styles';

export interface IMezonFakeBoxProps {
	title?: string;
	titleStyle?: StyleProp<TextStyle>;
	titleUppercase?: boolean;
	prefixIcon?: ReactNode;
	postfixIcon?: ReactNode;
	value: string;
	containerStyle?: StyleProp<ViewStyle>;
	onPress?: () => void;
}

export default function MezonFakeInputBox({
	title,
	titleStyle,
	titleUppercase,
	prefixIcon,
	postfixIcon,
	value,
	containerStyle,
	onPress
}: IMezonFakeBoxProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View>
			{title && <Text style={[styles.sectionTitle, titleUppercase ? styles.titleUppercase : {}, titleStyle]}>{title}</Text>}

			<TouchableOpacity onPress={onPress}>
				<View style={[styles.box, containerStyle]}>
					{prefixIcon}
					<Text style={styles.textBox}>{value}</Text>
					{postfixIcon}
				</View>
			</TouchableOpacity>
		</View>
	);
}
