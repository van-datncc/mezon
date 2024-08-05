import { emojiSuggestionActions, notificationActions, settingClanStickerActions } from '@mezon/store';
import { CustomLoaderFunction } from './appLoader';

export const directLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(emojiSuggestionActions.fetchEmoji({ clanId: '0', noCache: true }));
	dispatch(settingClanStickerActions.fetchStickerByClanId({ clanId: '0', noCache: true }));
	dispatch(notificationActions.fetchListNotification('0'));
	return null;
};
