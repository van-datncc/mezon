
// import SettingRightClan from '../SettingRightClanProfile';

import { useRoles } from "@mezon/core";
import { InputField } from "@mezon/ui";

// import SettingRightUser from '../SettingRightUserProfile';
const ServerSettingMainRoles = () => {
    const { RolesClan } = useRoles();
    
    
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
                                <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-gray-200 uppercase tracking-wider"></th>
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
                                        <td className="px-6 py-4 whitespace-nowrap"><p>{role.title}</p></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><p></p></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><p></p></td>
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
