import * as Sentry from '@sentry/react';

const SKIP_LOG = 'skip_log';

export function logger(): string {
	return 'logger';
}

export async function captureSentryError(error: unknown, actionName: string): Promise<void> {
	// disabled
	return;
	const errorDetail = await getErrorMessage(error);
	if (errorDetail === SKIP_LOG) return;
	const errorLabel = (actionName || 'unknown') + ' - ' + new Date().toLocaleTimeString('en-GB', { hour12: false });

	const logTitle = new Error(errorLabel);
	logTitle.name = errorLabel;
	Sentry.captureException(logTitle, { extra: { errorDetail } });
}

async function getErrorMessage(error: unknown): Promise<string> {
	if (error instanceof Error) {
		return JSON.stringify(error, Object.getOwnPropertyNames(error));
	} else if (error instanceof Response) {
		return await handleResponseError(error);
	} else if (typeof error === 'object' && error !== null) {
		return safeJSONStringify(error);
	} else if (typeof error === 'string') {
		return error;
	} else {
		return 'An unknown error occurred:' + error;
	}
}

async function handleResponseError(response: Response): Promise<string> {
	try {
		if (response?.status === 403 || response?.status === 429) return SKIP_LOG;
		const clonedResponse = response.clone();
		const errorData = await clonedResponse.json();
		return safeJSONStringify(errorData);
	} catch {
		return `HTTP error! status: ${response.status} - ${response.statusText}`;
	}
}

function safeJSONStringify(obj: unknown): string {
	try {
		return deepJSONStringify(obj);
	} catch {
		return 'An unknown error occurred';
	}
}

function deepJSONStringify(obj: unknown): string {
	const seen = new WeakSet();
	return JSON.stringify(
		obj,
		function (key, value) {
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) {
					return '[Circular]';
				}
				seen.add(value);
			}
			return value;
		},
		2
	);
}
