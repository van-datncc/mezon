import { app, BrowserWindow, ipcMain } from 'electron';
import { machineId } from 'node-machine-id';
import { join } from 'path';
import { format } from 'url';
import App from './app/app';
import { rendererAppName } from './app/constants';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import { environment } from './environments/environment';

export default class Main {
	static initialize() {
		if (SquirrelEvents.handleEvents()) {
			// squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
			app.quit();
		}
	}

	static bootstrapApp() {
		App.main(app, BrowserWindow);
	}

	static bootstrapAppEvents() {
		ElectronEvents.bootstrapElectronEvents();

		// initialize auto updater service
		if (!App.isDevelopmentMode()) {
			// UpdateEvents.initAutoUpdateService();
		}
	}
}

ipcMain.handle('sender-id', () => {
	return environment.senderId;
});

ipcMain.handle('get-device-id', async () => {
	return await machineId();
});

ipcMain.on('navigate-to-url', async (event, path, isSubPath) => {
	if (App.mainWindow) {
		const baseUrl = join(__dirname, '..', rendererAppName, 'index.html');

		if (path && !isSubPath) {
			App.mainWindow.loadURL(
				format({
					pathname: baseUrl,
					protocol: 'file:',
					slashes: true,
					query: { notificationPath: path },
				}),
			);
		}

		if (!App.mainWindow.isVisible()) {
			App.mainWindow.show();
		}
		App.mainWindow.focus();
	}
});

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
