import { gifsStickerEmojiActions, useAppDispatch } from '@mezon/store';
import { SubPanelName } from '@mezon/utils';
import { selectGifsStickersEmojiPanelStatus, selectSubPanelActive } from 'libs/store/src/lib/giftStickerEmojiPanel/gifsStickerEmoji.slice';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useGifsStickersEmoji() {
	const dispatch = useAppDispatch();
	const gifsStickersEmojiPanelStatus = useSelector(selectGifsStickersEmojiPanelStatus);
	const subPanelActive = useSelector(selectSubPanelActive);

	const setGifsStickersEmojiPanelStatus = useCallback(
		(state: boolean) => {
			dispatch(gifsStickerEmojiActions.setGifsStickersEmojiPanelStatus(state));
		},
		[dispatch],
	);

	const setSubPanelActive = useCallback(
		(state: SubPanelName) => {
			dispatch(gifsStickerEmojiActions.setSubPanelActive(state));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			gifsStickersEmojiPanelStatus,
			subPanelActive,
			setGifsStickersEmojiPanelStatus,
			setSubPanelActive,
		}),
		[gifsStickersEmojiPanelStatus, subPanelActive, setGifsStickersEmojiPanelStatus, setSubPanelActive],
	);
}
