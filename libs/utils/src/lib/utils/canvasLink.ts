export function extractCanvasIdsFromText(text: string): Array<{ clanId: string; channelId: string; canvasId: string }> {
	const canvasLinks: Array<{ clanId: string; channelId: string; canvasId: string }> = [];
	const regex = /(?:https?:\/\/[^\s]*)?\/chat\/clans\/([^/]+)\/channels\/([^/]+)\/canvas\/([^/\s?#]+)/g;

	let match;
	while ((match = regex.exec(text)) !== null) {
		const [, clanId, channelId, canvasId] = match;
		canvasLinks.push({ clanId, channelId, canvasId });
	}

	return canvasLinks;
}

export function extractIdsFromUrl(url: string) {
	const regex = /\/chat\/clans\/([^/]+)\/channels\/([^/]+)(?:\/canvas\/([^/]+))?/;
	const match = url?.match(regex);
	if (!match) return null;

	const [, clanId, channelId, canvasId] = match;
	return { clanId, channelId, canvasId };
}
