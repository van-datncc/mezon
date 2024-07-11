import React, { useState } from 'react';
import { SwitchProps } from 'react-native';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@mezon/mobile-ui';
import { style } from './styles';
import { useEffect } from 'react';

export const MezonSwitch = ({ value, onValueChange }: SwitchProps) => {
	const [isEnabled, setIsEnabled] = useState(value);
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	useEffect(() => {
		if (value !== isEnabled) setIsEnabled(value);
	}, [value]);

	const toggleSwitch = () => {
		onValueChange && onValueChange(!isEnabled);
		setIsEnabled(previousState => !previousState);
	}

	return (
		<TouchableOpacity
			style={[styles.switchContainer, isEnabled ? styles.switchContainerEnabled : {}]}
			onPress={toggleSwitch}
		>
			<View style={[styles.circle, isEnabled ? styles.circleEnabled : {}]} />
		</TouchableOpacity>
	);
};