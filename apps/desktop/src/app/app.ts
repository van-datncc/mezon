import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, Tray, autoUpdater, screen, shell } from 'electron';
import { join } from 'path';
import { format } from 'url';
import { environment } from '../environments/environment';
import { rendererAppName, rendererAppPort } from './constants';

import { setup } from 'electron-push-receiver';

let deeplinkingUrl;
let isQuitting = false;

export default class App {
	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	static mainWindow: Electron.BrowserWindow;
	static application: Electron.App;
	static BrowserWindow;

	public static isDevelopmentMode() {
		const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
		const getFromEnvironment: boolean = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

		return isEnvironmentSet ? getFromEnvironment : !environment.production;
	}

	private static onWindowAllClosed() {
		if (process.platform !== 'darwin') {
			App.application.quit();
		}
	}

	private static onClose(event) {
		if (!isQuitting) {
			event.preventDefault();
			App.mainWindow.hide();
		}
		return false;
	}

	private static onReady() {
		if (rendererAppName) {
			App.initMainWindow();
			App.loadMainWindow();
			App.handleTray();
		}

		setup(App.mainWindow.webContents);
	}

	private static onActivate() {
		if (App.mainWindow === null) {
			App.onReady();
		}
	}

	private static initMainWindow() {
		const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
		const width = Math.min(1280, workAreaSize.width || 1280);
		const height = Math.min(720, workAreaSize.height || 720);

		// Create the browser window.
		App.mainWindow = new BrowserWindow({
			width: width,
			height: height,
			show: false,
			webPreferences: {
				contextIsolation: true,
				backgroundThrottling: false,
				preload: join(__dirname, 'main.preload.js'),
			},
			icon: join(__dirname, 'assets', 'favicon.ico'),
		});
		App.mainWindow.setMinimumSize(950, 500);
		App.mainWindow.setMenu(null);
		App.mainWindow.center();

		const gotTheLock = App.application.requestSingleInstanceLock();
		if (gotTheLock) {
			App.application.on('second-instance', (e, argv) => {
				if (process.platform == 'win32') {
					deeplinkingUrl = argv.slice(1);

					const url = argv.pop().slice(1);

					if (url) {
						const index = url.indexOf('=');
						const dataString = url.substring(index + 1);

						if (dataString) {
							App.mainWindow.webContents.send('send-data-to-renderer', dataString);
							App.loadMainWindow();
						}
					}
				}

				if (App.mainWindow) {
					if (App.mainWindow.isMinimized()) App.mainWindow.restore();
					App.mainWindow.focus();
				}
			});
		} else {
			App.application.quit();
			return;
		}

		if (!App.application.isDefaultProtocolClient('mezonapp')) {
			App.application.setAsDefaultProtocolClient('mezonapp');
		}

		App.application.on('will-finish-launching', function () {
			// Protocol handler for osx
			App.application.on('open-url', function (event, url) {
				event.preventDefault();
				deeplinkingUrl = url;
			});
		});

		// if main window is ready to show, close the splash window and show the main window
		App.mainWindow.once('ready-to-show', () => {
			App.mainWindow.show();
		});

		// handle all external redirects in a new browser window
		App.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
			shell.openExternal(url);
			return { action: 'deny' };
		});

		// Emitted when the window is closed.
		App.mainWindow.on('close', (event) => this.onClose(event));
	}

	private static loadMainWindow() {
		// load the index.html of the app.
		if (!App.application.isPackaged) {
			App.mainWindow.loadURL(`http://localhost:${rendererAppPort}`);
		} else {
			App.mainWindow.loadURL(
				format({
					pathname: join(__dirname, '..', rendererAppName, 'index.html'),
					protocol: 'file:',
					slashes: true,
				}),
			);
		}

		if (process.platform == 'win32') {
			// Keep only command line / deep linked arguments
			deeplinkingUrl = process.argv.slice(1);
			App.application.setAppUserModelId('Mezon');
		}
	}
	private static handleTray() {
		let mezonTray = null;
		App.application.whenReady().then(() => {
			mezonTray = new Tray('apps/chat/src/assets/icon-desktop.ico');

			const template: (MenuItem | MenuItemConstructorOptions)[] = [
				{
					label: 'Check for updates',
					type: 'normal',
					click: () => autoUpdater.checkForUpdates(),
				},
				{
					label: 'Show Mezon',
					type: 'normal',
					click: function () {
						if (App.mainWindow) {
							App.mainWindow.show();
						}
					},
				},
				{
					label: 'Quit Mezon',
					type: 'normal',
					click: function () {
						isQuitting = true;
						App.application.quit();
					},
				},
			];
			const contextMenu = Menu.buildFromTemplate(template);

			mezonTray.setContextMenu(contextMenu);
			mezonTray.setToolTip('Mezon');
			mezonTray.on('click', () => {
				if (App.mainWindow) {
					App.mainWindow.show();
				}
			});
		});
	}

	static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
		App.BrowserWindow = browserWindow;
		App.application = app;

		App.application.on('window-all-closed', App.onWindowAllClosed);
		App.application.on('ready', App.onReady);
		App.application.on('activate', App.onActivate);
	}
}
