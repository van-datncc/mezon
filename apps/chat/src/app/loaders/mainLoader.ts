import { acitvitiesActions, appActions, clansActions, gifsActions } from '@mezon/store';
import { CustomLoaderFunction } from './appLoader';

export const mainLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(clansActions.fetchClans());
	dispatch(acitvitiesActions.listActivities());
	dispatch(gifsActions.fetchGifCategories());
	dispatch(gifsActions.fetchGifCategoryFeatured());
	dispatch(appActions.setIsShowPopupQuickMess(false));
	return null;
};

export const shouldRevalidateMain = () => {
	return false;
};
