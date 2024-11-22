import { selectActionAuditLog, selectUserAuditLog } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ActionLog, UserAuditLog } from '@mezon/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchActionAuditLogModal from '../../SearchActionAuditLog';
import SearchMembersAuditLogModal from '../../SearchMembersAuditLog';
import MainAuditLog from './AuditItem';

type AuditLogProps = {
	currentClanId: string;
};

const AuditLog = ({ currentClanId }: AuditLogProps) => {
	const actionFilter = useSelector(selectActionAuditLog);
	const userFilter = useSelector(selectUserAuditLog);
	const [isShowSearchActionModal, setIsShowSearchActionModal] = useState(false);
	const [isShowSearchMemberModal, setIsShowSearchMemberModal] = useState(false);
	const actionModalRef = useRef<HTMLDivElement | null>(null);
	const memberModalRef = useRef<HTMLDivElement | null>(null);

	const handleSearchActionClick = useCallback(() => {
		setIsShowSearchActionModal((prev) => !prev);
		if (isShowSearchMemberModal) setIsShowSearchMemberModal(false);
	}, [isShowSearchMemberModal]);

	const handleSearchMemberClick = useCallback(() => {
		setIsShowSearchMemberModal((prev) => !prev);
		if (isShowSearchActionModal) setIsShowSearchActionModal(false);
	}, [isShowSearchActionModal]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (actionModalRef.current && !actionModalRef.current.contains(event.target as Node)) {
				setIsShowSearchActionModal(false);
			}
			if (memberModalRef.current && !memberModalRef.current.contains(event.target as Node)) {
				setIsShowSearchMemberModal(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const closeModal = useCallback(() => {
		setIsShowSearchActionModal(false);
		setIsShowSearchMemberModal(false);
	}, []);

	return (
		<div className="mt-[60px]">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold dark:text-textDarkTheme text-textLightTheme flex">
					<div>Audit Log</div>
				</h2>
				<div className="flex gap-4">
					<div className="relative">
						<div
							onClick={handleSearchMemberClick}
							className="flex items-center gap-3 dark:text-textPrimary text-buttonProfile w-full text-[13px] line-clamp-1 break-all"
						>
							<div className="max-sm:hidden">Filter by User</div>
							<div className="flex items-center gap-1 cursor-pointer">
								<div className=" one-line">
									{userFilter && userFilter.userName !== UserAuditLog.ALL_USER_AUDIT ? userFilter.userName : 'All'}
								</div>
								<Icons.ArrowDown />
							</div>
						</div>
						{isShowSearchMemberModal && (
							<div ref={memberModalRef}>
								<SearchMembersAuditLogModal
									currentClanId={currentClanId}
									actionFilter={actionFilter}
									userFilter={userFilter}
									closeModal={closeModal}
								/>
							</div>
						)}
					</div>
					<div className="relative">
						<div
							onClick={handleSearchActionClick}
							className="flex items-center gap-3 dark:text-textPrimary text-buttonProfile w-full text-[13px] line-clamp-1 break-all"
						>
							<div className="max-sm:hidden">Filter by Action</div>
							<div className="flex items-center gap-1 cursor-pointer">
								<div className=" one-line">{actionFilter && actionFilter !== ActionLog.ALL_ACTION_AUDIT ? actionFilter : 'All'}</div>
								<Icons.ArrowDown />
							</div>
						</div>
						{isShowSearchActionModal && (
							<div ref={actionModalRef}>
								<SearchActionAuditLogModal
									key={actionFilter}
									currentClanId={currentClanId}
									actionFilter={actionFilter}
									closeModal={closeModal}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			<MainAuditLog />
		</div>
	);
};

export default AuditLog;
