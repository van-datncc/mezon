import { useClans, useRoles, useUserPolicy } from "@mezon/core";
import { getSelectedRoleId, setAddPermissions, setRemovePermissions, toggleIsShowFalse, toggleIsShowTrue } from "@mezon/store";
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
    const { RolesClan, updateRole } = useRoles();
    const clickRole = useSelector(getSelectedRoleId);
    const activeRole = RolesClan.find(role => role.id === clickRole);
    const permissionsRole = activeRole?.permission_list;
    const permissions = permissionsRole?.permissions?.filter(permission => permission.active === 1) || [];
    const permissionIds = permissions.map(permission => permission.id) || [];
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(permissionIds as string[]);

    useEffect(() => {
        setSelectedPermissions(permissionIds as string[]);
    }, [clickRole]);
    const activePermissionIds = selectedPermissions.filter(permissionId => !permissionIds.includes(permissionId));
    const removePermissionIds: string[] = permissionIds
    .filter(permissionId => !selectedPermissions.includes(permissionId as string))
    .filter(id => id !== undefined) as string[];
    
    const { currentClan } = useClans();
    const { permissionsDefault } = useUserPolicy(currentClan?.id||'');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [flagOption, setFlagOption] = useState<boolean>(false);
    const dispatch = useDispatch();
    // dispatch(toggleIsShowFalse());
    // dispatch(setAddPermissions([]));
    // dispatch(setRemovePermissions([]));
    console.log("activePermissionIds: ", activePermissionIds);
    
    useEffect(() => {
        const results = permissionsDefault.filter(permission =>
            permission.slug?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, permissionsDefault]);
    
    // const handleClose = () =>{
    //     setSelectedPermissions(permissionIds as string[])
    //     setFlagOption(false)
    //     dispatch(toggleIsShowFalse());
    // }
    // const handlSaveClose = () =>{
    //     setFlagOption(false)
    //     dispatch(toggleIsShowFalse());
    // }
    // const handleUpdateUser = async () =>{
    //     await updateRole(currentClan?.id ?? '',clickRole,'',[],activePermissionIds,[],removePermissionIds);
    // }
    // const saveProfile: ModalSettingSave = {
	// 	flagOption:flagOption,
    //     handleClose,
	// 	handlSaveClose,
	// 	handleUpdateUser,
	// };

    const handlePermissionToggle = (permissionId: string) => {
        setSelectedPermissions(prevPermissions => {
            const newPermissions = prevPermissions.includes(permissionId) 
                ? prevPermissions.filter(id => id !== permissionId)
                : [...prevPermissions, permissionId];
            dispatch(setAddPermissions(newPermissions))
            const isSamePermissions = newPermissions.length === permissionIds.length 
                && newPermissions.every(id => permissionIds.includes(id));
            if (isSamePermissions){
                dispatch(toggleIsShowFalse());
                // setFlagOption(false)
            } else {
                // setFlagOption(true)
                dispatch(toggleIsShowTrue());
            }
            return newPermissions;
        });
        dispatch(setAddPermissions(activePermissionIds));
        dispatch(setRemovePermissions(removePermissionIds));
    };
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
            {/* <SettingUserClanProfileSave PropsSave={saveProfile}/> */}
        </>
    );
};

export default SettingPermissions;
