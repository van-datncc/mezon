import type { ApiSession, Client } from 'mezon-js';
import type { MutableRefObject } from 'react';

import { socketState } from './socketState';

let connectInFlight: Promise<ApiSession | null> | null = null;
let reconnectInFlight = false;

export function resetMezonSocketReconnectInFlight(): void {
	reconnectInFlight = false;
}

export function resetMezonConnectInFlight(): void {
	connectInFlight = null;
}

export type ReconnectMezonSocketStatus = 'SUCCESS' | 'RECONNECTING' | 'MISSING_SESSION';

export type ReconnectMezonSocketResult = {
	status: ReconnectMezonSocketStatus;
	attempts: number;
};

export type ConnectMezonSocketOptions = {
	client: Client;
	sessionRef: MutableRefObject<ApiSession | null>;
	resolveWsUrl: (session: Pick<ApiSession, 'ws_url'>) => string;
	persistSession?: (effectiveSession: ApiSession) => void;
	onSessionRefreshed?: (sessionNew: ApiSession, effectiveSession: ApiSession) => void;
	createStatus?: boolean;
	verbose?: boolean;
};

export function connectMezonSocketOnce(opts: ConnectMezonSocketOptions): Promise<ApiSession | null> {
	const { client, sessionRef } = opts;

	if (!sessionRef.current) {
		return Promise.resolve(null);
	}

	if (connectInFlight) {
		return connectInFlight;
	}

	connectInFlight = (async () => {
		const sr = sessionRef.current as ApiSession;
		const wsUrl = opts.resolveWsUrl(sr);
		const effectiveSession: ApiSession = { ...sr, ws_url: wsUrl };
		sessionRef.current = effectiveSession;
		opts.persistSession?.(effectiveSession);


		await client.connect(effectiveSession.session_id || effectiveSession.token || '', wsUrl, opts.createStatus ?? true, opts.verbose ?? false);

		socketState.status = 'connected';

		client.onrefreshsession = (sessionNew: ApiSession) => {
			if (opts.onSessionRefreshed) {
				opts.onSessionRefreshed(sessionNew, effectiveSession);
				return;
			}
			sessionRef.current = {
				...effectiveSession,
				session_id: sessionNew.session_id
			};
			const authData = JSON.stringify(sessionRef.current as ApiSession);
			localStorage.setItem('persist:auth', authData);
		};
		return effectiveSession;
	})()
		.catch((error) => {
			console.log('[ReconnectFlow] connectMezonSocketOnce failed', {
				error: error instanceof Error ? error.message : String(error)
			});
			throw error;
		})
		.finally(() => {
			connectInFlight = null;
		});

	return connectInFlight;
}

export async function reconnectMezonSocketWithRetry(options: {
	client: Client;
	sessionRef: MutableRefObject<ApiSession | null>;
	resolveWsUrl: (session: Pick<ApiSession, 'ws_url'>) => string;
	persistSession?: (effectiveSession: ApiSession) => void;
	onSessionRefreshed?: (sessionNew: ApiSession, effectiveSession: ApiSession) => void;
}): Promise<ReconnectMezonSocketResult> {
	if (reconnectInFlight) {
		return { status: 'RECONNECTING', attempts: 0 };
	}

	const { client, sessionRef, resolveWsUrl, persistSession, onSessionRefreshed } = options;

	if (!sessionRef.current) {
		return { status: 'MISSING_SESSION', attempts: 0 };
	}

	reconnectInFlight = true;

	try {
		const result = await connectMezonSocketOnce({
			client,
			sessionRef,
			resolveWsUrl,
			persistSession,
			onSessionRefreshed
		});

		if (result === null) {
			return { status: 'MISSING_SESSION', attempts: 1 };
		}

		return { status: 'SUCCESS', attempts: 1 };
	} catch {
		throw new Error('Socket reconnection failed');
	} finally {
		reconnectInFlight = false;
	}
}
