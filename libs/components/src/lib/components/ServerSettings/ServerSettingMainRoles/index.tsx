
// import SettingRightClan from '../SettingRightClanProfile';

import { useClans, useRoles } from "@mezon/core";
import { InputField } from "@mezon/ui";
import { DeleteModal } from "../DeleteRoleModal/deleteRoleModal";
import { useState } from "react";
import { rolesClanActions, setAddMemberRoles, setAddPermissions, setNameRoleNew, setRemoveMemberRoles, setRemovePermissions, setSelectedPermissions, setSelectedRoleId, useAppDispatch } from "@mezon/store";
import { useDispatch } from "react-redux";

export type ModalOpenEdit = {
	handleOpen: () => void;
};
// import SettingRightUser from '../SettingRightUserProfile';
const ServerSettingMainRoles = (props: ModalOpenEdit) => {
    const { RolesClan} = useRoles();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedRoleId, setSelectedRoleID] = useState<string>('');
    const dispatchRole = useDispatch();
    const dispatch = useAppDispatch();
    const activeRoles = RolesClan.filter(role => role.active === 1);
    const handleOpenModalDelete = () => {
		setShowModal(true);
	};
    const handleCloseModal = () => {
        setShowModal(false);
	};
    const handleRoleClick = (roleId:string) => {
        setSelectedRoleID(roleId);
        const activeRole = RolesClan.find(role => role.id === roleId);
        const permissions = activeRole?.permission_list?.permissions;
        const permissionIds = permissions
        ? permissions.filter(permission => permission.active === 1).map(permission => permission.id) : [];
        const memberIDRoles = activeRole?.role_user_list?.role_users?.map(member => member.id) || [];
        dispatchRole(setNameRoleNew(activeRole?.title));
        dispatchRole(setSelectedRoleId(roleId));
        dispatchRole(setSelectedPermissions(permissionIds));
        dispatchRole(setAddPermissions([]));
        dispatchRole(setRemovePermissions([]));
        dispatchRole(setAddMemberRoles(memberIDRoles));
        dispatchRole(setRemoveMemberRoles([]));
    };
    const handleDeleteRole = async (roleId: string) => {
        await dispatch(rolesClanActions.fetchDeleteRole({ roleId }));
      };
	return (
		<>
                <h1 className="text-2xl font-bold mb-4">Roles</h1>
                <div className="flex items-center space-x-4"> 
                    <div className="w-full flex-grow">
                        <InputField
                            type="text"
                            className="rounded-[3px] w-full text-white border border-black px-4 py-2 focus:outline-none focus:border-white-500 bg-black"
                            placeholder="Search Roles"
                        />
                    </div>
                        <button className="bg-blue-600 rounded-[3px] p-[8px] pr-[10px] pl-[10px] text-nowrap"
                        onClick={() => {dispatch(setSelectedRoleId("New Role"));
                                        dispatch(setNameRoleNew("New Role"));
                                        dispatch(setAddPermissions([]));
                                        dispatch(setAddMemberRoles([]));
                                        props.handleOpen();
                                        }}
                        >Create Role</button>
                </div>
                <br />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-bgSecondary">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Roles - {RolesClan.length}</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Members</th>
                                <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-200 uppercase tracking-wider">Options</th>
                            </tr>
                        </thead>
                        <tbody className="bg-bgSecondary divide-y divide-gray-200">
                            {activeRoles.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                        <p>No Roles</p>
                                    </td>
                                </tr>
                            ) : (
                                activeRoles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><p
                                        onClick={() => {
                                            handleCloseModal();
                                        }}
                                        >{role.title}</p></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><p>{role.role_user_list?.role_users?.length ?? 0}</p></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex">
                                                <p className="mr-[15px]"
                                                    onClick={() => {
                                                        props.handleOpen();
                                                        handleRoleClick(role.id);
                                                    }}
                                                >
                                                    Edit
                                                </p>
                                                <p
                                                    onClick={() => {
                                                        handleOpenModalDelete();
                                                        handleRoleClick(role.id);
                                                    }}
                                                >
                                                    Delete
                                                </p>
                                            </div>
                                            <DeleteModal isOpen={showModal} handleDelete={() => handleDeleteRole(selectedRoleId)} onClose={handleCloseModal} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
		</>
	);
};

export default ServerSettingMainRoles;
