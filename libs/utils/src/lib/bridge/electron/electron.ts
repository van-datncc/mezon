import { NAVIGATE_TO_URL, SENDER_ID, START_NOTIFICATION_SERVICE, TRIGGER_SHORTCUT } from './constants';
import { ElectronBridgeHandler, IElectronBridge, MezonElectronAPI, MezonNotificationOptions } from './types';

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
	private shortcutHandler?: () => void;

	private constructor() {
		// private constructor to prevent instantiation
	}

	public initListeners(shortcutHandler: () => void) {
		if (this.hasListeners) {
			return;
		}
		this.shortcutHandler = shortcutHandler;
		this.setupSenderId();
		this.setupShortCut();
		this.hasListeners = true;
	}

	public removeAllListeners() {
		this.bridge.removeListener(TRIGGER_SHORTCUT, this.triggerShortcut);
		this.hasListeners = false;
	}

	public setBadgeCount(badgeCount: number | null) {
		this.bridge.setBadgeCount(badgeCount);
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
		if (this.shortcutHandler) {
			this.shortcutHandler();
		}
	};

	private readonly listenerHandlers: Record<string, ElectronBridgeHandler> = {
		[TRIGGER_SHORTCUT]: this.triggerShortcut
	};
}

export const electronBridge = ElectronBridge.getInstance();
