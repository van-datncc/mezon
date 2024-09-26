import { MezonContextValue } from '@mezon/transport';
import { GetThunkAPI } from '@reduxjs/toolkit';
import { Client, Session } from 'mezon-js';
import { GetThunkAPIWithMezon } from './typings';

export const getMezonCtx = (thunkAPI: GetThunkAPI<any>) => {
	if (!isMezonThunk(thunkAPI)) {
		throw new Error('Not Mezon Thunk');
	}
	return thunkAPI.extra.mezon;
};

export type MezonValueContext = MezonContextValue & {
	client: Client;
	session: Session;
};

export async function ensureSession(mezon: MezonContextValue): Promise<MezonValueContext> {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			if (mezon.clientRef.current && mezon.sessionRef.current) {
				clearInterval(interval);
				resolve(ensureClient(mezon));
			}
		}, 100);
	});
}

export async function ensureSocket(mezon: MezonContextValue): Promise<MezonValueContext> {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (mezon.socketRef.current && (mezon.socketRef.current as any).adapter && (mezon.socketRef.current as any).adapter.isOpen()) {
				clearInterval(interval);
				resolve(ensureClient(mezon));
			}
		}, 100);
	});
}

export async function ensureClientAsync(mezon: MezonContextValue): Promise<MezonValueContext> {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			if (mezon.clientRef.current) {
				clearInterval(interval);
				resolve(ensureClient(mezon));
			}
		}, 100);
	});
}

export function ensureClient(mezon: MezonContextValue): MezonValueContext {
	if (!mezon?.clientRef?.current) {
		throw new Error('Error');
	}

	return {
		...mezon,
		client: mezon.clientRef.current,
		session: mezon.sessionRef.current
	} as MezonValueContext;
}

export function isMezonThunk(thunkAPI: GetThunkAPI<any>): thunkAPI is GetThunkAPIWithMezon {
	if (thunkAPI === undefined || thunkAPI.extra === undefined) {
		return false;
	}
	if ('extra' in thunkAPI === false || typeof thunkAPI.extra !== 'object' || thunkAPI.extra === null) {
		return false;
	}
	if ('mezon' in thunkAPI.extra === false) {
		return false;
	}
	return typeof thunkAPI?.extra?.mezon !== 'undefined';
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function convertTimestampToTimeAgo(timestampSeconds: number) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestampSeconds;

    const years = Math.floor(diff / (60 * 60 * 24 * 365));
    const months = Math.floor((diff % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));
    const days = Math.floor((diff % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);

    switch (true) {
        case years > 0:
            return `${years}y`;
        case months > 0:
            return `${months}mo`;
        case days > 0:
            return `${days}d`;
        case hours > 0:
            return `${hours}h`;
        case minutes > 0:
            return `${minutes}m`;
        default:
            return `Just now`;
    }
}