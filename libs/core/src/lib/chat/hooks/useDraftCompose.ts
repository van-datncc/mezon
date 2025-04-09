import { composeActions, getStore, selectComposeInputByChannelId, useAppDispatch } from '@mezon/store';
import { RequestInput, useSyncEffect } from '@mezon/utils';
import { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function useDraftCompose(channelId: string, debounceTime = 100) {
	const dispatch = useAppDispatch();

	const isInitialChannel = useRef(true);
	const previousChannelId = useRef<string | null>(null);
	const [draftRequest, setDraftRequest] = useState<RequestInput | null>();

	useSyncEffect(() => {
		if (previousChannelId.current !== channelId) {
			const store = getStore();
			const storeRequest = selectComposeInputByChannelId(store.getState(), channelId);

			setDraftRequest(storeRequest);
			isInitialChannel.current = true;
			previousChannelId.current = channelId;
		}
	}, [channelId]);

	const debouncedUpdateStore = useDebouncedCallback((newRequest: RequestInput) => {
		if (channelId) {
			dispatch(
				composeActions.setComposeInput({
					channelId,
					request: newRequest
				})
			);
		}
	}, debounceTime);

	const updateDraft = useCallback(
		(request: RequestInput) => {
			setDraftRequest(request);
			debouncedUpdateStore(request);
			isInitialChannel.current = false;
		},
		[debouncedUpdateStore]
	);

	const clearDraft = useCallback(() => {
		setDraftRequest(null);
		if (channelId) {
			dispatch(composeActions.clearComposeInput({ channelId }));
		}
	}, [channelId, dispatch]);

	return {
		draftRequest,
		updateDraft,
		clearDraft,
		isInitialLoad: isInitialChannel.current
	};
}
