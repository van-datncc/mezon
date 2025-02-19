import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { getScrollBarWidth } from '@livekit/components-core';
import { TrackLoop, useVisualStableUpdate } from '@livekit/components-react';
import { useWindowSize } from '@mezon/core';
import { HTMLAttributes, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

const MIN_HEIGHT = 130;
const MIN_WIDTH = 140;
const MIN_VISIBLE_TILES = 1;
const ASPECT_RATIO = 16 / 10;
const ASPECT_RATIO_INVERT = (1 - ASPECT_RATIO) * -1;

export interface CarouselLayoutProps extends HTMLAttributes<HTMLMediaElement> {
	tracks: TrackReferenceOrPlaceholder[];
	children: ReactNode;
	orientation?: 'vertical' | 'horizontal';
}

export function CarouselLayout({ tracks, orientation, ...props }: CarouselLayoutProps) {
	const asideEl = useRef<HTMLDivElement>(null);
	const [prevTiles, setPrevTiles] = useState(0);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	const updateDimensions = () => {
		if (asideEl.current) {
			setDimensions({
				width: asideEl.current.offsetWidth,
				height: asideEl.current.offsetHeight
			});
		}
	};

	useEffect(() => {
		updateDimensions(); // Set initial size
	}, []);

	useWindowSize(() => {
		updateDimensions();
	});

	const { width, height } = dimensions;
	const carouselOrientation = orientation ? orientation : height >= width ? 'vertical' : 'horizontal';

	const tileSpan =
		carouselOrientation === 'vertical' ? Math.max(width * ASPECT_RATIO_INVERT, MIN_HEIGHT) : Math.max(height * ASPECT_RATIO, MIN_WIDTH);
	const scrollBarWidth = getScrollBarWidth();

	const tilesThatFit =
		carouselOrientation === 'vertical'
			? Math.max((height - scrollBarWidth) / tileSpan, MIN_VISIBLE_TILES)
			: Math.max((width - scrollBarWidth) / tileSpan, MIN_VISIBLE_TILES);

	let maxVisibleTiles = Math.round(tilesThatFit);
	if (Math.abs(tilesThatFit - prevTiles) < 0.5) {
		maxVisibleTiles = Math.round(prevTiles);
	} else if (prevTiles !== tilesThatFit) {
		setPrevTiles(tilesThatFit);
	}

	const sortedTiles = useVisualStableUpdate(tracks, maxVisibleTiles);

	useLayoutEffect(() => {
		if (asideEl.current) {
			asideEl.current.dataset.lkOrientation = carouselOrientation;
			asideEl.current.style.setProperty('--lk-max-visible-tiles', maxVisibleTiles.toString());
		}
	}, [maxVisibleTiles, carouselOrientation]);

	return (
		<aside
			key={carouselOrientation}
			className={`lk-carousel ${sortedTiles.length <= maxVisibleTiles ? '!justify-center' : '!justify-start'} !overflow-x-auto`}
			ref={asideEl}
			{...props}
		>
			<TrackLoop tracks={sortedTiles}>{props.children}</TrackLoop>
		</aside>
	);
}
