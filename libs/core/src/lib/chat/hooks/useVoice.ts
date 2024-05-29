import { selectStatusCall, voiceActions } from "@mezon/store";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useVoice() {
    const dispatch = useDispatch();
    const statusCall = useSelector(selectStatusCall);

    const setStatusCall = useCallback(
		(value: boolean) => {
			dispatch(voiceActions.setStatusCall(value));
		},
		[dispatch],
	);

    return useMemo(
		() => ({
            statusCall,
            setStatusCall,
		}),
		[
            statusCall,
            setStatusCall,
        ],
	);
}