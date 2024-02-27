import { useSelector } from "react-redux";
import SettingListRole from "./SettingListRole";
import SettingValueDisplayRole from "./SettingOptionRole";
import { getSelectedRoleId } from "@mezon/store";
import { useState } from "react";
type EditNewRole = {
	flagOption: boolean;
	handleClose: () => void;
};
// import SettingRightUser from '../SettingRightUserProfile';
const ServerSettingRoleManagement = (props: EditNewRole) => {
	return (
        <>
        {props.flagOption?(
            <div className="flex flex-row flex-1 shrink min-w-0 bg-bgSecondary pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
                <SettingListRole handleClose={props.handleClose}/>
                <div className="border-l border-gray-400"></div>
                <div className=" w-2/3">
                    <div className="font-semibold ml-[15px]">
                        <div className="">
                            EDIT ROLE - NEW ROLE
                        </div>
                        <SettingValueDisplayRole />
                    </div>
                </div>
            </div>
        ):null}
        </>
	);
};

export default ServerSettingRoleManagement;
