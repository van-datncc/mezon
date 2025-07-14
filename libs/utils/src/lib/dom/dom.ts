export function findParentByClass(element: HTMLElement, className: string): HTMLElement | null {
	let parent = element.parentElement;
	while (parent) {
		if (parent.classList.contains(className)) {
			return parent;
		}
		parent = parent.parentElement;
	}
	return null;
}

const disabledElements = new WeakSet<HTMLElement>();

function _toggleDisableHoverImpl(element: HTMLDivElement | null, timeoutId: React.MutableRefObject<NodeJS.Timeout | null>) {
	if (!element) return;

	timeoutId.current && clearTimeout(timeoutId.current);
	if (disabledElements.has(element)) {
		timeoutId.current = setTimeout(() => {
			requestAnimationFrame(() => {
				element.classList.remove('disable-hover');
				disabledElements.delete(element);
			});
		}, 300);
		return;
	}

	element.classList.add('disable-hover');
	disabledElements.add(element);

	timeoutId.current = setTimeout(() => {
		requestAnimationFrame(() => {
			element.classList.remove('disable-hover');
			disabledElements.delete(element);
		});
	}, 300);
}

export const toggleDisableHover = _toggleDisableHoverImpl;
