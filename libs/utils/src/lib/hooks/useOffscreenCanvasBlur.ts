import { useLayoutEffect, useMemo, useRef } from 'react';
import { requestMutation } from '../fasterdom';
import cycleRestrict from '../utils/cycleRestrict';
import { MAX_WORKERS, requestMediaWorker } from '../utils/launchMediaWorkers';
import useLastCallback from './useLastCallback';

const RADIUS_RATIO = 0.1; // Use 10% of the smallest dimension as the blur radius

let lastWorkerIndex = -1;

export default function useOffscreenCanvasBlur(
	thumbData?: string, // data URI or blob URL
	isDisabled = false
) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const workerIndex = useMemo(() => cycleRestrict(MAX_WORKERS, ++lastWorkerIndex), []);
	const offscreenRef = useRef<OffscreenCanvas>();

	const blurThumb = useLastCallback(async (canvas: HTMLCanvasElement, uri: string) => {
		requestMutation(() => {
			offscreenRef.current = canvas.transferControlToOffscreen();
			const radius = Math.ceil(Math.min(32, 14) * RADIUS_RATIO);
			requestMediaWorker(
				{
					name: 'offscreen-canvas:blurThumb',
					args: [offscreenRef.current, uri, radius],
					transferables: [offscreenRef.current]
				},
				workerIndex
			);
		});
	});

	useLayoutEffect(() => {
		if (!thumbData) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		blurThumb(canvas, thumbData);
	}, [blurThumb, isDisabled, thumbData]);

	return canvasRef;
}
