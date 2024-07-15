import { useTheme } from '@mezon/mobile-ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { style } from './styles';

interface IMezonRadioButton {
	onChange?: (isCheck: boolean) => void;
	checked?: boolean;
	noSwitchFalse?: boolean;
}

export default function MezonRadioButton({ onChange, checked, noSwitchFalse }: IMezonRadioButton) {
	const styles = style(useTheme().themeValue);
	const [isChecked, setChecked] = useState<boolean>(checked);

	useEffect(() => {
		if (checked != isChecked) setChecked(checked);
	}, [checked]);

	function handleToggle() {
		if (noSwitchFalse) {
			setChecked(true);
			onChange && onChange(true);
		} else {
			onChange && onChange(!isChecked);
			setChecked(!isChecked);
		}
	}

	return (
		<TouchableOpacity onPress={handleToggle} style={styles.container}>
			<View style={[styles.outer, isChecked && styles.outerChecked]}>
				<View style={[styles.inner, isChecked && styles.innerChecked]} />
			</View>
		</TouchableOpacity>
	);
}
