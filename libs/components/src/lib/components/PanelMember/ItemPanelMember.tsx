import { Icons } from '@mezon/ui';
import { Checkbox, Radio } from 'flowbite-react';

type ItemPanelMemberProps = {
	children: string;
	dropdown?: boolean;
	type?: 'radio' | 'checkbox' | 'none';
	danger?: boolean;
	onClick?: (e: any) => void;
};

const ItemPanelMember = ({ children, dropdown, type, danger, onClick }: ItemPanelMemberProps) => {
	return (
		<button
			onClick={onClick}
			className={`flex items-center w-full justify-between rounded-sm  pr-2 ${danger ? 'hover:bg-[#E13542]' : 'hover:bg-bgSelectItem'}`}
		>
			<li
				className={`text-[14px] ${danger ? 'text-colorDanger hover:text-white' : ''} font-medium w-full py-[6px] px-[8px] text-left cursor-pointer list-none`}
			>
				{children}
			</li>
			{dropdown && <Icons.RightIcon defaultFill="#fff" />}
			{type === 'checkbox' && <Checkbox id="accept" defaultChecked />}
			{type === 'radio' && <Radio className="" value="change here" />}
		</button>
	);
};

export default ItemPanelMember;
