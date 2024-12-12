import {
	auditLogList,
	selectActionAuditLog,
	selectAllAuditLog,
	selectChannelById,
	selectCurrentClan,
	selectMemberClanByUserId,
	selectRoleByRoleId,
	selectTotalCountAuditLog,
	selectUserAuditLog,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ActionLog, convertTimeString, createImgproxyUrl, getAvatarForPrioritize } from '@mezon/utils';
import { Dropdown, Pagination } from 'flowbite-react';
import { ApiAuditLog } from 'mezon-js/api.gen';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AvatarImage } from '../../../AvatarImage/AvatarImage';

interface MainAuditLogProps {
	pageSize: number;
	setPageSize: Dispatch<SetStateAction<number>>;
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
}

const MainAuditLog = ({ pageSize, setPageSize, currentPage, setCurrentPage }: MainAuditLogProps) => {
	const auditLogData = useSelector(selectAllAuditLog);
	const totalCount = useSelector(selectTotalCountAuditLog);
	const currentClan = useSelector(selectCurrentClan);
	const auditLogFilterAction = useSelector(selectActionAuditLog);
	const auditLogFilterUser = useSelector(selectUserAuditLog);
	const dispatch = useAppDispatch();
	const totalPages = useMemo(() => {
		if (!totalCount) {
			return 0;
		}
		return Math.ceil(auditLogData.length / pageSize);
	}, [auditLogData.length, pageSize, totalCount]);

	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleChangePageSize = (pageSize: number) => {
		setPageSize(pageSize);
		setCurrentPage(1);
	};

	const displayAuditLog = useMemo(() => {
		if (auditLogData && auditLogData.length) {
			const start = (currentPage - 1) * pageSize;
			const end = Math.min(start + pageSize, auditLogData.length);
			return auditLogData.slice(start, end);
		}
	}, [currentPage, pageSize, auditLogData]);

	useEffect(() => {
		if (
			auditLogData.length < pageSize &&
			// auditLogData.length < totalCount &&
			// auditLogData.length < pageSize * currentPage &&
			currentClan?.clan_id
		) {
			const body = {
				noCache: true,
				actionLog: auditLogFilterAction ?? '',
				userId: auditLogFilterUser?.userId ?? '',
				clanId: currentClan?.clan_id ?? '',
				page: currentPage,
				pageSize: pageSize
			};
			dispatch(auditLogList(body));
		}
	}, [pageSize, currentPage]);

	return (
		<div className="flex flex-col">
			<div className="border-b-[1px] dark:border-[#616161] my-[32px]" />
			{displayAuditLog && displayAuditLog.length > 0 ? (
				<>
					{displayAuditLog.map((log) => (
						<AuditLogItem key={log.id} logItem={log} />
					))}

					<div className="flex flex-row justify-between items-center px-4 h-[54px] border-t-[1px] dark:border-borderDivider border-buttonLightTertiary mb-2">
						<div className={'flex flex-row items-center'}>
							Show
							<Dropdown
								value={pageSize}
								renderTrigger={() => (
									<div
										className={
											'flex flex-row items-center justify-center text-center dark:bg-slate-800 bg-slate-300 dark:text-contentTertiary text-colorTextLightMode border-[1px] dark:border-borderDivider border-buttonLightTertiary rounded mx-1 px-3 w-12'
										}
									>
										<span className="mr-1">{pageSize}</span>
										<Icons.ArrowDown />
									</div>
								)}
								label={''}
							>
								<Dropdown.Item
									className={'dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight'}
									onClick={() => handleChangePageSize(10)}
								>
									10
								</Dropdown.Item>
								<Dropdown.Item
									className={'dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight'}
									onClick={() => handleChangePageSize(50)}
								>
									50
								</Dropdown.Item>
								<Dropdown.Item
									className={'dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight'}
									onClick={() => handleChangePageSize(100)}
								>
									100
								</Dropdown.Item>
							</Dropdown>
							audit log of {auditLogData.length}
						</div>
						<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center text-center py-10 max-w-[440px] mx-auto">
					<div className="flex flex-col items-center justify-center text-center max-w-[300px]">
						<div className="text-lg font-semibold text-gray-300">NO LOGS YET</div>
						<p className="text-gray-500 mt-2">Once moderators begin moderating, you can moderate the moderation here.</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default MainAuditLog;

type AuditLogItemProps = {
	logItem: ApiAuditLog;
};

const AuditLogItem = ({ logItem }: AuditLogItemProps) => {
	const auditLogTime = convertTimeString(logItem?.time_log as string);
	const userAuditLogItem = useAppSelector(selectMemberClanByUserId(logItem?.user_id ?? ''));
	const userName = userAuditLogItem?.user?.username;
	const userMention = useAppSelector(selectMemberClanByUserId(logItem?.entity_id ?? ''));
	const clanRole = useSelector(selectRoleByRoleId(logItem?.entity_id ?? ''));
	const userNameMention = userMention?.user?.username;
	const channel = useAppSelector((state) => selectChannelById(state, logItem?.channel_id || ''));
	const avatar = getAvatarForPrioritize(userAuditLogItem?.clan_avatar, userAuditLogItem?.user?.avatar_url);

	return (
		<div className="dark:text-[#b5bac1] text-textLightTheme p-[10px] flex gap-3 items-center border dark:border-black border-[#d1d4d9] rounded-md dark:bg-[#2b2d31] bg-bgLightSecondary mb-4">
			<div className="w-10 h-10 rounded-full">
				<div className="w-10 h-10">
					{userAuditLogItem ? (
						<AvatarImage
							alt={userName || ''}
							userName={userName}
							className="min-w-10 min-h-10 max-w-10 max-h-10"
							srcImgProxy={createImgproxyUrl(avatar ?? '', { width: 300, height: 300, resizeType: 'fit' })}
							src={avatar}
						/>
					) : (
						<Icons.AvatarUser />
					)}
				</div>
			</div>
			<div>
				<div className="one-line">
					{(logItem?.action_log === ActionLog.ADD_MEMBER_CHANNEL_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.REMOVE_MEMBER_CHANNEL_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.ADD_ROLE_CHANNEL_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.REMOVE_ROLE_CHANNEL_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.ADD_MEMBER_THREAD_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.REMOVE_MEMBER_THREAD_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.ADD_ROLE_THREAD_ACTION_AUDIT ||
						logItem?.action_log === ActionLog.REMOVE_ROLE_THREAD_ACTION_AUDIT) &&
					logItem?.channel_id !== '0' ? (
						<span>
							<span>{userName}</span>{' '}
							<span className="lowercase">
								{logItem?.action_log === ActionLog.ADD_MEMBER_CHANNEL_ACTION_AUDIT ||
								logItem?.action_log === ActionLog.ADD_ROLE_CHANNEL_ACTION_AUDIT ||
								logItem?.action_log === ActionLog.ADD_MEMBER_THREAD_ACTION_AUDIT ||
								logItem?.action_log === ActionLog.ADD_ROLE_THREAD_ACTION_AUDIT
									? 'add'
									: 'remove'}{' '}
								{logItem?.action_log === ActionLog.ADD_MEMBER_CHANNEL_ACTION_AUDIT ||
								logItem?.action_log === ActionLog.REMOVE_MEMBER_CHANNEL_ACTION_AUDIT ||
								logItem?.action_log === ActionLog.ADD_MEMBER_THREAD_ACTION_AUDIT ||
								logItem?.action_log === ActionLog.REMOVE_MEMBER_THREAD_ACTION_AUDIT
									? userNameMention
									: clanRole?.title}{' '}
								({logItem?.entity_id}) to channel
							</span>
							<strong className="dark:text-white text-black font-medium">
								{' '}
								#{channel?.channel_label} ({channel?.channel_id})
							</strong>
						</span>
					) : (
						<span>
							<span>{userName}</span> <span className="lowercase">{logItem?.action_log}</span>
							<strong className="dark:text-white text-black font-medium">
								{' '}
								#{logItem?.entity_name || logItem?.entity_id} {logItem?.entity_name && `(${logItem?.entity_id})`}
							</strong>
						</span>
					)}
				</div>
				<div className="text-sm text-gray-500">{auditLogTime}</div>
			</div>
		</div>
	);
};
