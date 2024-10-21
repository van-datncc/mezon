import {
	FCM_TOKEN_UPDATED,
	NAVIGATE_TO_URL,
	NOTIFICATION_RECEIVED,
	NOTIFICATION_SERVICE_ERROR,
	NOTIFICATION_SERVICE_STARTED,
	SENDER_ID,
	START_NOTIFICATION_SERVICE,
	TRIGGER_SHORTCUT
} from './constants';
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

	/**
	 * @deprecated use ws instead
	 */
	private setupPushReceiver() {
		this.bridge.on(NOTIFICATION_SERVICE_STARTED, this.listenerHandlers[NOTIFICATION_SERVICE_STARTED]);
		this.bridge.on(NOTIFICATION_RECEIVED, this.listenerHandlers[NOTIFICATION_RECEIVED]);
		this.bridge.on(NOTIFICATION_SERVICE_ERROR, this.listenerHandlers[NOTIFICATION_SERVICE_ERROR]);
		this.bridge.on(FCM_TOKEN_UPDATED, this.listenerHandlers[FCM_TOKEN_UPDATED]);
	}

	private setupShortCut() {
		this.bridge.on(TRIGGER_SHORTCUT, this.listenerHandlers[TRIGGER_SHORTCUT]);
	}

	private notificationServiceStartedHandler = (_: unknown, token: string) => {
		localStorage.setItem('fcmToken', token);
		this.bridge.getDeviceId().then((deviceId) => {
			const fcmTokenObject = { token, deviceId };
			localStorage.setItem('fcmTokenObject', JSON.stringify(fcmTokenObject));
		});
	};

	private notificationErrorhandler = (error: string) => {
		console.error('notification error', error);
	};

	private notificationReceivedHandler = (
		_: unknown,
		serverNotificationPayload: { notification: { body: string; title: string; image: string }; data: { link: string } }
	) => {
		if (serverNotificationPayload.notification.body) {
			const { body, image, title } = serverNotificationPayload.notification;
			const link = serverNotificationPayload.data?.link;
			this.pushNotification(title, { body, icon: image, data: { link } });
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private tokenUpdatedHandler = (_: unknown, token: string) => {};

	private triggerShortcut = (_: unknown, name: string) => {
		if (this.shortcutHandler) {
			this.shortcutHandler();
		}
	};

	private readonly listenerHandlers: Record<string, ElectronBridgeHandler> = {
		[NOTIFICATION_SERVICE_STARTED]: this.notificationServiceStartedHandler,
		[NOTIFICATION_RECEIVED]: this.notificationReceivedHandler,
		[NOTIFICATION_SERVICE_ERROR]: this.notificationErrorhandler,
		[FCM_TOKEN_UPDATED]: this.tokenUpdatedHandler,
		[TRIGGER_SHORTCUT]: this.triggerShortcut
	};
}

export const electronBridge = ElectronBridge.getInstance();
