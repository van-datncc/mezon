import { useTheme } from '@mezon/mobile-ui';
import { Pressable, StyleProp, Text, TextStyle } from 'react-native';
import { style } from './styles';

interface IMezonButton {
	icon?: any;
	title?: string;
	titleStyle?: StyleProp<TextStyle>;
	fluid?: boolean;
	border?: boolean;
	type?: 'success' | 'warning' | 'danger' | 'theme';
	size?: "md" | "lg"
	onPress?: () => void;
}

export default function MezonButton({ icon, title, titleStyle, fluid, border, type, onPress, size = "md" }: IMezonButton) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	function renderContainerStyle() {
		if (type === 'success') return styles.containerSuccess;
		if (type === 'warning') return styles.containerWarning;
		if (type === 'danger') return styles.containerDanger;
		if (type === 'theme') return styles.containerTheme;
		return {};
	}

	function renderContainerSize() {
		if (size === "md") return styles.containerMd;
		if (size === "lg") return styles.containerLg;
		return {};
	}

	return (
		<Pressable style={[
			styles.container,
			fluid && styles.fluid,
			border && styles.border,
			renderContainerStyle(),
			renderContainerSize()]
		} onPress={onPress}>
			{icon}
			{title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
		</Pressable>
	);
}
