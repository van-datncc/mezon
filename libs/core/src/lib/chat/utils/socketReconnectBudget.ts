const WINDOW_MS = 2 * 60 * 1000;
const MAX_ATTEMPTS = 5;

let attemptTimes: number[] = [];

function prune(now: number) {
	attemptTimes = attemptTimes.filter((t) => now - t < WINDOW_MS);
}

export function msUntilSocketReconnectBudgetSlot(): number {
	const now = Date.now();
	prune(now);
	if (attemptTimes.length < MAX_ATTEMPTS) {
		return 0;
	}
	return Math.max(0, attemptTimes[0] + WINDOW_MS - now);
}

export function consumeSocketReconnectBudget(): boolean {
	const now = Date.now();
	prune(now);
	if (attemptTimes.length >= MAX_ATTEMPTS) {
		return false;
	}
	attemptTimes.push(now);
	return true;
}

export function refundSocketReconnectBudgetSlot(): void {
	if (attemptTimes.length > 0) {
		attemptTimes.pop();
	}
}

export function resetSocketReconnectBudget(): void {
	attemptTimes = [];
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('mezon:socket-budget-reset'));
	}
}
