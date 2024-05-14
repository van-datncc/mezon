import { appActions, selectIsShowMemberList, selectTheme, useAppDispatch } from '@mezon/store';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useApp() {
	const dispatch = useAppDispatch();
	const isShowMemberList = useSelector(selectIsShowMemberList);
	const appearanceTheme = useSelector(selectTheme);

	const setAppearanceTheme = useCallback(
		(value: string) => {
			dispatch(appActions.setTheme(value));
		},
		[dispatch],
	);

	const setIsShowMemberList = useCallback(
		(value: boolean) => {
			dispatch(appActions.setIsShowMemberList(value));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			isShowMemberList,
			setIsShowMemberList,
			appearanceTheme,
			setAppearanceTheme,
		}),
		[isShowMemberList, setIsShowMemberList, appearanceTheme, setAppearanceTheme],
	);
}
