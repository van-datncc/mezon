import { BrowserWindow, dialog, ipcMain, Notification } from 'electron';
import type { UpdateInfo } from 'electron-updater';
import { autoUpdater, DOWNLOAD_PROGRESS } from 'electron-updater';

import { CHECK_UPDATE, INSTALL_UPDATE, UPDATE_AVAILABLE, UPDATE_ERROR } from './events/constants';
import { forceQuit } from './utils';

let isUpdateCheckStarted = false;

export default function setupAutoUpdates() {
	if (isUpdateCheckStarted) {
		return;
	}

	isUpdateCheckStarted = true;
	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;

	ipcMain.handle(INSTALL_UPDATE, () => {
		forceQuit.enable();
		return autoUpdater.quitAndInstall();
	});

	ipcMain.handle(CHECK_UPDATE, () => {
		autoUpdater.checkForUpdates();
	});

	autoUpdater.on('error', (error: Error) => {
		dialog.showMessageBox({
			message: `Error: ${error.message} !!`
		});

		BrowserWindow.getAllWindows().forEach((window) => {
			window.webContents.send(UPDATE_ERROR, error);
		});
	});

	autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
		BrowserWindow.getAllWindows().forEach((window) => {
			window.webContents.send(UPDATE_AVAILABLE, info);
		});
	});

	autoUpdater.on('download-progress', (progressObj) => {
		BrowserWindow.getAllWindows().forEach((window) => {
			window.webContents.send(DOWNLOAD_PROGRESS, progressObj);
		});
	});

	autoUpdater.on('update-not-available', (info: UpdateInfo) => {
		new Notification({
			icon: 'apps/desktop/src/assets/desktop-taskbar-256x256.ico',
			title: 'No update',
			body: `The current version (${info.version}) is the latest.`
		}).show();
	});
}
