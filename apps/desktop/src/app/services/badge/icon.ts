export class BadgeIconGenerator {
	private mainWindow: Electron.BrowserWindow;
	private MAX_WIN_COUNT = 99;
	constructor(mainWindow: Electron.BrowserWindow) {
		this.mainWindow = mainWindow;
	}

	generate(count: number): Promise<string> {
		const small = count > this.MAX_WIN_COUNT;
		return this.mainWindow.webContents.executeJavaScript(
			`window.drawBadge = function ${this.drawBadge}; window.drawBadge('${count}', ${small});`
		);
	}

	drawBadge(text: string, small: boolean) {
		const scale = 2; // should rely display dpi
		const size = (small ? 20 : 16) * scale;
		const canvas = document.createElement('canvas');
		canvas.setAttribute('width', `${size}`);
		canvas.setAttribute('height', `${size}`);
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			return null;
		}

		// circle
		ctx.fillStyle = '#FF1744'; // Material Red A400
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		ctx.fill();

		// text
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = 11 * scale + 'px sans-serif';
		ctx.fillText(text, size / 2, size / 2, size);

		return canvas.toDataURL();
	}
}
