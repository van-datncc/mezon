import { useEffect, useRef } from 'react';

export const useAnchor = (targetRef: React.MutableRefObject<Element>, anchorRef: React.MutableRefObject<Element>) => {
	const anchor = useRef<{
		observer: IntersectionObserver | null;
		parentElement: Element | null;
		anchorElement: Element | null;
		anchored: boolean;
		setup: (targetElement: Element, anchorElement: Element) => IntersectionObserver | null;
		drop: () => void;
		raise: () => void;
		clean: () => void;
	}>({
		observer: null,
		anchored: false,
		parentElement: null,
		anchorElement: null,
		setup: function (targetElement, anchorElement) {
			this.parentElement = targetElement;
			this.anchorElement = anchorElement;
			if (this.observer) {
				this.clean();
			}

			if (!this.parentElement || !this.anchorElement) {
				return null;
			}

			this.observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							requestAnimationFrame(() => {
								this.anchorElement?.scrollIntoView();
							});
						}
					});
				},
				{
					root: this.parentElement,
					rootMargin: '0px',
					threshold: 1.0
				}
			);
			return this.observer;
		},
		drop: function () {
			if (!this.anchored && this.observer && this.anchorElement) {
				this.observer?.observe(this.anchorElement);
				this.anchored = true;
			}
		},
		raise: function () {
			if (this.anchored && this.observer && this.anchorElement) {
				this.observer.unobserve(this.anchorElement);
				this.anchored = false;
			}
		},
		clean: function () {
			this.observer?.disconnect();
			this.observer = null;
		}
	});

	useEffect(() => {
		const observer = anchor.current.setup(targetRef?.current, anchorRef?.current);
		return () => observer?.disconnect();
	}, [targetRef, anchorRef]);

	return anchor;
};
