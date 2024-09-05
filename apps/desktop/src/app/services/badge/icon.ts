import { BADGE_STYLE } from './constants';
import { BadgeIconElement, BadgeIconStyle } from './types';

export class BadgeIconGenerator {
	private mainWindow: Electron.BrowserWindow;
	private style: BadgeIconStyle;
	constructor(mainWindow: Electron.BrowserWindow, style = {}) {
		this.mainWindow = mainWindow;
		this.style = Object.assign(BADGE_STYLE, style);
	}

	generate(count: number): Promise<string> {
		const opts = JSON.stringify(this.style);
		return this.mainWindow.webContents.executeJavaScript(`window.drawBadge = function ${this.drawBadge}; window.drawBadge(${count}, ${opts});`);
	}

	drawBadge(count: number, style: BadgeIconStyle) {
		const radius = style.radius;
		const badgeIcon = document.createElement('canvas') as BadgeIconElement;
		badgeIcon.width = Math.ceil(radius * 2);
		badgeIcon.height = Math.ceil(radius * 2);
		badgeIcon.ctx = badgeIcon.getContext('2d');
		badgeIcon.radius = radius;
		badgeIcon.count = count;
		badgeIcon.displayStyle = style;

		style.color = style.color ? style.color : 'red';
		style.font = style.font ? style.font : '18px arial';
		style.fontColor = style.fontColor ? style.fontColor : 'white';
		style.fit = style.fit === undefined ? true : style.fit;

		badgeIcon.draw = function () {
			let fontScale: number, fontWidth: number;
			this.width = Math.ceil(this.radius * 2);
			this.height = Math.ceil(this.radius * 2);
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.ctx.fillStyle = this.displayStyle.color;
			this.ctx.beginPath();
			this.ctx.arc(radius, radius, radius, 0, Math.PI * 2);
			this.ctx.fill();
			this.ctx.font = this.displayStyle.font;
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';
			this.ctx.fillStyle = this.displayStyle.fontColor;
			const count = this.count > 99 ? '99+' : this.count.toString();
			const fontSize = Number(/[0-9.]+/.exec(this.ctx.font)[0]);

			if (!this.displayStyle.fit || isNaN(fontSize)) {
				this.ctx.fillText(count, radius, radius);
			} else {
				fontWidth = this.ctx.measureText(count).width;
				fontScale = (Math.cos(Math.atan(fontSize / fontWidth)) * this.radius * 2) / fontWidth;
				this.ctx.setTransform(fontScale, 0, 0, fontScale, this.radius, this.radius);
				this.ctx.fillText(count, 0, 0);
				this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			}

			if (!this.displayStyle.fit || isNaN(fontSize)) {
				this.ctx.fillText(count, radius, radius);
			} else {
				fontScale = (Math.cos(Math.atan(fontSize / fontWidth)) * this.radius * 2) / fontWidth;
				this.ctx.setTransform(fontScale, 0, 0, fontScale, this.radius, this.radius);
				this.ctx.fillText(count, 0, 0);
				this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			}
			return this;
		};

		badgeIcon.draw();
		return badgeIcon.toDataURL();
	}
}
