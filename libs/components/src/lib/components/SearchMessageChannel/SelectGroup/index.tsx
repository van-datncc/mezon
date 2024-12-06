import { Icons } from '@mezon/ui';
import Tippy from '@tippy.js/react';

type SelectGroupProps = {
	groupName?: string;
	children?: React.ReactNode;
};

const SelectGroup = ({ groupName, children }: SelectGroupProps) => {
	return (
		<div className="first:mt-0 mt-3 mx-3 border-b border-borderDivider last:border-b-0 last:bottom-b-0 pb-3 last:pb-0">
			<div className="flex items-center justify-between pb-2">
				<h3 className="px-2 text-xs font-bold text-textPrimaryLight dark:text-textPrimary uppercase">{groupName}</h3>
				<div className="relative">
					<Tippy className={'w-[95px]'} content="Learn More" placement="left" arrow={false}>
						<button>
							<Icons.Help defaultSize="w-4 h-4" />
						</button>
					</Tippy>
				</div>
			</div>
			{children}
		</div>
	);
};

export default SelectGroup;
