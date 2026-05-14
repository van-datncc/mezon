import { useMezon } from '@mezon/transport';
import type { ApiSession } from 'mezon-js';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { Persistor } from 'redux-persist';
import { authActions } from './auth/auth.slice';
import { useAppDispatch, type AppDispatch } from './store';

const PERSIST_AUTH_KEY = 'persist:auth';
const MAX_RETRIES = 4;

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

			await Promise.all([
				(async () => {
					if (hasSessionId) {
						sessionRef.current = persistedSession as ApiSession;
						// Retry call connect socket if it fail with MAX_RETRIES time
						for (let i = 0; i <= MAX_RETRIES; i++) {
							if (cancelled) return;
							setRetryCount(i);

							try {
								await connectSocket();
								connectOk = true;
								break;
							} catch (error) {
								if (i === MAX_RETRIES) break;
								const baseDelay = INITIAL_DELAY * Math.pow(2, i);
								// Add jitter time for not all client call in same time
								const nextDelay = baseDelay + Math.random() * 500;
								console.error(`Connection failed. Retrying attempt ${i} in ${nextDelay}ms...`);
								await delay(nextDelay);
							}
						}
					} else {
						connectOk = true;
					}
				})(),

				waitForPersistorBootstrap(persistor)
			]);
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

const ConnectingScreen = ({ retryCount }: { retryCount: number }) => {
	const retryDelay = Math.round(2 ** retryCount);
	const [remainingTime, setRemainingTime] = useState(0);

	useEffect(() => {
		if (retryCount === 0) {
			setRemainingTime(0);
			return;
		}

		setRemainingTime(retryDelay);

		const interval = setInterval(() => {
			setRemainingTime((prev) => {
				if (prev === 0) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [retryCount]);

	return (
		<div className="fixed z-[10000] bg-black w-screen text-theme-primary h-screen flex items-center justify-center">
			<div className="flex min-h-[160px] flex-col items-center justify-center">
				<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

				<h3 className="text-lg font-semibold text-center">Establishing a connection...</h3>

				{retryCount > 0 && retryCount < MAX_RETRIES && (
					<p className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 backdrop-blur-md">
						<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
						<span>
							Connection lost — retrying attempt <span className="font-semibold text-white">{retryCount}</span> in{' '}
							<span className="font-mono text-blue-400">{remainingTime}s</span>
						</span>
					</p>
				)}
			</div>
		</div>
	);
};
