export function createApiGWBasePath(host: string, port?: string, useSSL = false): string {
	const scheme = useSSL ? 'https://' : 'http://';
	return port ? `${scheme}${host}:${port}` : `${scheme}${host}`;
}

export function generateBasePath(): string {
	const host = process.env.NX_CHAT_APP_API_GW_HOST as string;
	const port = process.env.NX_CHAT_APP_API_GW_PORT as string;
	const useSSL = process.env.NX_CHAT_APP_API_SECURE === 'true';
	return createApiGWBasePath(host, port, useSSL);
}
