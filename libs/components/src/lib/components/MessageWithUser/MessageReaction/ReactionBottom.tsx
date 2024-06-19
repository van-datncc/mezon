import { Icons } from '@mezon/components';
import { useChatReaction, useGifsStickersEmoji } from '@mezon/core';
import { SubPanelName } from '@mezon/utils';
import { useCallback, useEffect, useState } from 'react';

type ReactionBottomProps = {
	smileButtonRef: React.RefObject<HTMLDivElement>;
};

const ReactionBottom = ({ smileButtonRef }: ReactionBottomProps) => {
	const { setUserReactionPanelState, setPositionOfSmileButton } = useChatReaction();
	const [highlightColor, setHighLightColor] = useState('#AEAEAE');
	const { setSubPanelActive, subPanelActive } = useGifsStickersEmoji();
	const handleClickOpenEmojiBottom = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			setSubPanelActive(SubPanelName.EMOJI_REACTION_BOTTOM);
			event.stopPropagation();
		},
		[setSubPanelActive],
	);

	useEffect(() => {
		if (subPanelActive === SubPanelName.EMOJI_REACTION_BOTTOM) {
			setHighLightColor('#FFFFFF');
		}
	});

	const handleHoverSmileButton = useCallback(() => {
		if (smileButtonRef.current) {
			const rect = smileButtonRef.current.getBoundingClientRect();
			setPositionOfSmileButton({
				top: rect.top,
				right: rect.right,
				left: rect.left,
				bottom: rect.bottom,
			});
		}
		setUserReactionPanelState(false);
		setSubPanelActive(SubPanelName.NONE);
	}, [smileButtonRef, setPositionOfSmileButton, setUserReactionPanelState]);

	return (
		<div onMouseEnter={handleHoverSmileButton} onClick={handleClickOpenEmojiBottom} ref={smileButtonRef}>
			<Icons.Smile defaultSize="w-5 h-5" defaultFill={highlightColor} />
		</div>
	);
};

export default ReactionBottom;
