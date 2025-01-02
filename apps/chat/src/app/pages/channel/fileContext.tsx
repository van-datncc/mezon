// InfiniteList.tsx
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface InfiniteListProps<T> {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	loadMore: (direction: 'top' | 'bottom') => Promise<void>;
	hasMore: { top: boolean; bottom: boolean };
	threshold?: number;
	batchSize?: number;
	className?: string;
	style?: CSSProperties;
	loadingComponent?: React.ReactNode;
	onVisibilityChange?: (isVisible: boolean, direction: 'top' | 'bottom') => void;
	initialScrollIndex?: number;
}

const InfiniteList = <T,>({
	items,
	renderItem,
	loadMore,
	hasMore,
	threshold = 200,
	batchSize = 20,
	className = '',
	style = {},
	loadingComponent,
	onVisibilityChange,
	initialScrollIndex = 0
}: InfiniteListProps<T>) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const topObserverRef = useRef<IntersectionObserver | null>(null);
	const bottomObserverRef = useRef<IntersectionObserver | null>(null);
	const fragmentRef = useRef<DocumentFragment | null>(null);
	const batchesRef = useRef<HTMLDivElement[]>([]);

	const [isLoading, setIsLoading] = useState({ top: false, bottom: false });
	const [displayedItems, setDisplayedItems] = useState<T[]>([]);
	const [batchCount, setBatchCount] = useState(0);
	const [scrollPosition, setScrollPosition] = useState<number | null>(null);
	const [previousHeight, setPreviousHeight] = useState<number>(0);

	// Create and append new batch
	const appendBatch = useCallback(
		(newItems: T[], batchIndex: number, position: 'top' | 'bottom') => {
			if (!containerRef.current) return;

			const fragment = document.createDocumentFragment();
			fragmentRef.current = fragment;

			const batchWrapper = document.createElement('div');
			batchWrapper.className = `infinite-list-batch batch-${batchIndex}`;
			batchWrapper.dataset.batchIndex = String(batchIndex);

			const tempDiv = document.createElement('div');
			ReactDOM.render(
				<div className={`batch-content-${batchIndex}`}>
					{newItems.map((item, idx) => (
						<React.Fragment key={batchIndex * batchSize + idx}>{renderItem(item, batchIndex * batchSize + idx)}</React.Fragment>
					))}
				</div>,
				tempDiv
			);

			while (tempDiv.firstChild) {
				batchWrapper.appendChild(tempDiv.firstChild);
			}

			if (position === 'top') {
				// Save scroll position before adding content
				if (containerRef.current) {
					setPreviousHeight(containerRef.current.scrollHeight);
				}

				fragment.appendChild(batchWrapper);
				containerRef.current.insertBefore(fragment, containerRef.current.firstChild);
			} else {
				fragment.appendChild(batchWrapper);
				containerRef.current.appendChild(fragment);
			}

			batchesRef.current.push(batchWrapper);
		},
		[batchSize, renderItem]
	);

	// Setup Intersection Observers
	const setupObservers = useCallback(() => {
		if (!containerRef.current) return;

		const options = {
			root: containerRef.current,
			rootMargin: `${threshold}px`,
			threshold: 0
		};

		// Top observer
		topObserverRef.current = new IntersectionObserver(async (entries) => {
			const [entry] = entries;
			if (entry.isIntersecting && !isLoading.top && hasMore.top) {
				onVisibilityChange?.(true, 'top');
				setIsLoading((prev) => ({ ...prev, top: true }));
				await loadMore('top');
				setIsLoading((prev) => ({ ...prev, top: false }));
			}
		}, options);

		// Bottom observer
		bottomObserverRef.current = new IntersectionObserver(async (entries) => {
			const [entry] = entries;
			if (entry.isIntersecting && !isLoading.bottom && hasMore.bottom) {
				onVisibilityChange?.(true, 'bottom');
				setIsLoading((prev) => ({ ...prev, bottom: true }));
				await loadMore('bottom');
				setIsLoading((prev) => ({ ...prev, bottom: false }));
			}
		}, options);

		// Create and observe sentinels
		const topSentinel = document.createElement('div');
		const bottomSentinel = document.createElement('div');

		topSentinel.className = 'infinite-list-sentinel top-sentinel';
		bottomSentinel.className = 'infinite-list-sentinel bottom-sentinel';

		containerRef.current.insertBefore(topSentinel, containerRef.current.firstChild);
		containerRef.current.appendChild(bottomSentinel);

		topObserverRef.current.observe(topSentinel);
		bottomObserverRef.current.observe(bottomSentinel);

		return () => {
			topObserverRef.current?.disconnect();
			bottomObserverRef.current?.disconnect();
		};
	}, [threshold, isLoading, hasMore, loadMore, onVisibilityChange]);

	// Initialize
	useEffect(() => {
		const initialItems = items.slice(0, batchSize);
		setDisplayedItems(initialItems);
		setBatchCount(1);

		const cleanup = setupObservers();

		// Set initial scroll position if specified
		if (initialScrollIndex > 0 && containerRef.current) {
			const targetElement = containerRef.current.querySelector(`[data-index="${initialScrollIndex}"]`);
			if (targetElement) {
				targetElement.scrollIntoView();
			}
		}

		return cleanup;
	}, [items, batchSize, setupObservers, initialScrollIndex]);

	// Handle new items
	useEffect(() => {
		if (items.length > displayedItems.length) {
			const direction = scrollPosition === 0 ? 'top' : 'bottom';
			const newBatchItems =
				direction === 'top' ? items.slice(0, batchSize) : items.slice(displayedItems.length, displayedItems.length + batchSize);

			appendBatch(newBatchItems, batchCount, direction);

			setDisplayedItems((prev) => (direction === 'top' ? [...newBatchItems, ...prev] : [...prev, ...newBatchItems]));
			setBatchCount((prev) => prev + 1);
		}
	}, [items, displayedItems, batchSize, batchCount, appendBatch, scrollPosition]);

	// Track scroll position
	const handleScroll = useCallback(() => {}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => container.removeEventListener('scroll', handleScroll);
		}
	}, [handleScroll]);

	// Cleanup
	useEffect(() => {
		return () => {
			batchesRef.current.forEach((batch) => {
				if (batch && batch.parentNode) {
					ReactDOM.unmountComponentAtNode(batch);
					batch.parentNode.removeChild(batch);
				}
			});
			batchesRef.current = [];
			if (fragmentRef.current) {
				fragmentRef.current = null;
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={`infinite-list-container ${className}`}
			style={{
				height: '100%',
				overflow: 'auto',
				position: 'relative',
				...style
			}}
		>
			{/* Top loading indicator */}
			{isLoading.top && <div className="infinite-list-loader top">{loadingComponent || 'Loading...'}</div>}

			{/* Content */}
			<div className="infinite-list-content">
				{displayedItems.map((item, index) => (
					<div key={index} data-index={index}>
						{renderItem(item, index)}
					</div>
				))}
			</div>
		</div>
	);
};

// Styles
const styles = `
.infinite-list-container {
  -webkit-overflow-scrolling: touch;
}

.infinite-list-batch {
  will-change: transform;
}

.infinite-list-loader {
  padding: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  position: sticky;
  left: 0;
  right: 0;
}

.infinite-list-loader.top {
  top: 0;
}

.infinite-list-loader.bottom {
  bottom: 0;
}

.infinite-list-sentinel {
  height: 1px;
  width: 100%;
  position: absolute;
  pointer-events: none;
}

.top-sentinel {
  top: ${200}px;
}

.bottom-sentinel {
  bottom: ${200}px;
}
`;

// Insert styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default InfiniteList;
