import { selectAllAuditLogData, selectMemberClanByUserId, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { convertTimeString, getAvatarForPrioritize } from '@mezon/utils';
import { ApiAuditLog } from 'mezon-js/api.gen';
import { useSelector } from 'react-redux';
import { AvatarImage } from '../../../AvatarImage/AvatarImage';

const MainAuditLog = () => {
	const auditLogData = useSelector(selectAllAuditLogData);

	return (
		<div className="flex flex-col">
			<div className="border-b-[1px] dark:border-[#616161] my-[32px]" />
			{auditLogData?.logs && auditLogData.logs.length > 0 ? (
				auditLogData.logs.map((log) => <AuditLogItem key={log.id} logItem={log} />)
			) : (
				<div className="flex flex-col items-center justify-center text-center py-10 max-w-[440px] mx-auto">
					{/* <Icons.EmptyDocument className="mb-4 text-gray-400" size={64} /> */}
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

const actionMap: Record<string, string> = {
	'Create Channel': 'created',
	'Delete Channel': 'removed',
	'Change Channel': 'changed'
	// Add more actions here as needed
};

const AuditLogItem = ({ logItem }: AuditLogItemProps) => {
	const auditLogTime = convertTimeString(logItem?.time_log as string);
	const userStream = useAppSelector(selectMemberClanByUserId(logItem.user_id ?? ''));
	const userName = userStream?.user?.username;
	const avatar = getAvatarForPrioritize(userStream?.clan_avatar, userStream?.user?.avatar_url);
	const actionText = (logItem.action_log && actionMap[logItem?.action_log]) || 'performed an action'; // Default text if action not in map

	return (
		<div className="dark:text-[#b5bac1] text-textLightTheme py-[20px] px-[16px] flex gap-3 items-center border dark:border-black border-[#d1d4d9] rounded-md dark:bg-[#2b2d31] bg-bgLightSecondary mb-4">
			<div className="w-10 h-10 rounded-full">
				<div className="w-10 h-10">
					{userStream ? (
						<AvatarImage alt={userName || ''} userName={userName} className="min-w-10 min-h-10 max-w-10 max-h-10" src={avatar} />
					) : (
						<Icons.AvatarUser />
					)}
				</div>
			</div>
			<div>
				<div>
					<strong>{userName}</strong> {actionText} #{logItem.entity_name || logItem.entity_id}
				</div>
				<div className="text-sm text-gray-500">{auditLogTime}</div>
			</div>
		</div>
	);
};
