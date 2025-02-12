import { size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StatusBarHeight = () => {
	const insets = useSafeAreaInsets();
	const { themeValue } = useTheme();

	const statusBarHeight = Platform.OS === 'android' ? 0 : insets.top || size.s_50;

	return <View style={{ backgroundColor: themeValue.primary, height: statusBarHeight }} />;
};

export default React.memo(StatusBarHeight);
