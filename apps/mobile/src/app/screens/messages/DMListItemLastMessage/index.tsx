import { size, useTheme } from '@mezon/mobile-ui';
import { ETokenMessage, IExtendedMessage, getSrcEmoji } from '@mezon/utils';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import ImageNative from '../../../components/ImageNative';
import { style } from './styles';

interface ElementToken {
	s?: number;
	e?: number;
	kindOf: ETokenMessage;
	emojiid?: string;
}

type IEmojiMarkup = {
	shortname: string;
	emojiid: string;
};

const EmojiMarkup = ({ shortname, emojiid }: IEmojiMarkup) => {
	const srcEmoji = getSrcEmoji(emojiid);

	if (!srcEmoji) {
		return shortname;
	}
	return `${EMOJI_KEY}${srcEmoji}${EMOJI_KEY}`;
};

const isHeadingText = (text?: string) => {
	if (!text) return false;
	const headingMatchRegex = /^(#{1,6})\s+(.+)$/;
	return headingMatchRegex?.test(text?.trim());
};

const EMOJI_KEY = '[ICON_EMOJI]';
export const DmListItemLastMessage = (props: { content: IExtendedMessage; styleText?: any }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t, ej = [] } = props.content || {};
	const emojis = Array.isArray(ej) ? ej.map((item) => ({ ...item, kindOf: ETokenMessage.EMOJIS })) : [];
	const elements: ElementToken[] = [...emojis].sort((a, b) => (a.s ?? 0) - (b.s ?? 0));

	const formatEmojiInText = useMemo(() => {
		let formattedContent = '';
		let lastIndex = 0;

		elements.forEach(({ s = 0, e = 0, kindOf, emojiid }) => {
			const contentInElement = t?.substring?.(s, e);
			if (lastIndex < s) {
				formattedContent += t?.slice?.(lastIndex, s)?.toString() ?? '';
			}
			if (kindOf === ETokenMessage.EMOJIS) {
				formattedContent += EmojiMarkup({ shortname: contentInElement, emojiid: emojiid });
			}
			lastIndex = e;
		});
		if (lastIndex < t?.length) {
			formattedContent += t?.slice?.(lastIndex)?.toString();
		}

		return formattedContent;
	}, [elements, t]);

	const convertTextToEmoji = () => {
		const parts = [];
		let startIndex = 0;
		let endIndex = formatEmojiInText.indexOf(EMOJI_KEY, startIndex);

		if (isHeadingText(formatEmojiInText)) {
			const headingMatch = formatEmojiInText?.match(/^#{1,6}\s*([^\s]+)/);
			const headingContent = headingMatch ? headingMatch[1] : '';
			parts.push(
				<Text key="heading" style={[styles.message, props?.styleText && props?.styleText, { fontWeight: 'bold', fontSize: size.medium }]}>
					{headingContent}
				</Text>
			);
			return parts;
		}

		while (endIndex !== -1) {
			const textPart = formatEmojiInText.slice(startIndex, endIndex);
			if (textPart) {
				parts.push(
					<Text key={`${endIndex}_${textPart}`} style={[styles.message, props?.styleText && props?.styleText]}>
						{textPart}
					</Text>
				);
			}

			startIndex = endIndex + EMOJI_KEY.length;
			endIndex = formatEmojiInText.indexOf(EMOJI_KEY, startIndex);

			if (endIndex !== -1) {
				const emojiUrl = formatEmojiInText.slice(startIndex, endIndex);
				parts.push(<ImageNative key={`${emojiUrl}_dm_item_last_${endIndex}`} style={styles.emoji} url={emojiUrl} resizeMode="contain" />);
				startIndex = endIndex + EMOJI_KEY.length;
				endIndex = formatEmojiInText.indexOf(EMOJI_KEY, startIndex);
			}
		}

		if (startIndex < formatEmojiInText.length) {
			parts.push(
				<Text key={`${endIndex}_${formatEmojiInText.slice(startIndex)}`} style={[styles.message, props?.styleText && props?.styleText]}>
					{formatEmojiInText.slice(startIndex)}
				</Text>
			);
		}

		return parts;
	};

	return (
		<View style={styles.container}>
			<Text numberOfLines={1} style={[styles.dmMessageContainer, props?.styleText]}>
				{convertTextToEmoji()}
			</Text>
		</View>
	);
};
