import { attachmentActions, selectAttachment, selectOpenModalAttachment, useAppDispatch } from "@mezon/store";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export function useAttachments() {
    const dispatch = useAppDispatch();
    const attachment = useSelector(selectAttachment);
    const openModalAttachment = useSelector(selectOpenModalAttachment);

    const setAttachment = useCallback(
		(status: string) => {
			dispatch(attachmentActions.setAttachment(status));
		},
		[dispatch],
	);

    const setOpenModalAttachment = useCallback(
		(status: boolean) => {
			dispatch(attachmentActions.setOpenModalAttachment(status));
		},
		[dispatch],
	);

    return useMemo(
		() => ({
            attachment,
            openModalAttachment,
            setAttachment,
            setOpenModalAttachment,
		}),
		[
			attachment,
            openModalAttachment,
            setAttachment,
            setOpenModalAttachment,
		],
	);
}