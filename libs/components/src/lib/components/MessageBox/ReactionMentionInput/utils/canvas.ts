import { getStore, selectCanvasIdsByChannelId } from '@mezon/store';

export function getCanvasTitles(canvasLinks: Array<{ clanId: string; channelId: string; canvasId: string }>): Record<string, string> {
	const store = getStore();
	const canvasTitles: Record<string, string> = {};

	for (const { channelId, canvasId } of canvasLinks) {
		const canvases = selectCanvasIdsByChannelId(store.getState(), channelId);
		const foundCanvas = canvases.find((canvas) => canvas.id === canvasId);
		if (foundCanvas) {
			canvasTitles[canvasId] = foundCanvas.title || 'Untitled';
		}
	}

	return canvasTitles;
}
