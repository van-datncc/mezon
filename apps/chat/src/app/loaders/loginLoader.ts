import { getStoreAsync, selectInitialPath } from '@mezon/store';
import { LoaderFunction } from 'react-router-dom';

export interface ILoginLoaderData {
    initialPath: string;
	redirectTo?: string;
}

function getRedirectTo(initialPath?: string): string {
	const searchParams = new URLSearchParams(window.location.search);
	const redirectParam = searchParams.get('redirect');

	if (redirectParam) {
		return redirectParam;
	}

	if (initialPath && !initialPath.startsWith('/guess')) {
		return initialPath;
	}

	return '/chat/direct/friends';
}

export const loginLoader: LoaderFunction = async () => {
	const store = await getStoreAsync();

	const initialPath = selectInitialPath(store.getState());

	const redirectTo = getRedirectTo(initialPath);

	return {
        initialPath,
		redirectTo,
    } as ILoginLoaderData;
};

export const shouldRevalidateLogin = () => {
	return false;
};
