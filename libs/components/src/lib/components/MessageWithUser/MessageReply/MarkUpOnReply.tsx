import { memo } from 'react';
import HashTagMentionById from './HashTagMentionById';

interface IMarkUpOnReply {
	mention: any[];
	onClickToMove: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

const MarkUpOnReply = ({ mention, onClickToMove }: IMarkUpOnReply) => {
	const processedMessage = mention.reduce((acc: any, item, index) => {
		let markUpId = '';

		if (item.matchedText.startsWith('<#') || item.matchedText.startsWith('@') || item.matchedText.startsWith(':')) {
			markUpId = item.matchedText;
		}

		if (markUpId) {
			acc.push(<span key={`nonMatchText-${index}`}>{item.nonMatchText}</span>, 
			<HashTagMentionById key={`markUpId-${index}`} id={markUpId} />);
		} else {
			acc.push(<span key={`nonMatchText-${index}`}>{item.nonMatchText}</span>);
		}
		return acc;
	}, []);
	return (
		<span
			onClick={onClickToMove}
			className="one-line dark:hover:text-white dark:text-[#A8BAB8] text-[#818388]  hover:text-[#060607] cursor-pointer noselect"
		>
			{processedMessage}
		</span>
	);
};

export default memo(MarkUpOnReply);
