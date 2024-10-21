import { electronBridge } from './electron';

export interface IMessageExtras {
	link: string; // link for navigating
}

export interface NotificationData {
	id: number;
	appid: number;
	message: string;
	title: string;
	priority: number;
	date: string;
	image: string;
	extras?: IMessageExtras;
}

export class MezonNotificationService {
	private wsActive = false;
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectInterval = 1000; // Start with 1 second
	public static instance: MezonNotificationService;

	private constructor() {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	}

	public static getInstance() {
		if (!MezonNotificationService.instance) {
			MezonNotificationService.instance = new MezonNotificationService();
		}
		return MezonNotificationService.instance;
	}

	public connect = (token: string) => {
		if (!token || this.wsActive) {
			return;
		}

		this.wsActive = true;

		const wsUrl = process.env.NX_CHAT_APP_NOTIFICATION_WS_URL;
		const ws = new WebSocket(`${wsUrl}/stream?token=${token}`);

		ws.onmessage = (data: MessageEvent<string>) => {
			if (data.data === 'ping') {
				this.handlePong();
			} else {
				const msg = JSON.parse(data.data) as NotificationData;
				const { title, message, image } = msg ?? {};
				const { link } = msg?.extras ?? {};
				electronBridge.pushNotification(title, {
					body: message,
					icon: image ?? '',
					data: {
						link: link ?? ''
					}
				});
			}
		};

		ws.onerror = (e) => {
			this.wsActive = false;
			this.reconnect(token);
		};

		ws.onclose = () => {
			this.wsActive = false;
		};

		this.ws = ws;
	};

	public get isActive() {
		return this.wsActive;
	}

	public close = () => {
		this.ws?.close(1000, 'WebSocketStore#close');
	};

	private reconnect = (token: string) => {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			setTimeout(() => {
				this.reconnectAttempts++;
				this.connect(token);
			}, this.reconnectInterval);

			// Exponentially increase the interval for the next reconnection attempt
			this.reconnectInterval = this.reconnectInterval * 2;
		}
	};

	private handlePong = () => {
		this.ws?.send('pong');
	};
}

export const notificationService = MezonNotificationService.getInstance();
