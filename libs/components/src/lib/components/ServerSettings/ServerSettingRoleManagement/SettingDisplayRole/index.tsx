import { useClans, useRoles } from "@mezon/core";
import { getIsShow, getSelectedRoleId, toggleIsShowFalse, toggleIsShowTrue } from "@mezon/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SettingUserClanProfileSave from "../../../SettingProfile/SettingRightClanProfile/settingUserClanProfileSave";

export type ModalSettingSave = {
    flagOption: boolean;
    handleClose: () => void;
	handlSaveClose: () => void;
	handleUpdateUser: () => void;
};
// import SettingRightUser from '../SettingRightUserProfile';
const SettingDisplayRole = () => {
    const { RolesClan, updateRole } = useRoles();
    const clickRole = useSelector(getSelectedRoleId);
    const [roleName, setRoleName] = useState('');
    const activeRole = RolesClan.find(role => role.id === clickRole);
    const [flagOption, SetFlagOption] = useState<boolean>(false);
    const dispatch = useDispatch();
    
    const { currentClan } = useClans();
    useEffect(() => {
            setRoleName(activeRole?.title || '');
    }, [activeRole, clickRole]);
    const handleDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleName(event.target.value);
        if (event.target.value !== activeRole?.title) {
            SetFlagOption(true)
            dispatch(toggleIsShowTrue());
		} else {
            SetFlagOption(false)
            dispatch(toggleIsShowFalse());
		}
    };
    
    const handleClose = () =>{
        setRoleName(activeRole?.title || '');
        SetFlagOption(false)
        dispatch(toggleIsShowFalse());
    }
    const handlSaveClose = () =>{
        SetFlagOption(false)
        dispatch(toggleIsShowFalse());
    }
    const handleUpdateUser = async () =>{
        await updateRole(currentClan?.id ?? '',clickRole,roleName,[],[],[],[]);
    }
    const saveProfile: ModalSettingSave = {
		flagOption:flagOption,
        handleClose,
		handlSaveClose,
		handleUpdateUser,
	};
	return (
        <>
            <div className="w-full pr-[10px]">
                <div>
                    Role name
                </div>
                <br />
                <input 
                    className="bg-black w-full p-[7px] border-2 rounded-lg "
                    type="text" 
                    value={roleName} 
                    onChange={handleDisplayName}
                />
            </div>
            <SettingUserClanProfileSave PropsSave={saveProfile}/>
        </>

	);
};

export default SettingDisplayRole;