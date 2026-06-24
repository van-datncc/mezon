import type { ApiSession } from 'mezon-js';

export type SessionUpdateSource = 'refresh' | 'cross-tab' | 'logout' | 'login';

export type SessionUpdate = {
	session: ApiSession | null;
	source: SessionUpdateSource;
	sequence: number;
};

type Listener = (update: SessionUpdate) => void;

const listeners = new Set<Listener>();
let lastSequence = 0;
let lastSnapshot: SessionUpdate | null = null;

export function subscribeSessionUpdate(listener: Listener): () => void {
	listeners.add(listener);
	if (lastSnapshot) {
		try {
			listener(lastSnapshot);
		} catch (err) {
			console.error('[sessionBridge] initial listener invocation failed', err);
		}
	}
	return () => {
		listeners.delete(listener);
	};
}

export function publishSessionUpdate(session: ApiSession | null, source: SessionUpdateSource): SessionUpdate {
	lastSequence += 1;
	const update: SessionUpdate = { session, source, sequence: lastSequence };
	lastSnapshot = update;
	listeners.forEach((listener) => {
		try {
			listener(update);
		} catch (err) {
			console.error('[sessionBridge] listener failed', err);
		}
	});
	return update;
}

export function getLastSessionSnapshot(): SessionUpdate | null {
	return lastSnapshot;
}

export function getSessionUpdateSequence(): number {
	return lastSequence;
}
