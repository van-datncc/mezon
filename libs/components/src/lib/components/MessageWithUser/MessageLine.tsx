import { useMemo } from 'react';
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
	const { mentions, isOnlyEmoji, imageLinks } = useMessageLine(line);
	const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp)$/i;

	const isOnlyImageLink = useMemo(() => {
		const check = imageUrlPattern.test(line);
		return check;
	}, [line]);

	return (
		<div className="pt-[0.2rem] pl-0">
			{!isOnlyImageLink && <MarkdownFormatText mentions={mentions} isOnlyEmoji={isOnlyEmoji} mode={mode} lengthLine={line.length} />}
			{imageLinks.length > 0 &&
				imageLinks?.map((item, index) => {
					return <MessageImage key={index} attachmentData={{ url: item.matchedText }} />;
				})}
		</div>
	);
};

export default MessageLine;
