import { ExitSetting, SettingRightProfile } from '@mezon/components';
import  ServerSettingItems  from './ServerSettingItems'
import  ServerSettingMainRoles  from './ServerSettingMainRoles'
import { useState } from 'react';
import ServerSettingRoleManagement from './ServerSettingRoleManagement';

export type ModalSettingProps = {
	open: boolean;
	onClose: () => void;
};

const ServerSetting = (props: ModalSettingProps) => {
	const { open, onClose } = props;
	const [currentSetting, setCurrentSetting] = useState<string>('Roles');
	const [openEdit, setOpenEdit] = useState<boolean>(false);
	const handleSettingItemClick = (settingName: string) => {
		setCurrentSetting(settingName);
	};
	const closeSettingEdit = () => {
		setOpenEdit(false)
	};

	const openSettingEdit = () => {
		setOpenEdit(true)
	};


	return (
		<div>
			{open ? (
				<div className="  flex fixed inset-0  w-screen z-10">
					<div className="flex text-gray- w-screen">
						<ServerSettingItems onItemClick={handleSettingItemClick} />

						{!openEdit?(
							<div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
								{currentSetting === 'Roles' && <ServerSettingMainRoles handleOpen={openSettingEdit}/>}
								{/* {currentSetting === 'Account' && <SettingAccount />} */}
							</div>
							):null}
							<ServerSettingRoleManagement flagOption ={openEdit} handleClose={closeSettingEdit} />
						<ExitSetting onClose={onClose} />
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ServerSetting;
