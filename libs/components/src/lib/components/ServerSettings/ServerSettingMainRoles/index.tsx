
// import SettingRightClan from '../SettingRightClanProfile';

import { useClans, useRoles } from "@mezon/core";
import { InputField } from "@mezon/ui";
import { DeleteModal } from "../DeleteRoleModal/deleteRoleModal";
import { useState } from "react";
import { RolesClanActions, useAppDispatch } from "@mezon/store";

// import SettingRightUser from '../SettingRightUserProfile';
const ServerSettingMainRoles = () => {
    const { RolesClan } = useRoles();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const dispatch = useAppDispatch();
    const handleOpenModal = () => {
		setShowModal(true);
	};
    const handleCloseModal = () => {
        setShowModal(false);
	};
    const handleDeleteRole = async (roleId: string) => {
        await dispatch(RolesClanActions.fetchDeleteRole({ roleId }));
      };
      
	return (
		<>
			<div className="flex flex-col flex-1 shrink min-w-0 bg-bgSecondary pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
                <h1 className="text-2xl font-bold mb-4">Roles</h1>
                <div className="flex items-center space-x-4"> 
                    <div className="w-full flex-grow">
                        <InputField
                            type="text"
                            className="rounded-[3px] w-full text-white border border-black px-4 py-2 focus:outline-none focus:border-white-500 bg-black"
                            placeholder="Search Roles"
                        />
                    </div>
                        <button className="bg-blue-600 rounded-[3px] p-[8px] pr-[10px] pl-[10px] text-nowrap">Create Role</button>
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
                            {RolesClan.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                        <p>No Roles</p>
                                    </td>
                                </tr>
                            ) : (
                                RolesClan.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><p
                                        onClick={() => {
                                            handleCloseModal();
                                        }}
                                        >{role.title}</p></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><p>{role.role_user_list?.role_users?.length ?? 0}</p></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p
                                                onClick={() => {
                                                    handleOpenModal();
                                                    setSelectedRoleId(role.id)
                                                }}
                                            >
                                                delete
                                            </p>
                                            <DeleteModal isOpen={showModal} handleDelete={() => handleDeleteRole(selectedRoleId)} onClose={handleCloseModal} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
		</>
	);
};

export default ServerSettingMainRoles;
