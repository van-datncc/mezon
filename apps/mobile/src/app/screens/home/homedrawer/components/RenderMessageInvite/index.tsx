import { urlRegex } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Text, View } from 'react-native';
import LinkInvite from './LinkInvite';
import { style } from './RenderMessageInvite.styles';

interface IRenderMessageInviteProps {
	content: string;
}

function RenderMessageInvite({ content }: IRenderMessageInviteProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const parts = content?.split(urlRegex);

	return (
		<View>
			{parts?.map((part, index) => {
				if (urlRegex?.test(part)) {
					return <LinkInvite content={content} part={part} />;
				}
				return part ? (
					<Text style={styles.textContent} key={index}>
						{part}
					</Text>
				) : null;
			})}
		</View>
	);
}

export default React.memo(RenderMessageInvite);
