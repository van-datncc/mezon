import MarkdownFormatText from '../MarkdownFormatText';
import { useMessageLine } from './useMessageLine';

type MessageLineProps = {
	line: string;
};

// TODO: refactor component for message lines
const MessageLine = ({ line }: MessageLineProps) => {
	const { mentions, isOnlyEmoji } = useMessageLine(line);

	return (
		<div className="pt-[0.3rem]">
			<MarkdownFormatText mentions={mentions} isOnlyEmoji={isOnlyEmoji} />
		</div>
	);
};

export default MessageLine;
