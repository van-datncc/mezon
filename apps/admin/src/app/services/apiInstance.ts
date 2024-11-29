const baseURL = process.env.NX_MEZON_FLOW_URL ?? '';

async function apiInstance(url: string, options: RequestInit = {}) {
	const response = await fetch(`${baseURL}${url}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		credentials: 'include'
	});

	if (!response.ok) {
		const error = await response.json();
		return Promise.reject(error);
	}

	return response.json();
}

export { apiInstance };
