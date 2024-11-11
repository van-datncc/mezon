import { auditLogFilterActions, auditLogList, selectAllUserClans, selectMemberClanByUserId, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { IUserAuditLog, UsersClanEntity, getAvatarForPrioritize } from '@mezon/utils';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarImage } from '../AvatarImage/AvatarImage';

type AvatarUserProps = {
	user: UsersClanEntity;
};

const AvatarUser = ({ user }: AvatarUserProps) => {
	const userClan = useAppSelector(selectMemberClanByUserId(user?.id ?? ''));
	const userName = userClan?.user?.username;
	const avatar = getAvatarForPrioritize(userClan?.clan_avatar, userClan?.user?.avatar_url);
	return (
		<div className="w-6 h-6 rounded-full">
			<div className="w-6 h-6">
				{userClan ? (
					<AvatarImage alt={userName || ''} userName={userName} className="min-w-6 min-h-6 max-w-6 max-h-6" src={avatar} />
				) : (
					<Icons.AvatarUser />
				)}
			</div>
		</div>
	);
};

interface Users {
	name: string;
	icon: React.ReactNode;
	userId: string;
}

type SearchMemberAuditLogProps = {
	currentClanId: string;
	actionFilter: string;
	userFilter?: IUserAuditLog | null;
	closeModal: () => void;
};

const SearchMemberAuditLogModal = ({ currentClanId, actionFilter, userFilter, closeModal }: SearchMemberAuditLogProps) => {
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUser, setSelectedUser] = useState<string>(userFilter?.userId || '');
	const usersClan = useSelector(selectAllUserClans);

	const users: Users[] = [
		{ name: 'All Users', icon: <Icons.MemberList isWhite={true} />, userId: '' },
		...usersClan.map((item: any) => ({
			name: item?.user?.display_name,
			icon: <AvatarUser user={item} />,
			userId: item?.user?.id
		}))
	];

	const handleMemberClick = (user: Users) => {
		setSelectedUser(user?.userId);
		dispatch(
			auditLogFilterActions.setUser({
				userId: user.userId || '',
				userName: user.name || ''
			})
		);

		if (currentClanId) {
			const body = {
				actionLog: actionFilter ? actionFilter : '',
				userId: user?.userId ?? '',
				clanId: currentClanId ?? '',
				page: 1,
				pageSize: 10000
			};
			const response = dispatch(auditLogList(body) as any);
		}
		closeModal();
	};

	return (
		<div className="absolute border left-0 top-8 pb-3 rounded border-solid dark:border-borderDividerLight dark:bg-bgPrimary bg-bgLightPrimary z-[9999] shadow w-72">
			<div className="dark:bg-bgPrimary bg-bgLightPrimary rounded-lg w-full max-w-xs">
				<div className="relative m-2">
					<input
						type="text"
						placeholder="Search Members"
						className="w-full p-2 pr-10 bg-gray-700 text-white rounded focus:outline-none"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<span className="absolute right-3 top-3 text-gray-400">
						<Icons.Search className="w-4 h-4 dark:text-white text-colorTextLightMode" />
					</span>
				</div>

				<div className="h-64 ml-2 pr-1 overflow-auto thread-scroll">
					{users
						.filter((user) => user?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
						.map((user, index) => (
							<div
								key={index}
								className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
									selectedUser === user?.userId ? 'bg-gray-600' : 'hover:bg-gray-700'
								}`}
								onClick={() => handleMemberClick(user)}
							>
								<span className={`p-2 rounded`}>{user?.icon}</span>
								<span className="ml-3 text-white">{user?.name}</span>
								{selectedUser === user?.userId && (
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

export default SearchMemberAuditLogModal;
