import { useCallback, useLayoutEffect, useState } from 'react';
import MarkdownFormatText from '../MarkdownFormatText';
import MessageImage from './MessageImage';
import { useMessageLine } from './useMessageLine';

type MessageLineProps = {
	line: string;
	messageId?: string;
	mode?: number;
};

// TODO: refactor component for message lines
const MessageLine = ({ line, messageId, mode }: MessageLineProps) => {
	const { mentions, isOnlyEmoji, links } = useMessageLine(line);
	const [link, setLink] = useState<string | undefined>(undefined);

	const checkLinkImageWork = useCallback((imageLink: string) => {
		const img = new Image();
		img.src = imageLink;
		return new Promise<boolean>((resolve) => {
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
		});
	}, []);

	useLayoutEffect(() => {
		if (
			(links?.length === 1 && links[0].nonMatchText === '') ||
			(links?.length === 1 && links[0].nonMatchText.startsWith('[') && links[0].nonMatchText.endsWith(']('))
		) {
			checkLinkImageWork(links[0].matchedText).then((result) => {
				if (result) {
					setLink(links[0].matchedText);
				} else {
					setLink(undefined);
				}
			});
		} else {
			setLink(undefined);
		}
	}, [links, checkLinkImageWork]);

	return (
		<div className="pt-[0.2rem] pl-0">
			{link === undefined && <MarkdownFormatText mentions={mentions} isOnlyEmoji={isOnlyEmoji} mode={mode} lengthLine={line.length} />}
			{links.length > 0 &&
				links?.map((item, index) => {
					return <MessageImage key={index} attachmentData={{ url: link ? link : item.matchedText }} />;
				})}
		</div>
	);
};

export default MessageLine;
