import { AnyToVoidFunction, debounce, throttle, windowSize } from '@mezon/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

const THROTTLE = 250;

export function useWindowSize(onResize?: (size: { width: number; height: number }) => void) {
	const { width: initialWidth, height: initialHeight } = windowSize.get();
	const [width, setWidth] = useState(initialWidth);
	const [height, setHeight] = useState(initialHeight);
	const [isResizing, setIsResizing] = useState(false);
	const setIsResizingDebounced = useDebouncedCallback(setIsResizing, [setIsResizing], THROTTLE, true);

	useEffect(() => {
		const throttledSetIsResizing = throttle(
			() => {
				setIsResizing(true);
			},
			THROTTLE,
			true
		);

		const throttledSetSize = throttle(
			() => {
				const { width: newWidth, height: newHeight } = windowSize.get();
				setWidth(newWidth);
				setHeight(newHeight);
				setIsResizingDebounced(false);
				onResize?.({ width: newWidth, height: newHeight });
			},
			THROTTLE,
			false
		);

		const handleResize = () => {
			throttledSetIsResizing();
			throttledSetSize();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [setIsResizingDebounced, onResize]);

	return useMemo(() => ({ width, height, isResizing }), [height, isResizing, width]);
}

export function useDebouncedCallback<T extends AnyToVoidFunction>(fn: T, deps: any[], ms: number, noFirst = false, noLast = false) {
	const fnMemo = useCallback(fn, deps);

	return useMemo(() => {
		return debounce(fnMemo, ms, !noFirst, !noLast);
	}, [fnMemo, ms, noFirst, noLast]);
}
