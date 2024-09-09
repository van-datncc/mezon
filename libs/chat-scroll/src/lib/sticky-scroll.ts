import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useAnchor } from './anchor';
import { useScroll } from './scroll';

const UI_STABILITY_TIMEOUT = 1000;

/**
 * React hook for keeping HTML element scroll at the bottom when content updates (if it is already at the bottom).
 * @param targetRef Reference of scrollable HTML element.
 * @param anchorRef Reference of anchor HTML element. Scroll would be kept at anchor until user scrolls.
 */
export const useStickyScroll = (
	targetRef: React.MutableRefObject<Element>,
	anchorRef: React.MutableRefObject<Element>,
	options?: IUseStickyScrollOptions
): IUseStickyScrollResponse => {
	const [enabled, setEnabled] = useState<boolean>(options?.enabled ?? true);
	const { setScrollEventHandler } = useScroll(targetRef, { debounce: 0 });
	const anchor = useAnchor(targetRef, anchorRef);

	/**
	 * Scrolls to anchor.
	 */
	const scrollToAnchor = useCallback(() => {
		return new Promise<boolean>((resolve) => {
			// ensure view rendered before scrolling
			setTimeout(() => {
				if (!anchorRef.current) {
					return resolve(false);
				}
				anchorRef.current?.scrollIntoView();
				resolve(true);
			}, 0);
		});
	}, [anchorRef]);

	const scrollToAnchorImmediately = useCallback(() => {
		requestAnimationFrame(() => {
			anchorRef.current?.scrollIntoView();
		});
	}, [anchorRef]);

	useLayoutEffect(() => {
		let shouldSCroll = true;
		let scrollTimeoutId: NodeJS.Timeout | null = null;
		if (targetRef.current && shouldSCroll) {
			scrollToAnchorImmediately();
		}
		scrollTimeoutId && clearTimeout(scrollTimeoutId);
		// assume 1s for the ui is stable
		scrollTimeoutId = setTimeout(() => {
			shouldSCroll = false;
		}, UI_STABILITY_TIMEOUT);
		return () => scrollTimeoutId && clearTimeout(scrollTimeoutId);
	}, [targetRef, scrollToAnchorImmediately]);

	useEffect(() => {
		setScrollEventHandler(() => {
			const target = targetRef?.current;
			if (!target) {
				return;
			}

			const { scrollTop, scrollHeight, clientHeight } = target;
			const isAtBottom = scrollTop + clientHeight >= scrollHeight;

			if (isAtBottom) {
				anchor.current.drop();
			} else {
				anchor.current.raise();
			}
		});
	}, [targetRef, anchor, setScrollEventHandler]);

	/**
	 * Scrolls to message with given id.
	 */
	const scrollToMessage = useCallback(
		(id: string) => {
			let scrollTimeoutId: NodeJS.Timeout | null = null;
			return new Promise<boolean>((resolve) => {
				scrollTimeoutId && clearTimeout(scrollTimeoutId);
				scrollTimeoutId = setTimeout(() => {
					requestAnimationFrame(() => {
						const messageElement = targetRef.current.querySelector(`#msg-${id}`);
						if (messageElement) {
							messageElement.scrollIntoView({ behavior: 'instant' });
							return resolve(true);
						}
						return resolve(false);
					});
				}, 0);
			});
		},
		[targetRef]
	);

	/**
	 * Enables sticky scroll behavior.
	 */
	const enable = () => setEnabled(true);

	/**
	 * Disables sticky scroll behavior.
	 */
	const disable = () => setEnabled(false);

	return {
		enabled,
		scrollToAnchor,
		scrollToMessage,
		enable,
		disable
	};
};

/**
 * Data and metadata for chat scroll.
 */
export interface IChatScrollData {
	/**
	 * Array of data items displayed in a scrollable HTML element.
	 */
	data: any[];

	/**
	 * has next page
	 */
	hasNextPage: boolean;

	/**
	 * has previous page
	 */
	hasPreviousPage: boolean;
}

/**
 * Accepted options for customizing useStickyScroll hook.
 */
export interface IUseStickyScrollOptions {
	/**
	 * Defines whether sticky scroll behavior is enabled initially.
	 */
	enabled?: boolean;

	/**
	 * Defines sticky scroll threshold.
	 */
	threshold?: number;
}

/**
 * Flags and methods provided by useStickyScroll hook.
 */
export interface IUseStickyScrollResponse {
	/**
	 * True when sticky scroll behavior is enabled.
	 */
	enabled: boolean;

	/**
	 * Scrolls to the anchor element.
	 */
	scrollToAnchor: () => Promise<boolean>;

	/**
	 * Scrolls to message with given id.
	 */
	scrollToMessage: (id: string) => Promise<boolean>;

	/**
	 * Enables sticky scroll behavior.
	 */
	enable: () => void;

	/**
	 * Disables sticky scroll behavior.
	 */
	disable: () => void;
}
