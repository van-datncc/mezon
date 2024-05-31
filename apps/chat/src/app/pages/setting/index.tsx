import { ExitSetting, Icons, SettingAccount, SettingAppearance, SettingItem, SettingRightProfile } from '@mezon/components';
import { useState } from 'react';

export type ModalSettingProps = {
	open: boolean;
	onClose: () => void;
};

const Setting = (props: ModalSettingProps) => {
	const { open, onClose } = props;
	const [currentSetting, setCurrentSetting] = useState<string>('Account');
	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
	};
	const [menuIsOpen, setMenuIsOpen] = useState<boolean>(true);
	const handleMenuBtn = () => {
		setMenuIsOpen(!menuIsOpen);
	};
	return (
		<div>
			{open ? (
				<div className=" z-10 flex fixed inset-0  w-screen">
					<div className="flex text-gray- w-screen relative">
						<div className={`${!menuIsOpen ? 'hidden' : 'flex'} text-gray- w-1/6 xl:w-1/4 min-w-56 relative`}>
							<SettingItem onItemClick={handleSettingItemClick} initSetting={currentSetting} />
						</div>
						{currentSetting === 'Account' && <SettingAccount menuIsOpen={menuIsOpen} onSettingProfile={handleSettingItemClick} />}
						{currentSetting === 'Profiles' && <SettingRightProfile menuIsOpen={menuIsOpen} />}
						{currentSetting === 'Appearance' && <SettingAppearance menuIsOpen={menuIsOpen} />}
						<ExitSetting onClose={onClose} />

						<div
							className={`flex sbm:hidden absolute left-4 top-4 rounded-sm text-center dark:bg-[#AEAEAE] hover:text-slate-400 bg-gray-500`}
							onClick={handleMenuBtn}
						>
							<Icons.ArrowDownFill className={`dark:text-bgSecondary text-white w-[30px] h-[30px] transition duration-300 ease-in-out ${menuIsOpen ? 'rotate-90' : '-rotate-90'}`} />
						</div>

						<div className="flex sbm:hidden absolute right-4 top-4" onClick={() => onClose()}>
							<Icons.CloseIcon className="dark:text-[#AEAEAE] text-gray-500 w-[30px] h-[30px] hover:text-slate-400" />
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Setting;
