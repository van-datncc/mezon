import { useEffect } from 'react';
import type { AnyToVoidFunction } from '../types';
import { createCallbackManager } from '../utils';
import useLastCallback from './useLastCallback';

const blurCallbacks = createCallbackManager();
const focusCallbacks = createCallbackManager();

let isFocused = typeof document !== 'undefined' ? document.hasFocus() : true;

let backgroundFocusListenersAttached = false;

function ensureBackgroundFocusListeners(): void {
	if (backgroundFocusListenersAttached || typeof window === 'undefined') {
		return;
	}
	backgroundFocusListenersAttached = true;
	isFocused = document.hasFocus();
	window.addEventListener('blur', () => {
		if (!isFocused) {
			return;
		}

		isFocused = false;
		blurCallbacks.runCallbacks();
	});

	window.addEventListener('focus', () => {
		isFocused = true;
		focusCallbacks.runCallbacks();
	});
}

export function useBackgroundMode(onBlur?: AnyToVoidFunction, onFocus?: AnyToVoidFunction, isDisabled = false) {
	const lastOnBlur = useLastCallback(onBlur);
	const lastOnFocus = useLastCallback(onFocus);

	useEffect(() => {
		if (isDisabled) {
			return undefined;
		}

		ensureBackgroundFocusListeners();

		if (!isFocused) {
			lastOnBlur();
		}

		blurCallbacks.addCallback(lastOnBlur);
		focusCallbacks.addCallback(lastOnFocus);

		return () => {
			focusCallbacks.removeCallback(lastOnFocus);
			blurCallbacks.removeCallback(lastOnBlur);
		};
	}, [isDisabled, lastOnBlur, lastOnFocus]);
}

export function isBackgroundModeActive() {
	return !isFocused;
}

export function isUiActive(): boolean {
	if (typeof document === 'undefined') {
		return true;
	}
	if (document.visibilityState !== 'visible') {
		return false;
	}

	return true;
}
