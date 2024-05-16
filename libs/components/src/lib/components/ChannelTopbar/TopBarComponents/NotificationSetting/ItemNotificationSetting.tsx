import { Icons } from '@mezon/components';
import { Checkbox, Radio } from 'flowbite-react';

type ItemNotificationSettingProps = {
	children: string;
	dropdown?: string;
	type?: 'radio' | 'checkbox' | 'none';
	onClick?: () => void;
};

const ItemNotificationSetting = ({ children, dropdown, type, onClick }: ItemNotificationSettingProps) => {
	return (
		<div onClick={onClick} className="flex items-center justify-between rounded-sm hover:bg-bgSelectItem group pr-2">
			<li className="text-[14px] dark:text-[#B5BAC1] text-black group-hover:text-white w-full py-[6px] px-[8px] cursor-pointer list-none ">{children}</li>
			{dropdown && <Icons.RightIcon defaultFill="#fff" />}
			{type === 'checkbox' && <Checkbox id="accept" defaultChecked />}
			{type === 'radio' && <Radio className="" value="change here" />}
		</div>
	);
};

export default ItemNotificationSetting;
