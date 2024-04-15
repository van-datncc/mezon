import { ThreadError } from '../types';

export const TIME_COMBINE = 120;
export const LIMIT_MESSAGE = 50;
export const LIMIT_CLAN_ITEM = 50;

export const KEY_KEYBOARD = { BACKSPACE: 8, TAB: 9, ENTER: 13, ESC: 27, UP: 38, DOWN: 40, RIGHT: 39, LEFT: 27 };
export const threadError: ThreadError = {
	name: 'Thread Name is required',
	message: 'Starter Message is required',
};

export const regexToDetectGifLink = /\bhttps?:\/\/\S+\.gif\b/g;
