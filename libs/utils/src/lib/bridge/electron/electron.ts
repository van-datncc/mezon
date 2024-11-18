import { ACTIVE_WINDOW, NAVIGATE_TO_URL, SENDER_ID, START_NOTIFICATION_SERVICE, TRIGGER_SHORTCUT } from './constants';
import { ElectronBridgeHandler, IElectronBridge, MezonDownloadFile, MezonElectronAPI, MezonNotificationOptions } from './types';

export class ElectronBridge implements IElectronBridge {
	private readonly bridge: MezonElectronAPI = window.electron;

	private static instance: ElectronBridge | undefined = undefined;

	public static getInstance(): ElectronBridge {
		if (!ElectronBridge.instance) {
			ElectronBridge.instance = new ElectronBridge();
		}
		return ElectronBridge.instance;
	}

	private hasListeners = false;
	private handlers?: Record<string, ElectronBridgeHandler>;

	private constructor() {
		// private constructor to prevent instantiation
	}

	public initListeners(handlers: Record<string, ElectronBridgeHandler>) {
		if (this.hasListeners) {
			return;
		}
		this.handlers = handlers;
		this.setupSenderId();
		this.setupShortCut();
		this.setActiveWindow();
		this.hasListeners = true;
	}

	public removeAllListeners() {
		this.bridge.removeListener(TRIGGER_SHORTCUT, this.triggerShortcut);
		this.bridge.removeListener(ACTIVE_WINDOW, this.triggerActiveWindow);
		this.hasListeners = false;
	}

	public setBadgeCount(badgeCount: number | null) {
		this.bridge.setBadgeCount(badgeCount);
	}

	public invoke(channel: string, data?: MezonDownloadFile): Promise<MezonDownloadFile> {
		if (this.bridge.invoke) {
			return this.bridge.invoke(channel, data);
		}
		console.error(`invoke is not supported on this bridge`);
		return Promise.reject(new Error('invoke is not implemented in this bridge'));
	}

	public setActiveWindow() {
		this.bridge.on(ACTIVE_WINDOW, this.listenerHandlers[ACTIVE_WINDOW]);
	}

	public pushNotification(title: string, options: MezonNotificationOptions) {
		const notification = new Notification(title, options);
		notification.onclick = () => {
			const link = options.data?.link;
			if (!link) {
				return;
			}
			const notificationUrl = new URL(link);
			const currentPath = window.location.pathname;
			const path = notificationUrl.pathname;
			const isSubPath = currentPath.endsWith(path);

			if (path) {
				this.bridge?.send(NAVIGATE_TO_URL, path, isSubPath);
			}
		};
	}

	private setupSenderId() {
		this.bridge.senderId(SENDER_ID).then((senderId: string) => {
			this.bridge.send(START_NOTIFICATION_SERVICE, senderId);
		});
	}

	private setupShortCut() {
		this.bridge.on(TRIGGER_SHORTCUT, this.listenerHandlers[TRIGGER_SHORTCUT]);
	}

	private triggerShortcut = (_: unknown, name: string) => {
		if (this.handlers?.[TRIGGER_SHORTCUT]) {
			this.handlers?.[TRIGGER_SHORTCUT]();
		}
	};

	private triggerActiveWindow = (_: unknown, name: string) => {
		if (this.handlers?.[ACTIVE_WINDOW]) {
			this.handlers?.[ACTIVE_WINDOW](name);
		}
	};

	private readonly listenerHandlers: Record<string, ElectronBridgeHandler> = {
		[TRIGGER_SHORTCUT]: this.triggerShortcut,
		[ACTIVE_WINDOW]: this.triggerActiveWindow
	};
}

export const electronBridge = ElectronBridge.getInstance();
