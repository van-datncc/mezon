
export function uploadImageToMinIO(url: string,
		stream: Buffer,
		size: number) {
	return fetch(url, {method: 'PUT', body: stream});
}
