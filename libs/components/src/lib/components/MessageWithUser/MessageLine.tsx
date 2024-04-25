import MarkdownFormatText from '../MarkdownFormatText';
import { useMessageLine } from './useMessageLine';

type MessageLineProps = {
	line: string;
};

const LineWithLink = ({ link }: { link: string }) => {
	return (
		<a href={link} className="text-blue-500 hover:underline" rel="noopener noreferrer" target="_blank">
			{link}
		</a>
	);
};

const isLink = (line: string) => {
	if (line && line.includes(' ')) {
		return false;
	}
	if ((line && line.startsWith('http://')) || (line && line.startsWith('https://'))) {
		return true;
	}
	return false;
};

// TODO: refactor component for message lines
const MessageLine = ({ line }: MessageLineProps) => {
	const { mentions } = useMessageLine(line);
	if (isLink(line)) {
		return <LineWithLink link={line} />;
	}
	return (
		<div>
			<MarkdownFormatText mentions={mentions} />
		</div>
	);
};

export default MessageLine;
