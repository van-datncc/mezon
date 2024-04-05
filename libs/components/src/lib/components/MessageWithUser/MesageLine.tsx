import MarkdownFormatText from '../MarkdownFormatText';
import { useMessageLine } from './useMessageLine';

type MessageLineProps = {
	line: string;
};

const LineWithLink = ({ link }: { link: string }) => {
	return (
		<a href={link} className="text-blue-500">
			{link}
		</a>
	);
};

const isLink = (line: string) => {
	if (line.includes(' ')) {
		return false;
	}
	if (line.startsWith('http://') || line.startsWith('https://')) {
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
	const transformedObject = mentions.reduce(
		(accumulator: any, currentItem, currentIndex: number) => {
			if (currentIndex === 0) {
				accumulator.nonMatchTextFist += currentItem.nonMatchText;
			}
			if (currentItem.matchedText !== '') {
				accumulator.matchedText += currentItem.matchedText;
			} else {
				accumulator.nonMatchText += currentItem.nonMatchText;
			}
			return accumulator;
		},
		{ matchedText: '', nonMatchText: '', nonMatchTextFist: '' },
	);

	return (
		<div>
			<MarkdownFormatText
				tagName={transformedObject.matchedText ? transformedObject.matchedText : ''}
				markdown={transformedObject.nonMatchText}
				textFirst={transformedObject.nonMatchTextFist}
			/>
		</div>
	);
};

export default MessageLine;
