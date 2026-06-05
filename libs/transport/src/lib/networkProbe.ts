const FALLBACK_PROBE_ORIGIN = 'https://mezon.ai';


function resolveDefaultProbeUrl(): string {
	const origin = (process.env.NX_CHAT_APP_REDIRECT_URI ?? FALLBACK_PROBE_ORIGIN).replace(/\/$/, '');
	return `${origin}/assets/favicon.ico`;
}

export const RECONNECT_NETWORK_PROBE_TIMEOUT_MS = 4000;

export type ProbeNetworkOptions = {
	url?: string;
	timeoutMs?: number;
};


export function probeNetworkReachability(options: ProbeNetworkOptions = {}): Promise<boolean> {
	if (typeof window === 'undefined') {
		return Promise.resolve(true);
	}

	const baseUrl = options.url ?? resolveDefaultProbeUrl();
	const timeoutMs = options.timeoutMs ?? RECONNECT_NETWORK_PROBE_TIMEOUT_MS;
	const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;

	const controller = new AbortController();
	const timerId = setTimeout(() => controller.abort(), timeoutMs);

	return fetch(url, {
		method: 'HEAD',
		mode: 'no-cors',
		cache: 'no-store',
		signal: controller.signal
	})
		.then(() => true)
		.catch(() => false)
		.finally(() => {
			clearTimeout(timerId);
		});
}
