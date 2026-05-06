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

export { formatDate, formatStatus, getDateRangeFromTimeFilter };
