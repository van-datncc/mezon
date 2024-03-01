import { useClans, useRoles, useUserPolicy } from "@mezon/core";
import { getNewAddPermissions, getNewNameRole, getNewSelectedPermissions, getSelectedRoleId, setAddPermissions, setRemovePermissions, setSelectedPermissions, toggleIsShowFalse, toggleIsShowTrue } from "@mezon/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SettingUserClanProfileSave from "../../../SettingProfile/SettingRightClanProfile/settingUserClanProfileSave";

export type ModalSettingSave = {
    flagOption: boolean;
    handleClose: () => void;
	handlSaveClose: () => void;
	handleUpdateUser: () => void;
};
const SettingPermissions = () => {
    const dispatch = useDispatch();
    const { RolesClan } = useRoles();
    const addPermissions = useSelector(getNewAddPermissions);
    const { currentClan } = useClans();
    const { permissionsDefault } = useUserPolicy(currentClan?.id||'');
    const clickRole = useSelector(getSelectedRoleId);
    const [searchTerm, setSearchTerm] = useState('');
    const selectedPermissions = useSelector(getNewSelectedPermissions)
    const nameRole = useSelector(getNewNameRole);
    
    const [selectPermissions, setSelectPermissions] = useState<string[]>([]);
    const activeRole = RolesClan.find(role => role.id === clickRole);
    const permissionsRole = activeRole?.permission_list;
    const permissions = permissionsRole?.permissions?.filter(permission => permission.active === 1) || [];
    const permissionIds = permissions.map(permission => permission.id) || [];
    
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        if (clickRole !== "New Role") {
            setSelectPermissions(permissionIds as string[]);
        }else{
            setSelectPermissions(addPermissions as string[]);
        }
    }, [clickRole]);
    
    useEffect(() => {
        const results = permissionsDefault.filter(permission =>
            permission.slug?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, permissionsDefault]);

    const handlePermissionToggle = (permissionId: string) => {
        setSelectPermissions(prevPermissions => {
            const newPermissions = prevPermissions.includes(permissionId) 
                ? prevPermissions.filter(id => id !== permissionId)
                : [...prevPermissions, permissionId];
            dispatch(setSelectedPermissions(newPermissions));
    
            const newActivePermissionIds = newPermissions.filter(permissionId => !permissionIds.includes(permissionId));
            const newRemovePermissionIds = permissionIds.filter(id => id !== undefined && !newPermissions.includes(id));
            dispatch(setAddPermissions(newActivePermissionIds));
            dispatch(setRemovePermissions(newRemovePermissionIds));
            
            return newPermissions;
        });
    };
    
    const isSamePermissions = selectedPermissions.length === permissionIds.length 
                && selectedPermissions.every(id => permissionIds.includes(id));
    if (nameRole !== activeRole?.title || !isSamePermissions) {
        dispatch(toggleIsShowTrue());
    }else{
        dispatch(toggleIsShowFalse());
    }

    return (
        <>
            <div className="w-full pr-[10px] flex">
                <input 
                    className="flex-grow bg-black p-[7px] border-2 rounded-lg mr-[10px]"
                    type="text" 
                    placeholder="Search Permissions"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <br />
            <div>
                <ul>
                    {searchResults.map(permission => (
                        <li key={permission.id} className="flex items-center justify-between pb-[5px]">
                            <span className="mr-auto">{permission.slug}</span>
                            <label className="ml-auto">
                                <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(permission.id)}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                />
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default SettingPermissions;
