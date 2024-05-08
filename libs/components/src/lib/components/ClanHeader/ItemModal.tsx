import { Icons } from '@mezon/components';
import { Checkbox, Radio } from 'flowbite-react';
import { ReactNode } from 'react';

type ItemModalProps = {
	children: string;
	dropdown?: string;
	type?: 'radio' | 'checkbox' | 'none';
	endIcon?: ReactNode;
	onClick?: () => void;
};

const ItemModal = ({ children, dropdown, type, endIcon, onClick }: ItemModalProps) => {
	return (
		<button onClick={onClick} className="flex items-center w-full justify-between rounded-sm hover:bg-bgSelectItem hover:[&>*]:text-[#fff] pr-2">
			<li className="text-[14px] text-[#B5BAC1] font-medium w-full py-[6px] px-[8px] text-left cursor-pointer list-none ">{children}</li>
			{dropdown && <Icons.RightIcon defaultFill="#fff" />}
			{type === 'checkbox' && <Checkbox id="accept" defaultChecked />}
			{type === 'radio' && <Radio className="" value="change here" />}
			{endIcon && <div className="flex items-center justify-center h-[18px] w-[18px]">{endIcon}</div>}
		</button>
	);
};

export default ItemModal;
