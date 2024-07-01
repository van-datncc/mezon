import { memo } from 'react';
import ReactionItem from '../ReactionItem';

interface IReactionPart {
	emojiList: any[];
	activeMode: number | undefined;
	messageId: string;
}

const ReactionPart: React.FC<IReactionPart> = ({ emojiList, activeMode, messageId }) => {
	return (
		<div className="flex justify-evenly gap-x-1 mb-1">
			{emojiList.map((item, index) => {
				return <ReactionItem key={item} emojiShortCode={item} activeMode={activeMode} messageId={messageId} />;
			})}
		</div>
	);
};

export default memo(ReactionPart);
