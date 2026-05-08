import { connectMezonSocketOnce, extractAndSaveConfig, resolveSessionWsUrl, useMezon } from '@mezon/transport';
import type { MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import type { Store } from 'redux';
import type { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { authActions } from './auth/auth.slice';
import { useAppDispatch, type AppDispatch, type RootState, type RootState as RootStateMobile } from './store';

type Props = {
	readonly children: React.ReactNode;
	readonly store: Store<RootState | RootStateMobile>;
	readonly loading: React.ReactNode;
	readonly persistor: Persistor;
};

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

export function MezonStoreProvider({ children, store, loading, persistor }: Props) {
	const { sessionRef, createClient } = useMezon();
	const [connect, setConnect] = useState(false);
	const connectRef = useRef(false);

	useEffect(() => {
		let cancelled = false;

		const initConnection = async () => {
			await waitForPersistorBootstrap(persistor);

			if (cancelled) {
				return;
			}

			const client = await createClient();
			client.setAutoReconnect({ enabled: false });
			if (cancelled) {
				return;
			}

			const { auth } = store.getState();
			const session = auth.session;
			const persistClaimsLogin = Boolean(auth.isLogin);

			const finishWithoutSocket = () => {
				setConnect(true);
			};

			const logoutBrokenPersist = () => {
				store.dispatch(authActions.resetSession());
				void (store.dispatch as AppDispatch)(authActions.logOut({}));
			};

			try {
				if (!client) {
					finishWithoutSocket();
					return;
				}

				if (!session) {
					if (persistClaimsLogin) {
						logoutBrokenPersist();
					}
					finishWithoutSocket();
					return;
				}

				const hasToken = !!session.token?.trim();
				const hasSessionId = !!session.session_id?.trim();
				if (hasToken && !hasSessionId) {
					if (persistClaimsLogin) {
						logoutBrokenPersist();
					}
					finishWithoutSocket();
					return;
				}

				if (!persistClaimsLogin) {
					finishWithoutSocket();
					return;
				}

				sessionRef.current = session;

				await connectMezonSocketOnce({
					client,
					sessionRef,
					resolveWsUrl: resolveSessionWsUrl,
					persistSession: (effectiveSession) => extractAndSaveConfig(effectiveSession),
					onSessionRefreshed: (sessionNew, effectiveSession) => {
						store.dispatch(authActions.setSessionId(sessionNew.session_id));
						sessionRef.current = {
							...effectiveSession,
							session_id: sessionNew.session_id
						};
					}
				});
				connectRef.current = true;
			} catch (error) {
				connectRef.current = true;
				console.error('AppInitializer: Connection failed', error);
			}
			setConnect(true);
		};

		initConnection();

		return () => {
			cancelled = true;
		};
	}, [persistor, store, createClient, sessionRef]);
	if (!connect) return null;
	return (
		<Provider store={store}>
			<PersistGate loading={loading} persistor={persistor}>
				<ConnectGate connectRef={connectRef}>{children}</ConnectGate>
			</PersistGate>
		</Provider>
	);
}
const CONNECT_GATE_POLL_MS = 1000;
const CONNECT_GATE_MAX_WAIT_MS = 4000;
const CONNECT_GATE_MAX_ATTEMPTS = Math.ceil(CONNECT_GATE_MAX_WAIT_MS / CONNECT_GATE_POLL_MS);

interface ConnectGateProps {
	children: React.ReactNode;
	connectRef: MutableRefObject<boolean>;
}

const ConnectGate = ({ children, connectRef }: ConnectGateProps) => {
	const { t } = useTranslation('common');
	const { clientRef } = useMezon();
	const [loading, setLoading] = useState(!!clientRef.current?.isOpen?.());
	const [countdown, setCountdown] = useState<number>(0);
	const [retryCount, setRetryCount] = useState<number>(0); // State mới để lưu số lần retry
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!clientRef.current || !connectRef.current) {
			setLoading(true);
			return;
		}

		let cancelled = false;
		let currentAttempts = 0;
		let currentDelay = CONNECT_GATE_POLL_MS;

		let pollTimeoutId: number | null = null;
		let countdownIntervalId: number | null = null;

		const cleanup = () => {
			if (pollTimeoutId !== null) window.clearTimeout(pollTimeoutId);
			if (countdownIntervalId !== null) window.clearInterval(countdownIntervalId);
		};

		const startCountdown = (ms: number) => {
			if (countdownIntervalId) window.clearInterval(countdownIntervalId);
			let secondsLeft = Math.ceil(ms / 1000);
			setCountdown(secondsLeft);

			countdownIntervalId = window.setInterval(() => {
				secondsLeft -= 1;
				setCountdown(Math.max(0, secondsLeft));
				if (secondsLeft <= 0) window.clearInterval(countdownIntervalId!);
			}, 1000);
		};

		const poll = () => {
			if (cancelled) {
				setLoading(true);
				cleanup();
				return;
			}

			if (clientRef.current?.isOpen?.()) {
				setLoading(true);
				cleanup();
				return;
			}

			currentAttempts += 1;
			setRetryCount(currentAttempts);
			if (currentAttempts >= CONNECT_GATE_MAX_ATTEMPTS) {
				cleanup();
				dispatch(authActions.logOut({}));
				setLoading(true);
				return;
			}

			currentDelay *= 2;
			startCountdown(currentDelay);
			pollTimeoutId = window.setTimeout(poll, currentDelay);
		};

		setRetryCount(0);
		startCountdown(currentDelay);
		pollTimeoutId = window.setTimeout(poll, currentDelay);

		return () => {
			cancelled = true;
			cleanup();
		};
	}, [dispatch, clientRef]);

	if (!loading) {
		return (
			<div className="fixed z-[10000] bg-black w-screen text-theme-primary h-screen flex items-center justify-center">
				<div className="flex min-h-[200px] flex-col items-center justify-center ">
					<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

					<h3 className="mb-2 text-lg font-semibold">Establishing a connection...</h3>

					<div className="mb-4 text-sm">
						Attempt number: <span className="font-bold">{retryCount}</span>
						<span className="mx-1">/</span>
						{CONNECT_GATE_MAX_ATTEMPTS}
					</div>

					<div className="mb-6">
						<p className="text-sm">
							Try again within:
							<span className="ml-2 inline-block min-w-[3ch] text-xl font-mono font-bold text-primary">{countdown}s</span>
						</p>
					</div>

					<div className="w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-2.5 bg-blue-600 transition-all duration-500 ease-out"
							style={{ width: `${(retryCount / CONNECT_GATE_MAX_ATTEMPTS) * 100}%` }}
						/>
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};
