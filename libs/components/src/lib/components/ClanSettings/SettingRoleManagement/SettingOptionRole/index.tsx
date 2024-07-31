import { RolesClanEntity, getSelectedRoleId, toggleIsShowFalse } from '@mezon/store';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SettingDisplayRole from '../SettingDisplayRole';
import SettingManageMembers from '../SettingManageMembers';
import SettingPermissions from '../SettingPermissions';
import { TabsSelectRole } from './tabSelectRole';

const SettingValueDisplayRole = ({ RolesClan, isCreateNewRole }: { RolesClan: RolesClanEntity[], isCreateNewRole: boolean }) => {
	const [selectedButton, setSelectedButton] = useState<string | null>('Display');
	const clickRole = useSelector(getSelectedRoleId);
	const activeRole = useMemo(() => RolesClan.find((role) => role.id === clickRole), [RolesClan, clickRole]);
	const dispatch = useDispatch();
	const handleButtonClick = (buttonName: string) => {
		setSelectedButton(buttonName);
	};

	const renderContent = useCallback(() => {
		switch (selectedButton) {
			case TabsSelectRole.Tab_Display:
				return <SettingDisplayRole RolesClan={RolesClan} isCreateNewRole={isCreateNewRole} />;
			case TabsSelectRole.Tab_Permissions:
				return <SettingPermissions RolesClan={RolesClan} isCreateNewRole={isCreateNewRole} />;
			case TabsSelectRole.Tab_Manage_Members:
				return <SettingManageMembers RolesClan={RolesClan} isCreateNewRole={isCreateNewRole} />;
			default:
				return null;
		}
	  }, [selectedButton, RolesClan, isCreateNewRole]);

	const roleUsersCount = activeRole?.role_user_list?.role_users?.length || 0;
	return (
		<>
			<div className="w-full flex justify-between mb-5 border-b border-gray-200 dark:border-gray-500">
				<button
					className="py-[5px] dark:text-white text-black text-[15px] text-left transition duration-300 rounded relative tracking-wider font-medium group"
					onClick={() => {
						handleButtonClick('Display');
						dispatch(toggleIsShowFalse());
					}}
				>
					Display
					<div
						className={`absolute inset-x-0 bottom-0 h-[2px] group-hover:bg-blue-300 ${selectedButton === 'Display' ? 'bg-blue-400' : ''}`}
					/>
				</button>

				<button
					className="py-[5px] dark:text-white text-black text-[15px] text-left transition duration-300 rounded relative tracking-wider font-medium group"
					onClick={() => {
						handleButtonClick('Permissions');
						dispatch(toggleIsShowFalse());
					}}
				>
					Permissions
					<div
						className={`absolute inset-x-0 bottom-0 h-[2px] group-hover:bg-blue-300 ${selectedButton === 'Permissions' ? 'bg-blue-400' : ''}`}
					/>
				</button>
				<button
					className="py-[5px] dark:text-white text-black text-[15px] text-left transition duration-300 rounded relative tracking-wider font-medium group"
					onClick={() => {
						handleButtonClick('Manage Members');
						dispatch(toggleIsShowFalse());
					}}
				>
					Manage Members ({roleUsersCount > 0 ? roleUsersCount : 0})
					<div
						className={`absolute inset-x-0 bottom-0 h-[2px] group-hover:bg-blue-300 ${selectedButton === 'Manage Members' ? 'bg-blue-400' : ''}`}
					/>
				</button>
			</div>
			{renderContent()}
		</>
	);
};

export default SettingValueDisplayRole;
