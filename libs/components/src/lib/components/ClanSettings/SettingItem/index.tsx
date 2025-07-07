import { selectCloseMenu, selectCurrentClan } from '@mezon/store';
import { useSelector } from 'react-redux';
import { ItemObjProps } from '../ItemObj';

type SettingItemProps = {
	name: string;
	active?: boolean;
	onClick: () => void;
	handleMenu: (value: boolean) => void;
	setting?: ItemObjProps;
};

const SettingItem = ({ name, active, onClick, handleMenu, setting }: SettingItemProps) => {
	const currentClan = useSelector(selectCurrentClan);

	const closeMenu = useSelector(selectCloseMenu);
	return (
		<button
			className={`relative  w-full py-1 px-[10px] mb-1 text-[16px] font-medium rounded text-left ${active ? 'bg-item-theme text-theme-primary-active ' : ''} bg-item-hover`}
			onClick={() => {
				onClick();
				if (closeMenu) {
					handleMenu(false);
				}
			}}
		>
			{setting?.id === 'on-boarding' && <div className="absolute top-[4px] right-[8px] ">{currentClan?.is_onboarding ? 'ON' : 'OFF'}</div>}
			{name}
		</button>
	);
};

export default SettingItem;
