import { auditLogFilterActions, auditLogList } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ActionLog } from '@mezon/utils';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface Action {
	name: string;
	icon: string;
}

type SearchActionAuditLogProps = {
	currentClanId: string;
	actionFilter: string;
	closeModal: () => void;
};

const iconMap: { [key in ActionLog]: string } = {
	[ActionLog.ALL_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CLAN_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CHANNEL_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CHANNEL_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CHANNEL_PRIVATE_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CHANNE_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CHANNEL_PERMISSION_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CHANNEL_PERMISSION_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CHANNEL_PERMISSION_ACTION_AUDIT]: '-',
	[ActionLog.KICK_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.PRUNE_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.BAN_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.UNBAN_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_ROLES_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.MOVE_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.DISCONNECT_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.ADD_BOT_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_THREAD_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_THREAD_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_THREAD_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_ROLE_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_ROLE_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_ROLE_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_WEBHOOK_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_WEBHOOK_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_WEBHOOK_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_EMOJI_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_EMOJI_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_EMOJI_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_STICKER_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_STICKER_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_STICKER_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_EVENT_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_EVENT_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_EVENT_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CANVAS_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CANVAS_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CANVAS_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CATEGORY_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CATEGORY_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CATEGORY_ACTION_AUDIT]: '-'
};

const SearchActionAuditLogModal = ({ currentClanId, actionFilter, closeModal }: SearchActionAuditLogProps) => {
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedAction, setSelectedAction] = useState<string>(actionFilter || ActionLog.ALL_ACTION_AUDIT);

	const actions: Action[] = Object.values(ActionLog).map((action) => ({
		name: action,
		icon: iconMap[action as ActionLog] || '-'
	}));

	const handleActionClick = (action: Action) => {
		setSelectedAction(action.name || actionFilter);
		dispatch(auditLogFilterActions.setAction(action.name));
		if (currentClanId) {
			const body = {
				actionLog: action?.name === ActionLog.ALL_ACTION_AUDIT ? '' : action?.name,
				userId: '',
				clanId: currentClanId ?? '',
				page: 1,
				pageSize: 10000
			};
			dispatch(auditLogList(body) as any);
		}
		closeModal();
	};

	return (
		<div className="absolute border left-0 top-8 pb-3 rounded border-solid dark:border-borderDividerLight dark:bg-bgPrimary bg-bgLightPrimary z-[9999] shadow w-72">
			<div className="dark:bg-bgPrimary bg-bgLightPrimary rounded-lg w-full max-w-xs">
				<div className="relative m-2">
					<input
						type="text"
						placeholder="Search Actions"
						className="w-full p-2 pr-10 bg-gray-700 text-white rounded focus:outline-none"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<span className="absolute right-3 top-3 text-gray-400">
						<Icons.Search className="w-4 h-4 dark:text-white text-colorTextLightMode" />
					</span>
				</div>

				<div className="h-64 ml-2 pr-1 overflow-auto thread-scroll">
					{actions
						.filter((action) => action.name.toLowerCase().includes(searchTerm.toLowerCase()))
						.map((action, index) => (
							<div
								key={index}
								className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
									selectedAction === action.name ? 'bg-gray-600' : 'hover:bg-gray-700'
								}`}
								onClick={() => handleActionClick(action)}
							>
								<span className={`p-2 rounded`}>{action.icon}</span>
								<span className="ml-3 text-white">{action.name}</span>
								{selectedAction === action.name && (
									<span className="ml-auto ">
										<Icons.CheckMarkFilter defaultSize="w-6 h-6" />
									</span>
								)}
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default SearchActionAuditLogModal;
