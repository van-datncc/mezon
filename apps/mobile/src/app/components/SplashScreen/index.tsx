import { Block, useTheme } from '@mezon/mobile-ui';
import React from 'react';

const SplashScreen = () => {
	const { themeValue } = useTheme();

	return <Block backgroundColor={themeValue.secondary} />;
};

export default SplashScreen;
