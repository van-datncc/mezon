import { isOnline$, socketState } from '@mezon/transport';
import { isUiActive } from '@mezon/utils';
import { useEffect, useRef } from 'react';

import { resetReconnectWave } from '../utils/socketReconnectBudget';

export type UseReconnectOnForegroundOptions = {
	scheduleReconnect: (reason: string) => void;
	debouncedScheduleMs?: number;
};


export function useReconnectOnForeground({ scheduleReconnect, debouncedScheduleMs = 3000 }: UseReconnectOnForegroundOptions) {
	const lastOnlineRef = useRef<boolean | null>(null);
	const leftAppSurfaceRef = useRef(false);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return undefined;
		}

		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const armReconnect = () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
			const delayMs = debouncedScheduleMs + Math.floor(Math.random() * 1200);
			timeoutId = setTimeout(() => {
				timeoutId = null;
				if (isUiActive() && socketState.status === 'disconnected') {
					scheduleReconnect('Window focus/online event, attempting to reconnect...');
				}
			}, delayMs);
		};

		const refreshAndReconnect = () => {
			resetReconnectWave();
			armReconnect();
		};

		const markLeftSurface = () => {
			leftAppSurfaceRef.current = true;
		};

		const onMaybeReturnedToApp = () => {
			if (!leftAppSurfaceRef.current) {
				return;
			}
			if (!isUiActive()) {
				return;
			}
			leftAppSurfaceRef.current = false;
			refreshAndReconnect();
		};

		const onBlur = () => {
			markLeftSurface();
		};

		const onVisibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				markLeftSurface();
				return;
			}
			onMaybeReturnedToApp();
		};

		const onFocus = () => {
			onMaybeReturnedToApp();
		};

		const sub = isOnline$().subscribe((online) => {
			if (lastOnlineRef.current === false && online === true) {
				refreshAndReconnect();
			}
			lastOnlineRef.current = online;
		});

		window.addEventListener('blur', onBlur);
		window.addEventListener('focus', onFocus);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
			sub.unsubscribe();
			window.removeEventListener('blur', onBlur);
			window.removeEventListener('focus', onFocus);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, [scheduleReconnect, debouncedScheduleMs]);
}
