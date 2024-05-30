import MarkdownFormatText from '../MarkdownFormatText';
import { useMessageLine } from './useMessageLine';

type MessageLineProps = {
	line: string;
};

// TODO: refactor component for message lines
const MessageLine = ({ line }: MessageLineProps) => {
	return (
		<div className="pt-[0.3rem]">
			<MarkdownFormatText lineMessage={line} />
		</div>
	);
};

export default MessageLine;
