import { useClans } from '@mezon/core';
import TableMemberHeader from './TableMemberHeader';
import TableMemberItem from './TableMemberItem';

const TableMember = () => {
	const { usersClan } = useClans();
	return (
		<div className="flex flex-col flex-1 min-h-[48px]">
			<TableMemberHeader />
			<div className="flex flex-col overflow-y-auto px-4 py-2 shadow border-b-[1px] dark:border-bgTertiary">
				{usersClan.map((user) => (
					<TableMemberItem key={user.id} name={user.user?.username ?? ''} avatar={user.user?.avatar_url ?? ''} />
				))}
			</div>
		</div>
	);
};

export default TableMember;
