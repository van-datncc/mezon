export function createApiGWBasePath(host: string, port?: string, useSSL = false): string {
	const scheme = useSSL ? 'https://' : 'http://';
	return port ? `${scheme}${host}:${port}` : `${scheme}${host}`;
}
