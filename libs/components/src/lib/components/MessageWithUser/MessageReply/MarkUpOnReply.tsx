import { selectIsUseProfileDM } from '@mezon/store';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import HashTagMentionById from './HashTagMentionById';

interface IMarkUpOnReply {
	mention: any[];
	onClickToMove: (e: React.MouseEvent<HTMLSpanElement>) => void;
	posMention?: boolean;
	parentWidth?: number;
}

const MarkUpOnReply = ({ mention, onClickToMove, posMention, parentWidth }: IMarkUpOnReply) => {
	const isUseProfileDM = useSelector(selectIsUseProfileDM);
	const processedMessage = mention.reduce((acc: any, item, index) => {
		let markUpId = '';

		if (item.matchedText.startsWith('<#') || item.matchedText.startsWith('@') || item.matchedText.startsWith(':')) {
			markUpId = item.matchedText;
		}

		if (markUpId) {
			acc.push(
				<span key={`nonMatchText-${index}`}>{item.nonMatchText}</span>,
				<HashTagMentionById posMention={posMention} key={`markUpId-${index}`} id={markUpId} />,
			);
		} else {
			acc.push(<span key={`nonMatchText-${index}`}>{item.nonMatchText}</span>);
		}
		return acc;
	}, []);

	const spanStyle = {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	};

	return (
		<span
			onClick={onClickToMove}
			className={`${posMention ? ' whitespace-normal' : 'inline whitespace-nowrap overflow-x-hidden'} dark:hover:text-white dark:text-[#A8BAB8] text-[#818388] hover:text-[#060607] cursor-pointer  noselect`}
			style={isUseProfileDM ? { ...spanStyle, width: `${parentWidth && parentWidth - 600}px` } : spanStyle}
		>
			{processedMessage}
		</span>
	);
};

export default memo(MarkUpOnReply);
