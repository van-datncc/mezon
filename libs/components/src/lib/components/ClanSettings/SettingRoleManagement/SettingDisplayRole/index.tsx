import { RolesClanEntity, getNewNameRole, getNewSelectedPermissions, getSelectedRoleId, setNameRoleNew, toggleIsShowFalse, toggleIsShowTrue } from '@mezon/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export type ModalSettingSave = {
	flagOption: boolean;
	handleClose: () => void;
	handleSaveClose: () => void;
	handleUpdateUser: () => void;
};

const SettingDisplayRole = ({RolesClan}:{RolesClan: RolesClanEntity[]}) => {
	const nameRole = useSelector(getNewNameRole);
	const selectedPermissions = useSelector(getNewSelectedPermissions);
	const clickRole = useSelector(getSelectedRoleId);

	const activeRole = RolesClan.find((role) => role.id === clickRole);
	const permissionsRole = activeRole?.permission_list;
	const permissions = permissionsRole?.permissions?.filter((permission) => permission.active === 1) || [];
	const permissionIds = permissions.map((permission) => permission.id) || [];

	const dispatch = useDispatch();

	const handleDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setNameRoleNew(event.target.value));
	};

	useEffect(() => {
		const isSamePermissions =
			selectedPermissions.length === permissionIds.length && selectedPermissions.every((id) => permissionIds.includes(id));

		if (nameRole !== activeRole?.title || !isSamePermissions) {
			dispatch(toggleIsShowTrue());
		} else {
			dispatch(toggleIsShowFalse());
		}
	}, [nameRole, selectedPermissions, activeRole, permissionIds, dispatch]);

	return (
		<div className="w-full flex flex-col text-[15px]">
			<div className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">Role name<b className='text-red-600'>*</b></div>
			<input
				className="dark:bg-bgTertiary bg-bgLightModeThird text-[15px] w-full p-[7px] font-normal border dark:border-bgTertiary border-bgLightModeThird rounded outline-none"
				type="text"
				value={nameRole}
				onChange={handleDisplayName}
			/>
		</div>
	);
};

export default SettingDisplayRole;
