type TableMemberItemProps = {
	name: string;
	avatar: string;
	roleId?: string;
	clanJoinTime?: string;
	discordJoinTime?: string;
};

const TableMemberItem = ({ name, roleId, avatar, clanJoinTime, discordJoinTime }: TableMemberItemProps) => {
	return (
		<div className="flex flex-row justify-between items-center h-[48px] border-b-[1px] border-borderDivider last:border-b-0">
			<div className="flex-3 p-1">
				<div className="flex flex-row gap-2">
					<img src={avatar} alt={name} className="w-[36px] h-[36px] min-w-[36px] rounded-full object-cover" />
					<div className="flex flex-col">
						<p className="text-base font-medium">{name}</p>
						<p className="text-[11px] text-contentSecondary">{name}</p>
					</div>
				</div>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs text-textPrimary font-bold uppercase">{clanJoinTime ?? '-'}</span>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs text-textPrimary font-bold uppercase">{discordJoinTime ?? '-'}</span>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs text-textPrimary font-bold uppercase">{roleId ?? '-'}</span>
			</div>
			<div className="flex-3 p-1 text-center">
				<span className="text-xs text-textPrimary font-bold uppercase">Signals</span>
			</div>
		</div>
	);
};

export default TableMemberItem;
