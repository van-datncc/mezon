import {
	fetchRoomParticipantsByRoomId,
	fetchRoomStatisticsByRoomId,
	fetchRoomSummaryByRoomId,
	selectTranscriptRoomDetailState,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import InfoRow from '../../components/dashboard/InfoRow';
import MetricCard from '../../components/dashboard/MetricCard';
import { formatDurationSec, formatRoomDate, normalizeRoomStatus, type CallStatus } from '../../utils/dashboard/format';

type TabType = 'overview' | 'fullTranscript' | 'summary' | 'participants';

const getFileName = (url?: string) => {
	if (!url) return '—';
	return url.split('/').pop() || url;
};

const TABS: TabType[] = ['overview', 'fullTranscript', 'summary', 'participants'];

const TranscriptCallDetail = () => {
	const { t } = useTranslation('adminApplication');
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { callId } = useParams<{ callId: string }>();
	const roomId = callId ?? '';

	const { detail, hasFetched } = useAppSelector((s) => selectTranscriptRoomDetailState(s, roomId));

	const loadRoom = useCallback(() => {
		if (!roomId) return;
		dispatch(fetchRoomStatisticsByRoomId({ roomId }));
		dispatch(fetchRoomSummaryByRoomId({ roomId }));
		dispatch(fetchRoomParticipantsByRoomId({ roomId }));
	}, [dispatch, roomId]);

	useEffect(() => {
		loadRoom();
	}, [loadRoom]);

	const stats = detail.statistics;
	const status = normalizeRoomStatus(stats?.status);

	const statusConfig = useMemo(() => {
		const config: Record<CallStatus, { label: string; bg: string; text: string }> = {
			completed: {
				label: t('transcriptCalls.status.completed'),
				bg: 'bg-green-100 dark:bg-green-900/30',
				text: 'text-green-800 dark:text-green-400'
			},
			processing: {
				label: t('transcriptCalls.status.processing'),
				bg: 'bg-blue-100 dark:bg-blue-900/30',
				text: 'text-blue-800 dark:text-blue-400'
			},
			pending: {
				label: t('transcriptCalls.status.pending'),
				bg: 'bg-yellow-100 dark:bg-yellow-900/30',
				text: 'text-yellow-800 dark:text-yellow-400'
			},
			failed: {
				label: t('transcriptCalls.status.failed'),
				bg: 'bg-red-100 dark:bg-red-900/30',
				text: 'text-red-800 dark:text-red-400'
			}
		};
		return config[status];
	}, [status, t]);

	const [activeTab, setActiveTab] = useState<TabType>('overview');

	if (!roomId) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<Icons.IconMeetDM className="w-16 h-16 dark:text-textSecondary text-gray-300" />
				<div className="text-lg font-medium dark:text-textSecondary text-gray-400">{t('transcriptCalls.detail.notFound')}</div>
				<button
					type="button"
					onClick={() => navigate('/developers/transcript-calls')}
					className="px-4 py-2 bg-buttonPrimary hover:bg-bgSelectItemHover text-white rounded-lg transition text-sm"
				>
					{t('transcriptCalls.detail.back')}
				</button>
			</div>
		);
	}

	const loadingBlock = !hasFetched || (detail.statisticsLoading && stats?.room_id === undefined);
	const failedBlock = hasFetched && !detail.statisticsLoading && detail.statisticsError;
	const missingStatsBlock = hasFetched && !detail.statisticsLoading && !stats?.room_id && !detail.statisticsError;

	if (loadingBlock) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[320px] gap-4">
				<div className="text-sm dark:text-textSecondary text-gray-500">{t('transcriptCalls.loading')}</div>
			</div>
		);
	}

	if (failedBlock) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4 max-w-md mx-auto text-center">
				<Icons.IconMeetDM className="w-16 h-16 dark:text-textSecondary text-gray-300" />
				<div className="text-sm dark:text-textSecondary text-gray-500">{t('transcriptCalls.detail.loadError')}</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => navigate('/developers/transcript-calls')}
						className="px-4 py-2 rounded-lg border dark:border-borderClan text-sm"
					>
						{t('transcriptCalls.detail.back')}
					</button>
					<button
						type="button"
						onClick={loadRoom}
						className="px-4 py-2 bg-buttonPrimary hover:bg-bgSelectItemHover text-white rounded-lg text-sm"
					>
						{t('transcriptCalls.detail.refresh')}
					</button>
				</div>
			</div>
		);
	}

	if (missingStatsBlock) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<Icons.IconMeetDM className="w-16 h-16 dark:text-textSecondary text-gray-300" />
				<div className="text-lg font-medium dark:text-textSecondary text-gray-400">{t('transcriptCalls.detail.notFound')}</div>
				<button
					type="button"
					onClick={() => navigate('/developers/transcript-calls')}
					className="px-4 py-2 bg-buttonPrimary hover:bg-bgSelectItemHover text-white rounded-lg transition text-sm"
				>
					{t('transcriptCalls.detail.back')}
				</button>
			</div>
		);
	}

	if (!stats) {
		return null;
	}

	const displayId = stats.room_id ?? roomId;
	const roomName = stats.room_name ?? detail.summary?.room_name ?? '—';

	const tabLabels: Record<TabType, string> = {
		overview: t('transcriptCalls.tabs.overview'),
		fullTranscript: t('transcriptCalls.tabs.fullTranscript'),
		summary: t('transcriptCalls.tabs.summary'),
		participants: t('transcriptCalls.tabs.audio')
	};

	const fullText = detail.summary?.full_text?.trim();
	const summaryText = detail.summary?.summary_data?.summary?.trim();
	const actionItems = detail.summary?.summary_data?.action_items ?? [];

	return (
		<div className="max-w-7xl mx-auto flex flex-col gap-6">
			<div className="flex items-center justify-between flex-wrap gap-3">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => navigate('/developers/transcript-calls')}
						className="flex items-center gap-1 dark:text-textSecondary text-gray-500 hover:dark:text-textDarkTheme hover:text-gray-800 transition text-sm font-medium"
					>
						<Icons.LeftArrowIcon className="w-4" />
						{t('transcriptCalls.detail.back')}
					</button>
					<span className="dark:text-textSecondary text-gray-300">/</span>
					<h2 className="text-2xl font-bold dark:text-textDarkTheme text-gray-900 truncate max-w-[300px]">{displayId}</h2>
					<span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>{statusConfig.label}</span>
				</div>
				<button
					type="button"
					onClick={loadRoom}
					className="flex items-center gap-2 px-4 py-2 bg-buttonPrimary hover:bg-bgSelectItemHover text-white rounded-lg transition text-sm font-medium"
				>
					<Icons.SyncIcon className="w-4 h-4" />
					{t('transcriptCalls.detail.refresh')}
				</button>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<MetricCard label={t('transcriptCalls.detail.metrics.totalTracks')} value={stats?.total_tracks ?? 0} />
				<MetricCard
					label={t('transcriptCalls.detail.metrics.completed')}
					value={stats?.completed_tracks ?? 0}
					valueClassName="text-green-600 dark:text-green-400"
				/>
				<MetricCard
					label={t('transcriptCalls.detail.metrics.duration')}
					value={formatDurationSec(stats?.total_duration_sec)}
					valueClassName="text-blue-600 dark:text-blue-400"
				/>
				<MetricCard
					label={t('transcriptCalls.detail.metrics.segments')}
					value={stats?.total_segments ?? 0}
					valueClassName="text-purple-600 dark:text-purple-400"
				/>
			</div>

			<div className="dark:bg-[#2b2d31] bg-white rounded-lg shadow border dark:border-[#4d4f52] border-gray-200 overflow-hidden">
				<div className="border-b border-gray-200 dark:border-[#4d4f52]">
					<nav className="flex -mb-px flex-wrap">
						{TABS.map((tab) => (
							<button
								type="button"
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={
									activeTab === tab
										? 'py-4 px-6 text-sm font-medium border-b-2 border-buttonPrimary text-buttonPrimary dark:text-[#C9CDFB] transition-colors'
										: 'py-4 px-6 text-sm font-medium dark:text-textSecondary text-gray-500 hover:dark:text-textDarkTheme hover:text-gray-700 dark:hover:border-borderClan border-b-2 border-transparent transition-colors'
								}
							>
								{tabLabels[tab]}
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'overview' && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<InfoRow label={t('transcriptCalls.columns.roomName')} value={roomName} />
								<InfoRow
									label={t('transcriptCalls.columns.status')}
									value={
										<span
											className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}
										>
											{statusConfig.label}
										</span>
									}
								/>
								<InfoRow label={t('transcriptCalls.columns.createdAt')} value={formatRoomDate(stats.created_at)} />
								<InfoRow label={t('transcriptCalls.columns.completedAt')} value={formatRoomDate(stats.finalized_at)} />
							</div>
							{detail.summary?.participants && detail.summary.participants.length > 0 ? (
								<InfoRow label={t('transcriptCalls.detail.participants')} value={detail.summary.participants.join(', ')} />
							) : null}
						</div>
					)}

					{activeTab === 'fullTranscript' && (
						<div className="space-y-2">
							{detail.summaryLoading ? (
								<div className="text-sm dark:text-textSecondary">{t('transcriptCalls.loading')}</div>
							) : detail.summaryError ? (
								<div className="text-sm text-red-600 dark:text-red-400">{t('transcriptCalls.detail.loadError')}</div>
							) : fullText ? (
								<pre className="text-sm whitespace-pre-wrap dark:text-textDarkTheme text-gray-900 font-sans max-h-[480px] overflow-y-auto">
									{fullText}
								</pre>
							) : (
								<div className="text-sm dark:text-textSecondary text-gray-500 italic">
									{t('transcriptCalls.detail.transcriptEmpty')}
								</div>
							)}
						</div>
					)}

					{activeTab === 'summary' && (
						<div className="space-y-6">
							{detail.summaryLoading ? (
								<div className="text-sm dark:text-textSecondary">{t('transcriptCalls.loading')}</div>
							) : detail.summaryError ? (
								<div className="text-sm text-red-600 dark:text-red-400">{t('transcriptCalls.detail.loadError')}</div>
							) : (
								<>
									{summaryText ? (
										<div>
											<div className="text-sm font-medium dark:text-textSecondary text-gray-500 mb-2">
												{t('transcriptCalls.tabs.summary')}
											</div>
											<p className="text-sm dark:text-textDarkTheme text-gray-900 whitespace-pre-wrap">{summaryText}</p>
										</div>
									) : (
										<div className="text-sm dark:text-textSecondary text-gray-500 italic">
											{t('transcriptCalls.detail.summaryEmpty')}
										</div>
									)}
									{actionItems.length > 0 ? (
										<div>
											<div className="text-sm font-medium dark:text-textSecondary text-gray-500 mb-2">
												{t('transcriptCalls.detail.actionItems')}
											</div>
											<ul className="space-y-3">
												{actionItems.map((entry, idx) => (
													<li
														key={`${entry.participant_id ?? idx}`}
														className="text-sm dark:text-textDarkTheme text-gray-900"
													>
														<div className="font-medium">{entry.participant_id ?? '—'}</div>
														<ul className="list-disc pl-5 mt-1 space-y-1">
															{(entry.items ?? []).map((item, i) => (
																<li key={i}>{item}</li>
															))}
														</ul>
													</li>
												))}
											</ul>
										</div>
									) : null}
								</>
							)}
						</div>
					)}

					{activeTab === 'participants' && (
						<div className="space-y-4">
							{detail.participantsLoading ? (
								<div className="text-sm dark:text-textSecondary">{t('transcriptCalls.loading')}</div>
							) : detail.participantsError ? (
								<div className="text-sm text-red-600 dark:text-red-400">{t('transcriptCalls.detail.loadError')}</div>
							) : detail.participants.filter((p) => p.tracks && p.tracks.some((t) => t.filename)).length === 0 ? (
								<div className="flex flex-col items-center justify-center gap-4 py-8">
									<Icons.HeadPhoneICon className="w-12 h-12 dark:text-textSecondary text-gray-300" />
									<div className="text-sm dark:text-textSecondary text-gray-500">{t('transcriptCalls.detail.audioEmpty')}</div>
								</div>
							) : (
								<div className="space-y-6">
									{detail.participants
										.filter((p) => p.tracks && p.tracks.some((t) => t.filename))
										.map((p, idx) => (
											<div
												key={`${p.participant_identity ?? idx}`}
												className="border dark:border-borderClan rounded-lg overflow-hidden"
											>
												<div className="bg-gray-50 dark:bg-bgTertiary px-4 py-3 border-b dark:border-borderClan flex justify-between items-center">
													<div className="flex flex-col">
														<span className="font-bold dark:text-textDarkTheme text-gray-900">
															{p.display_name || p.user_name || p.participant_identity || '—'}
														</span>
													</div>
													<span className="text-xs dark:text-textSecondary text-gray-500 italic">
														{p.tracks?.length ?? 0} {t('transcriptCalls.detail.metrics.totalTracks').toLowerCase()}
													</span>
												</div>
												<div className="bg-white dark:bg-bgSecondary divide-y dark:divide-borderClan divide-gray-50">
													{p.tracks
														?.filter((t) => t.filename)
														.map((track, tIdx) => (
															<div
																key={tIdx}
																className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-bgTertiary/30 transition-colors"
															>
																<div className="flex-1 min-w-0">
																	<span
																		className="text-xs font-mono dark:text-textSecondary text-gray-500 block"
																		title={track.filename}
																	>
																		{getFileName(track.filename)}
																	</span>
																</div>
																<div className="flex-1 max-w-[500px]">
																	{track.filename && (
																		<audio controls className="h-8 w-full">
																			<source src={track.filename} type="audio/mpeg" />
																			Your browser does not support the audio element.
																		</audio>
																	)}
																</div>
															</div>
														))}
												</div>
											</div>
										))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TranscriptCallDetail;
