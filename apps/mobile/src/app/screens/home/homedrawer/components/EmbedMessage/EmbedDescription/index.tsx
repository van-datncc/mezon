import { useTheme } from '@mezon/mobile-ui';
import { IExtendedMessage, processText } from '@mezon/utils';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { RenderTextMarkdownContent } from '../../RenderTextMarkdown';
import { style } from './styles';

interface EmbedDescriptionProps {
	description: string;
}

export const EmbedDescription = memo(({ description }: EmbedDescriptionProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { links, markdowns, voiceRooms } = processText(description);

	const markdownContent = useMemo(() => {
		const markdown: IExtendedMessage = {
			t: description,
			hg: [],
			ej: [],
			lk: links || [],
			mk: markdowns || [],
			vk: voiceRooms || [],
			mentions: []
		};

		return markdown;
	}, [description, links, markdowns, voiceRooms]);

	return (
		<View style={styles.container}>
			<RenderTextMarkdownContent content={markdownContent} />
		</View>
	);
});
