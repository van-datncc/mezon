const PAGE_SIZE = 10;

const STATUS_BADGE: Record<string, string> = {
	pending: 'bg-gray-100 text-gray-600',
	completed: 'bg-green-100 text-green-700',
	final_room: 'bg-yellow-100 text-yellow-700',
	failed: 'bg-red-100 text-red-700'
};

export const getStatusOptions = (t: (key: string) => string) => [
	{ value: '', label: t('meetingRoomsFilter.allStatuses') },
	{ value: 'pending', label: t('meetingRoomsFilter.pending') },
	{ value: 'completed', label: t('meetingRoomsFilter.completed') },
	{ value: 'final_room', label: t('meetingRoomsFilter.finalRoom') },
	{ value: 'failed', label: t('meetingRoomsFilter.failed') }
];

export const getTimeOptions = (t: (key: string) => string) => [
	{ value: '', label: t('meetingRoomsFilter.noTimeFilter') },
	{ value: '12h', label: t('meetingRoomsFilter.last12Hours') },
	{ value: '24h', label: t('meetingRoomsFilter.last24Hours') },
	{ value: '2d', label: t('meetingRoomsFilter.last2Days') },
	{ value: '7d', label: t('meetingRoomsFilter.last7Days') }
];

export { PAGE_SIZE, STATUS_BADGE };
