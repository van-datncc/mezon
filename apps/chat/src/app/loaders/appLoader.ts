import { appActions, getStoreAsync } from '@mezon/store';
import { LoaderFunction } from 'react-router-dom';

export interface IAppLoaderData {
    pathname: string;
}

export const appLoader: LoaderFunction = async () => {
	const store = await getStoreAsync();

	const { pathname } = window.location;

	store.dispatch(appActions.setInitialPath(pathname));

	return {
        pathname
    } as IAppLoaderData;
};

export const shouldRevalidateApp = () => {
	return false;
};
