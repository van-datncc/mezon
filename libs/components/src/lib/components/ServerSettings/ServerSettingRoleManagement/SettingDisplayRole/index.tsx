import { useRoles } from "@mezon/core";
import { getNewNameRole, getNewSelectedPermissions, getSelectedRoleId, setNameRoleNew, toggleIsShowFalse, toggleIsShowTrue } from "@mezon/store";
import { useDispatch, useSelector } from "react-redux";

export type ModalSettingSave = {
    flagOption: boolean;
    handleClose: () => void;
	handlSaveClose: () => void;
	handleUpdateUser: () => void;
};
// import SettingRightUser from '../SettingRightUserProfile';
const SettingDisplayRole = () => {
    const { RolesClan } = useRoles();
    const clickRole = useSelector(getSelectedRoleId);
    const nameRole = useSelector(getNewNameRole);
    const selectedPermissions = useSelector(getNewSelectedPermissions)

    const activeRole = RolesClan.find(role => role.id === clickRole);
    const permissionsRole = activeRole?.permission_list;
    const permissions = permissionsRole?.permissions?.filter(permission => permission.active === 1) || [];
    const permissionIds = permissions.map(permission => permission.id) || [];

    const dispatch = useDispatch();

    const handleDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNameRoleNew(event.target.value))
    };

    const isSamePermissions = selectedPermissions.length === permissionIds.length 
                && selectedPermissions.every(id => permissionIds.includes(id));
    if (nameRole !== activeRole?.title || !isSamePermissions) {
        dispatch(toggleIsShowTrue());
    }else{
        dispatch(toggleIsShowFalse());
    }

	return (
            <div className="w-full pr-[10px]">
                <div>
                    Role name
                </div>
                <br />
                <input 
                    className="bg-black w-full p-[7px] border-2 rounded-lg "
                    type="text" 
                    value={nameRole} 
                    onChange={handleDisplayName}
                />
            </div>
	);
};

export default SettingDisplayRole;