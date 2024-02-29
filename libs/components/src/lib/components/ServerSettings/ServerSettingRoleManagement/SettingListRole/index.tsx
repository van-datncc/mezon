import { useClans, useRoles } from "@mezon/core";
import { getIsShow, getSelectedRoleId, rolesClanActions, setSelectedRoleId } from "@mezon/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
type closeEditRole = {
	handleClose: () => void;
};
// import SettingRightUser from '../SettingRightUserProfile';
const SettingListRole = (props: closeEditRole) => {
    const isChange = useSelector(getIsShow);
    
    const clickRole = useSelector(getSelectedRoleId);
    const [clickedRole, setClickedRole] = useState<null | string>(clickRole);
    const [nameRoleNew, setNameRoleNew] = useState("New role")
    
    const dispatch = useDispatch();
    const { RolesClan,  createRole} = useRoles();
    const { currentClan } = useClans();
    const handleRoleClick = (roleId:string) => {
        if (!isChange) {
            setClickedRole(roleId);
            dispatch(setSelectedRoleId(roleId));
        }
    };
    const activeRoles = RolesClan.filter(role => role.active === 1);
	return (
        <div className="w-1/3 pr-[10px]">
                <div className="flex justify-between font-semibold">
                    <div className=""
                        onClick={() => props.handleClose()}
                    >
                        BACK
                    </div>
                </div>
                <br />
                <div className="overflow-auto h-full">
                    {
                        clickedRole === '' ? (
                            <div className="mb-2">
                                <button
                                    // onClick={() => handleRoleClick(role.id)}
                                    className={`block w-full py-1 px-4 rounded ${
                                        clickedRole === '' ? 'bg-blue-700 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-700'
                                    } text-white font-bold`}
                                >
                                    {nameRoleNew}
                                </button>
                            </div>
                        ) : (
                            activeRoles.map((role) => (
                                <div key={role.id} className="mb-2">
                                    <button
                                        onClick={() => handleRoleClick(role.id)}
                                        className={`block w-full py-1 px-4 rounded ${
                                            clickedRole === role.id ? 'bg-blue-700 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-700'
                                        } text-white font-bold`}
                                    >
                                        {role.title}
                                    </button>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
	);
};

export default SettingListRole;