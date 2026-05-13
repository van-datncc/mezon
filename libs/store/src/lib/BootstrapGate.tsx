import { useMezon } from '@mezon/transport';
import type { ApiSession } from 'mezon-js';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { Persistor } from 'redux-persist';
import { authActions } from './auth/auth.slice';
import { useAppDispatch, type AppDispatch } from './store';

const PERSIST_AUTH_KEY = 'persist:auth';

function readPersistedSession(): ApiSession | null {
	try {
		const raw = localStorage.getItem(PERSIST_AUTH_KEY);
		if (!raw) return null;
		const outer = JSON.parse(raw);
		if (!outer?.session) return null;
		const parsed = JSON.parse(outer.session);
		return parsed && typeof parsed === 'object' ? (parsed as ApiSession) : null;
	} catch {
		return null;
	}
}

function waitForPersistorBootstrap(persistor: Persistor): Promise<void> {
	return new Promise((resolve) => {
		if (persistor.getState().bootstrapped) {
			resolve();
			return;
		}
		const unsub = persistor.subscribe(() => {
			if (persistor.getState().bootstrapped) {
				unsub();
				resolve();
			}
		});
	});
}

type Props = {
	children: ReactNode;
	persistor: Persistor;
	fallback?: ReactNode;
};
export function BootstrapGate({ children, persistor, fallback }: Props) {
	const { sessionRef, createClient, connectSocket } = useMezon();
	const dispatch = useAppDispatch();
	const [ready, setReady] = useState(false);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		let cancelled = false;
		const MAX_RETRIES = 4;
		const INITIAL_DELAY = 1000;

		const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

		const init = async () => {
			const client = await createClient();
			if (cancelled || !client) {
				if (!cancelled) setReady(true);
				return;
			}

			const persistedSession = readPersistedSession();
			const hasSessionId = !!persistedSession?.session_id?.trim();
			const hasToken = !!persistedSession?.token?.trim();

			let connectOk = false;

			if (hasSessionId) {
				sessionRef.current = persistedSession as ApiSession;

				for (let i = 0; i <= MAX_RETRIES; i++) {
					if (cancelled) return;
					setRetryCount(i);

					try {
						await connectSocket();
						connectOk = true;
						break;
					} catch (error) {
						if (i === MAX_RETRIES) break;

						const nextDelay = INITIAL_DELAY * Math.pow(2, i);
						await delay(nextDelay);
					}
				}
			} else {
				connectOk = true;
			}

			await waitForPersistorBootstrap(persistor);
			if (cancelled) return;

			if (!connectOk || (hasToken && !hasSessionId)) {
				void (dispatch as AppDispatch)(authActions.logOut({}));
			}

			setReady(true);
		};

		init();
		return () => {
			cancelled = true;
		};
	}, [persistor, createClient, sessionRef, connectSocket, dispatch]);

	return <>{ready ? children : (fallback ?? <ConnectingScreen retryCount={retryCount} />)}</>;
}
const ConnectingScreen = ({ retryCount }: { retryCount: number }) => (
	<div className="fixed z-[10000] bg-black w-screen text-theme-primary h-screen flex items-center justify-center">
		<div className="flex min-h-[160px] flex-col items-center justify-center">
			<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
			<h3 className="text-lg font-semibold">Establishing a connection... {retryCount > 0 ? `Try attempt : ${retryCount}` : null}</h3>
		</div>
	</div>
);
