import { cleanupEffect, isSignal, NoneToVoidFunction } from '@mezon/utils';
import { useRef } from 'react';
import { useUnmountCleanup } from './useUnmountCleanup';

export function useSignalEffect(effect: NoneToVoidFunction, dependencies: readonly any[]) {
	const isFirstRun = useRef(true);
	if (isFirstRun.current) {
		isFirstRun.current = false;

		dependencies?.forEach((dependency) => {
			if (isSignal(dependency)) {
				dependency.subscribe(effect);
			}
		});
	}

	useUnmountCleanup(() => {
		cleanupEffect(effect);
	});
}
