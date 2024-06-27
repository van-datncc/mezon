import { memo } from 'react';
import ReactionPartItem from '../ReactionPartItem';

interface IReactionPart {
	emojiList: any[];
}

const ReactionPart: React.FC<IReactionPart> = ({ emojiList }) => {
	return (
		<div className="flex justify-evenly gap-x-1 mb-1">
			{emojiList.map((item, index) => {
				return <ReactionPartItem key={item} emojiShortCode={item} />;
			})}
		</div>
	);
};

export default memo(ReactionPart);
