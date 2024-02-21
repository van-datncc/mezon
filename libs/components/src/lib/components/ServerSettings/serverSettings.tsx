import { ExitSetting, SettingRightProfile } from '@mezon/components';
import  ServerSettingItems  from './ServerSettingItems'
import  ServerSettingMainRoles  from './ServerSettingMainRoles'
import { useState } from 'react';

export type ModalSettingProps = {
	open: boolean;
	onClose: () => void;
};

const ServerSetting = (props: ModalSettingProps) => {
	const { open, onClose } = props;
	const [currentSetting, setCurrentSetting] = useState<string>('Roles');
	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
	};

	return (
		<div>
			{open ? (
				<div className="  flex fixed inset-0  w-screen z-10">
					<div className="flex text-gray- w-screen">
						<ServerSettingItems onItemClick={handleSettingItemClick} />
						{/* {currentSetting === 'Account' && <SettingAccount />} */}
						{currentSetting === 'Roles' && <ServerSettingMainRoles />}
						<ExitSetting onClose={onClose} />
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ServerSetting;
