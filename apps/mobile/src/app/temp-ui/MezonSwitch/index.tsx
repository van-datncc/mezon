import { useTheme } from '@mezon/mobile-ui';
import React, { useEffect, useState } from 'react';
import { SwitchProps, TouchableOpacity, View } from 'react-native';
import { style } from './styles';

export const MezonSwitch = ({ value, onValueChange }: SwitchProps) => {
	const [isEnabled, setIsEnabled] = useState(value);
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	useEffect(() => {
		if (value !== isEnabled) setIsEnabled(value);
	}, [value]);

	const toggleSwitch = () => {
		onValueChange && onValueChange(!isEnabled);
		setIsEnabled((previousState) => !previousState);
	};

	return (
		<TouchableOpacity style={[styles.switchContainer, isEnabled ? styles.switchContainerEnabled : {}]} onPress={toggleSwitch}>
			<View style={[styles.circle, isEnabled ? styles.circleEnabled : {}]} />
		</TouchableOpacity>
	);
};
