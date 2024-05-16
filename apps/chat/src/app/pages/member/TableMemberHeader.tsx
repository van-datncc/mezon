import { Icons } from '@mezon/components';

const TableMemberHeader = () => {
	return (
		<div className="flex flex-row justify-between items-center px-4 h-[48px] shadow border-b-[1px] border-bgTertiary">
			<div className="flex-3 p-1">
				<span className="text-xs text-textPrimary font-bold uppercase">Name</span>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs text-textPrimary font-bold uppercase">Member since</span>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs text-textPrimary font-bold uppercase">Joined discord</span>
			</div>
			<div className="flex-1 flex flex-row gap-1 p-1 justify-center cursor-pointer">
				<span className="text-xs text-textPrimary font-bold uppercase select-none">Roles</span>
				<Icons.FiltersIcon className="rotate-90" />
			</div>
			<div className="flex-3 flex flex-row gap-1 p-1 justify-center cursor-pointer">
				<span className="text-xs text-textPrimary font-bold uppercase select-none">Signals</span>
				<Icons.FiltersIcon className="rotate-90" />
			</div>
		</div>
	);
};

export default TableMemberHeader;
