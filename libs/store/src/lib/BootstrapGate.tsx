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

	useEffect(() => {
		let cancelled = false;

		const init = async () => {
			const client = await createClient();
			if (cancelled || !client) {
				if (!cancelled) setReady(true);
				return;
			}

			const persistedSession = readPersistedSession();
			const hasSessionId = !!persistedSession?.session_id?.trim();
			const hasToken = !!persistedSession?.token?.trim();

		
			const connectPromise: Promise<boolean> = hasSessionId
				? (() => {
						sessionRef.current = persistedSession as ApiSession;
						return connectSocket()
							.then(() => true)
							.catch((error) => {
								console.error('BootstrapGate: Connection failed', error);
								return false;
							});
					})()
				: Promise.resolve(true);

			const [, connectOk] = await Promise.all([waitForPersistorBootstrap(persistor), connectPromise]);
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

	return <>{ready ? children : (fallback ?? <ConnectingScreen />)}</>;
}

const ConnectingScreen = () => (
	<div className="fixed z-[10000] bg-black w-screen text-theme-primary h-screen flex items-center justify-center">
		<div className="flex min-h-[160px] flex-col items-center justify-center">
			<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
			<h3 className="text-lg font-semibold">Establishing a connection...</h3>
		</div>
	</div>
);
