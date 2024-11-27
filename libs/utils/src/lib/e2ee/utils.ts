export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export function concatArrayBuffers(...args: Array<ArrayBuffer>) {
	const buffers = Array.prototype.slice.call(args);
	const buffersLengths = buffers.map((b) => {
		return b.byteLength;
	});
	const totalBufferlength = buffersLengths.reduce((p, c) => {
		return p + c;
	}, 0);
	const unit8Arr = new Uint8Array(totalBufferlength);
	buffersLengths.reduce((p, c, i) => {
		unit8Arr.set(new Uint8Array(buffers[i]), p);
		return p + c;
	}, 0);
	return unit8Arr.buffer;
}

export function eqSet<T>(A: Set<T>, B: Set<T>) {
	if (A.size !== B.size) {
		return false;
	}
	for (const a of A) {
		if (!B.has(a)) {
			return false;
		}
	}
	return true;
}

export function arrayBufferEqual(A: ArrayBuffer, B: ArrayBuffer) {
	const VA = new DataView(A);
	const VB = new DataView(B);
	if (VA.byteLength !== VB.byteLength) {
		return false;
	}
	for (let i = 0; i < VA.byteLength; i++) {
		if (VA.getUint8(i) !== VB.getUint8(i)) {
			return false;
		}
	}
	return true;
}

// Based on mattermost-webapp/utils/utils.jsx
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 22;
const RESERVED_USERNAMES = ['valet', 'all', 'channel', 'here', 'matterbot', 'system', 'e2ee'];

export function isValidUsername(name: string): boolean {
	if (!name) {
		return false;
	} else if (name.length < MIN_USERNAME_LENGTH || name.length > MAX_USERNAME_LENGTH) {
		return false;
	} else if (!/^[a-z0-9.\-_]+$/.test(name)) {
		return false;
	} else if (!/[a-z]/.test(name.charAt(0))) {
		//eslint-disable-line no-negated-condition
		return false;
	}
	for (const reserved of RESERVED_USERNAMES) {
		if (name === reserved) {
			return false;
		}
	}

	return true;
}
