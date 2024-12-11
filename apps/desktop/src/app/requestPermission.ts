import { dialog, ipcMain, shell, systemPreferences } from 'electron';

import { REQUEST_PERMISSION_CAMERA, REQUEST_PERMISSION_MICROPHONE } from './events/constants';

export default function setupRequestPermission() {
	ipcMain.handle(REQUEST_PERMISSION_MICROPHONE, async () => {
		const microphoneAsk = await systemPreferences.askForMediaAccess('microphone');
		if (!microphoneAsk) {
			const { response } = await dialog.showMessageBox({
				type: 'warning',
				buttons: ['OK'],
				title: 'Microphone Access',
				message: 'Microphone access is denied. Please enable it in system preferences.'
			});
			if (response === 0) {
				shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
			}
		}
	});

	ipcMain.handle(REQUEST_PERMISSION_CAMERA, async () => {
		const cameraAsk = await systemPreferences.askForMediaAccess('camera');
		if (!cameraAsk) {
			const { response } = await dialog.showMessageBox({
				type: 'warning',
				buttons: ['OK'],
				title: 'Camera Access',
				message: 'Camera access is denied. Please enable it in system preferences.'
			});
			if (response === 0) {
				shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Camera');
			}
		}
	});
}
