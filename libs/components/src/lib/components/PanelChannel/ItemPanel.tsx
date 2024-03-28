import { Checkbox, Radio } from 'flowbite-react';
import * as Icons from '../Icons';

type ItemPanelProps = {
	children: string;
	dropdown?: string;
	type?: 'radio' | 'checkbox' | 'none';
};

const ItemPanel = ({ children, dropdown, type }: ItemPanelProps) => {
	return (
		<div className="flex items-center justify-between rounded-sm hover:bg-[#3C45A5] hover:[&>*]:text-[#fff] pr-2">
			<li className="text-[14px] text-[#B5BAC1] w-full py-[6px] px-[8px] cursor-pointer list-none ">{children}</li>
			{dropdown && <Icons.RightIcon defaultFill="#fff" />}
			{type === 'checkbox' && <Checkbox id="accept" defaultChecked />}
			{type === 'radio' && <Radio className="" value="change here" />}
		</div>
	);
};

export default ItemPanel;
