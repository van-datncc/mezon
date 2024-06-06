import { Colors } from '@mezon/mobile-ui';
import { IEmojiImage } from '@mezon/utils';
import React from 'react';
import { Text, View } from 'react-native';
import { highlightEmojiRegex, mentionRegex, mentionRegexSplit } from '../../../../../utils/helpers';
import { styles } from './RenderTextContent.styles';
import { getChannelById } from '@mezon/mobile-components';

const renderTextWithMention = (text: string, matchesMention: RegExpMatchArray) => {
	const parts = text
		.split(mentionRegexSplit)
		.filter(Boolean)
		.filter((i) => i !== '@' && i !== '#');
	return parts.map((part, index) => {
		if (!part) return <View />;

		return (
			<Text
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				onTouchEnd={() => {
					if (matchesMention.includes(part)) {
					}
				}}
				key={index}
				style={matchesMention.includes(part) ? styles.contentMessageMention : styles.contentMessageBox}
			>
				{renderTextWithEmoji(part)}
			</Text>
		);
	});
};
const renderTextWithEmoji = (text: string, emojiListPNG?: IEmojiImage[]) => {
	const parts = text.split(highlightEmojiRegex);
	return parts.map((part, index) => {
		const isHighlighted = highlightEmojiRegex.test(part);
		return (
			<Text key={index} style={isHighlighted && { fontWeight: 'bold', color: Colors.bgViolet }}>
				{part}
			</Text>
		);
	});
};

export const renderTextContent = (text: string, emojiListPNG?: IEmojiImage[]) => {
	const matchesMention = text.match(mentionRegex);
	if (matchesMention?.length) {
		return <Text>{renderTextWithMention(text, matchesMention)}</Text>;
	} else {
		return <Text>{renderTextWithEmoji(text)}</Text>;
	}
};
