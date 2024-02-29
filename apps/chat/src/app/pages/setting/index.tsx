import { ExitSetting, SettingAccount, SettingItem, SettingRightProfile } from '@mezon/components';
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

	return (
		<div>
			{open ? (
				<div className="  flex fixed inset-0  w-screen">
					<div className="flex text-gray- w-screen relative">
						<SettingItem onItemClick={handleSettingItemClick} />
						{currentSetting === 'Account' && <SettingAccount />}
						{currentSetting === 'Profiles' && <SettingRightProfile />}
						<ExitSetting onClose={onClose} />
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Setting;
