import { Icons } from '@mezon/components';

type SelectItemProps = {
	title?: string;
	content?: string;
	onClick?: () => void;
};

const SelectItemUser = ({ title, content, onClick }: SelectItemProps) => {
	return (
		<button
			onClick={onClick}
			className="flex flex-row justify-between items-center group w-full cursor-pointer rounded border border-red-400 p-2"
		>
			<div>
				<span className="text-textPrimaryLight dark:text-textPrimary font-semibold">{title}</span>
				<span className="text-textSecondary400 dark:text-textPrimary">{content}</span>
			</div>
			<div className="group-hover:opacity-100 opacity-0">
				<Icons.Plus />
			</div>
		</button>
	);
};

export default SelectItemUser;
