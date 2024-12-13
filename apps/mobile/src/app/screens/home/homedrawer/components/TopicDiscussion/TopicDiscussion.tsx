import { Block, Text, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { style } from './styles';

export default function TopicDiscussion() {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	return (
		<Block>
			<Text>TopicDiscussion</Text>
		</Block>
	);
}
