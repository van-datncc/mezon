import { appActions, selectIsShowMemberList, useAppDispatch } from "@mezon/store";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export function useApp(){
    const dispatch = useAppDispatch();
    const isShowMemberList = useSelector(selectIsShowMemberList);

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
		}),
		[
            isShowMemberList,
            setIsShowMemberList,
        ],
	);
}