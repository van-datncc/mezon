import { gifsStickerEmojiActions, useAppDispatch } from '@mezon/store';
import { SubPanelName } from '@mezon/utils';
import { selectSubPanelActive } from 'libs/store/src/lib/giftStickerEmojiPanel/gifsStickerEmoji.slice';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useGifsStickersEmoji() {
	const dispatch = useAppDispatch();
	const subPanelActive = useSelector(selectSubPanelActive);

	const setSubPanelActive = useCallback(
		(state: SubPanelName) => {
			dispatch(gifsStickerEmojiActions.setSubPanelActive(state));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			subPanelActive,
			setSubPanelActive,
		}),
		[subPanelActive, setSubPanelActive],
	);
}
