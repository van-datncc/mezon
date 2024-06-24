import { clansActions, notificationActions } from '@mezon/store';
import { gifsActions } from 'libs/store/src/lib/giftStickerEmojiPanel/gifs.slice';
import { CustomLoaderFunction } from './appLoader';

export const mainLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(clansActions.fetchClans());
	dispatch(notificationActions.fetchListNotification());
	// store.dispatch(emojiSuggestionActions.fetchEmoji());
	dispatch(gifsActions.fetchGifCategories());
	dispatch(gifsActions.fetchGifCategoryFeatured());

	return null;
};

export const shouldRevalidateMain = () => {
	return false;
};
