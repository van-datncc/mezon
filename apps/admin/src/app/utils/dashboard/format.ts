const formatDate = (iso: string): string => {
	if (!iso) return 'N/A';
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso;
	const hh = String(d.getHours()).padStart(2, '0');
	const mm = String(d.getMinutes()).padStart(2, '0');
	const ss = String(d.getSeconds()).padStart(2, '0');
	return `${hh}:${mm}:${ss} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatStatus = (status: string): string => {
	return status
		.replace(/_/g, ' ')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

function getDateRangeFromTimeFilter(timeFilter: string): { startDate?: string; endDate?: string } {
	if (!timeFilter) return {};
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

	const hoursAgo = (h: number) => {
		const d = new Date(now);
		d.setHours(d.getHours() - h);
		return toDateStr(d);
	};
	const daysAgo = (days: number) => {
		const d = new Date(now);
		d.setDate(d.getDate() - days);
		return toDateStr(d);
	};

	const today = toDateStr(now);
	if (timeFilter === '12h') return { startDate: hoursAgo(12), endDate: today };
	if (timeFilter === '24h') return { startDate: hoursAgo(24), endDate: today };
	if (timeFilter === '2d') return { startDate: daysAgo(2), endDate: today };
	if (timeFilter === '7d') return { startDate: daysAgo(7), endDate: today };
	return {};
}

const formatDurationSec = (sec?: number): string => {
	if (sec === undefined || sec <= 0) return '0s';
	const s = Math.floor(sec % 60);
	const m = Math.floor((sec / 60) % 60);
	const h = Math.floor(sec / 3600);
	if (h > 0) return `${h}h ${m}m ${s}s`;
	if (m > 0) return `${m}m ${s}s`;
	return `${s}s`;
};

const formatRoomDate = (iso?: string): string => {
	if (!iso) return '—';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleString(undefined, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
};

export type CallStatus = 'pending' | 'processing' | 'completed' | 'failed';

const normalizeRoomStatus = (raw?: string): CallStatus => {
	const s = (raw ?? '').toLowerCase();
	if (s === 'completed' || s === 'processing' || s === 'pending' || s === 'failed') return s;
	return 'pending';
};

export { formatDate, formatDurationSec, formatRoomDate, formatStatus, getDateRangeFromTimeFilter, normalizeRoomStatus };
