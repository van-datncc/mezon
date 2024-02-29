import { useDispatch, useSelector } from "react-redux";
import SettingListRole from "./SettingListRole";
import SettingValueDisplayRole from "./SettingOptionRole";
import { getIsShow, getNewAddMembers, getNewAddPermissions, getNewNameRole, getRemovePermissions, getSelectedRoleId } from "@mezon/store";
import { useState } from "react";
import SettingUserClanProfileSave from "../../SettingProfile/SettingRightClanProfile/settingUserClanProfileSave";
import { useClans, useRoles } from "@mezon/core";
type EditNewRole = {
	flagOption: boolean;
	handleClose: () => void;
};
export type ModalSettingSave = {
    flagOption: boolean;
    handleClose: () => void;
	handlSaveClose: () => void;
	handleUpdateUser: () => void;
};
// import SettingRightUser from '../SettingRightUserProfile';
const ServerSettingRoleManagement = (props: EditNewRole) => {
    const { createRole ,updateRole} = useRoles();
    const clickRole = useSelector(getSelectedRoleId);
    const namRole = useSelector(getNewNameRole);
    const addPermissions = useSelector(getNewAddPermissions);
    const removePermissions = useSelector(getRemovePermissions);
    const users = useSelector(getNewAddMembers);
    
    const dispatch = useDispatch();
    const { currentClan } = useClans();
    const isChange = useSelector(getIsShow);
    console.log("isChange: ", isChange);
    
    
    const handleClose = () =>{
        // setRoleName(activeRole?.title || '');
        // SetFlagOption(false)
        // dispatch(toggleIsShowFalse());
    }
    const handlSaveClose = () =>{
        // SetFlagOption(false)
        // dispatch(toggleIsShowFalse());
    }
    const handleUpdateUser = async () =>{
        if (clickRole==='') {
            props.handleClose()
            await createRole(currentClan?.id||'', currentClan?.id||'',namRole,users,addPermissions);
        }else{
            await updateRole(currentClan?.id ?? '',clickRole,namRole,[],addPermissions,[],removePermissions);
        }
        
    }
    const saveProfile: ModalSettingSave = {
		flagOption:isChange,
        handleClose,
		handlSaveClose,
		handleUpdateUser,
	};
	return (
        <>
        {props.flagOption?(
            <div className="flex flex-row flex-1 shrink min-w-0 bg-bgSecondary pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
                <SettingListRole handleClose={props.handleClose}/>
                <div className="border-l border-gray-400"></div>
                <div className=" w-2/3">
                    <div className="font-semibold ml-[15px]">
                        {clickRole === '' ? (
                            <div className="">
                                NEW ROLE
                            </div>
                        ):(
                            <div className="">
                                EDIT ROLE
                            </div>
                        )}
                        <SettingValueDisplayRole />
                    </div>
                </div>
                <SettingUserClanProfileSave PropsSave={saveProfile}/>
            </div>
        ):null}
        </>
	);
};

export default ServerSettingRoleManagement;
