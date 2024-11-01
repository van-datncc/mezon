import { openDB } from 'idb';

const DB_NAME = 'logDB';
const STORE_NAME = 'logs';

interface LogEntry {
	message: string;
	level?: 'info' | 'warning' | 'error';
	[key: string]: unknown;
}

export async function initDB() {
	return openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
			}
		}
	});
}

export async function addLog(log: LogEntry) {
	const db = await initDB();
	const tx = db.transaction(STORE_NAME, 'readwrite');
	await tx.store.add(log);
	await tx.done;
}

export async function clearLogsIfNewDay() {
	const db = await initDB();
	const tx = db.transaction(STORE_NAME, 'readwrite');
	const logs = await tx.store.getAll();

	if (logs.length > 0) {
		const lastLog = logs[logs.length - 1];
		const lastLogDate = new Date(lastLog.timestamp).toDateString();
		const currentDate = new Date().toDateString();
		if (lastLogDate !== currentDate) {
			for (const log of logs) {
				await tx.store.delete(log.id);
			}
		}
	}

	await tx.done;
}

export enum LogType {
	PushNotification = 'push_notification',
	DisconnectSocket = 'disconnect_socket',
	ReconnectSocket = 'reconnect_socket'
}

clearLogsIfNewDay();
