import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { getScrollBarWidth } from '@livekit/components-core';
import { TrackLoop, useVisualStableUpdate } from '@livekit/components-react';
import * as React from 'react';

const MIN_HEIGHT = 130;
const MIN_WIDTH = 140;
const MIN_VISIBLE_TILES = 1;
const ASPECT_RATIO = 16 / 10;
const ASPECT_RATIO_INVERT = (1 - ASPECT_RATIO) * -1;

export interface CarouselLayoutProps extends React.HTMLAttributes<HTMLMediaElement> {
	tracks: TrackReferenceOrPlaceholder[];
	children: React.ReactNode;
	orientation?: 'vertical' | 'horizontal';
}

export function CarouselLayout({ tracks, orientation, ...props }: CarouselLayoutProps) {
	const asideEl = React.useRef<HTMLDivElement>(null);
	const [prevTiles, setPrevTiles] = React.useState(0);
	const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

	React.useEffect(() => {
		const updateDimensions = () => {
			if (asideEl.current) {
				setDimensions({
					width: asideEl.current.offsetWidth,
					height: asideEl.current.offsetHeight
				});
			}
		};

		window.addEventListener('resize', updateDimensions);
		updateDimensions(); // Set initial size

		return () => window.removeEventListener('resize', updateDimensions);
	}, []);

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

	React.useLayoutEffect(() => {
		if (asideEl.current) {
			asideEl.current.dataset.lkOrientation = carouselOrientation;
			asideEl.current.style.setProperty('--lk-max-visible-tiles', maxVisibleTiles.toString());
		}
	}, [maxVisibleTiles, carouselOrientation]);

	return (
		<aside key={carouselOrientation} className="lk-carousel !justify-center" ref={asideEl} {...props}>
			<TrackLoop tracks={sortedTiles}>{props.children}</TrackLoop>
		</aside>
	);
}
