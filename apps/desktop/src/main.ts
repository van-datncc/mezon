import { BrowserWindow, Notification, app, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log/main';
import { UpdateInfo, autoUpdater } from 'electron-updater';
import fs from 'fs';
import App from './app/app';
import { DOWNLOAD_FILE, NAVIGATE_TO_URL, SENDER_ID } from './app/events/constants';
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
		log.initialize();
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

ipcMain.handle(DOWNLOAD_FILE, async (event, { url, defaultFileName }) => {
	const { filePath, canceled } = await dialog.showSaveDialog({
		title: 'Save File',
		defaultPath: defaultFileName,
		buttonLabel: 'Save',
		filters: [
			{ name: 'Text Files', extensions: ['txt'] },
			{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] },
			{ name: 'All Files', extensions: ['*'] }
		]
	});

	if (canceled || !filePath) {
		return null;
	}

	try {
		const response = await fetch(url);
		const buffer = await response.arrayBuffer();
		fs.writeFileSync(filePath, Buffer.from(buffer));

		shell.showItemInFolder(filePath);
		return filePath;
	} catch (error) {
		console.error('Error downloading file:', error);
		throw new Error('Failed to download file');
	}
});

ipcMain.handle(SENDER_ID, () => {
	return environment.senderId;
});

ipcMain.on(NAVIGATE_TO_URL, async (event, path, isSubPath) => {
	if (App.mainWindow) {
		App.mainWindow.webContents.send('navigate-to-path', path);

		if (!App.mainWindow.isVisible()) {
			App.mainWindow.show();
		}
		App.mainWindow.focus();
	}
});

ipcMain.on('TITLE_BAR_ACTION', (event, action, data) => {
	switch (action) {
		case 'MINIMIZE_WINDOW':
			if (App.mainWindow) {
				App.mainWindow.minimize();
			}
			break;
		case 'UNMAXIMIZE_WINDOW':
			if (App.mainWindow) {
				if (App.mainWindow.isMaximized()) {
					App.mainWindow.unmaximize();
				} else {
					App.mainWindow.maximize();
				}
			}
			break;
		case 'MAXIMIZE_WINDOW':
			if (App.mainWindow) {
				if (App.mainWindow.isMaximized()) {
					App.mainWindow.restore();
				} else {
					App.mainWindow.maximize();
				}
			}
			break;
		case 'CLOSE_APP':
			if (App.mainWindow) {
				App.mainWindow.close();
			}
			break;
	}
});
autoUpdater.autoDownload = false;
autoUpdater.logger = log;

autoUpdater.on('checking-for-update', () => {
	// checking for update
});

autoUpdater.on('update-available', (info: UpdateInfo) => {
	log.info(`The current version is ${app.getVersion()}. There is a new update for the app ${info.version}. Do you want to download?`);
	autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', (info: UpdateInfo) => {
	new Notification({
		icon: 'apps/desktop/src/assets/desktop-taskbar-256x256.ico',
		title: 'No update',
		body: `The current version (${info.version}) is the latest.`
	}).show();
});

autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
	log.info(`The current version is ${app.getVersion()}. Install ${info.version} now.`);
	const windows = App.BrowserWindow.getAllWindows();
	if (process.platform === 'darwin') {
		const window = App.BrowserWindow.getFocusedWindow();
		dialog
			.showMessageBox(window, {
				type: 'info',
				buttons: ['Install now', 'Cancel'],
				title: 'Mezon install',
				message: `The current version is ${app.getVersion()}. Install ${info.version} now.`
			})
			.then((result) => {
				if (result.response === 0) {
					windows.forEach((window) => {
						window.removeAllListeners('close');
						window.close();
					});

					setImmediate(() => {
						autoUpdater.quitAndInstall();
					});
				}
			});
	} else {
		windows.forEach((window) => {
			window.removeAllListeners('close');
			window.close();
		});
		autoUpdater.quitAndInstall(true, true);
	}
});

autoUpdater.on('download-progress', (progressObj) => {
	let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
	log.info('downloading...', log_message);
});

autoUpdater.on('error', (error) => {
	dialog.showMessageBox({
		message: `Error: ${error.message} !!`
	});
});

// handle setup events as quickly as possible
Main.initialize();

// bootstrap app
Main.bootstrapApp();
Main.bootstrapAppEvents();
