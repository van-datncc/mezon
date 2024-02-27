import { useCategory, useClans, useRoles } from "@mezon/core";
import { getSelectedRoleId, selectCurrentChannel, selectCurrentChannelId, selectMembersByChannelId } from "@mezon/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const AddMembersModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { RolesClan, updateRole } = useRoles();
    const clickRole = useSelector(getSelectedRoleId);
    const activeRole = RolesClan.find(role => role.id === clickRole);
    const memberRoles = activeRole?.role_user_list?.role_users;
    const [searchTerm, setSearchTerm] = useState('');
    const { currentClan } = useClans();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const { categorizedChannels } = useCategory();
    const channelsWithNullPrivate = categorizedChannels.map(category => ({
        ...category,
        channels: category.channels.filter(channel => channel.channel_private !== 1)
    }));
    const categoriesWithNonNullChannels = channelsWithNullPrivate.filter(category =>
        category.channels.length > 0
        );
        const idchannel = categoriesWithNonNullChannels.at(0)?.channels.at(0)?.channel_id;
        const rawMembers = useSelector(selectMembersByChannelId(idchannel));
        const membersNotInRoles = rawMembers.filter(member => {
            return !memberRoles || !memberRoles.some(roleMember => roleMember.id === member.id);
        });
        const [searchResults, setSearchResults] = useState<any[]>(membersNotInRoles);
    const handleUserToggle = (permissionId: string) => {
        setSelectedUsers(prevPermissions => {
            if (prevPermissions.includes(permissionId)) {
                return prevPermissions.filter(id => id !== permissionId);
            } else {
                return [...prevPermissions, permissionId];
            }
        });
    };
    
    useEffect(() => {
        const results = membersNotInRoles.filter(member =>
            member.user?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [ searchTerm]);

    const handleUpdateRole = async () =>{
        await updateRole(currentClan?.id ?? '',clickRole,'',selectedUsers,[],[],[]);
    }
	return (
		<>
			{isOpen && (

                    <div className="fixed  inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="relative z-10 dark:bg-gray-900  bg-bgDisable p-6 rounded-[5px] text-center h-[400px]">
                            <h2 className="text-[30px] font-semibold mb-2">Add members</h2>
                            <p className="text-white-600 mb-6 text-[16px]">{activeRole?.title}</p>
                            <div>
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
                                <div className="overflow-auto">
                                    <ul>
                                        {searchResults.map(permission => (
                                            <li key={permission.id} className="flex items-center justify-between pb-[5px]">
                                                <span className="mr-auto">{permission?.user?.display_name}</span>
                                                <label className="ml-auto">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(permission.id)}
                                                        onChange={() => handleUserToggle(permission.id)}
                                                    />
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex justify-center mt-10 text-[14px]">
                                <button
                                    color="gray"
                                    onClick={onClose}
                                    className="px-4 py-2 mr-5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    color="blue"
                                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300"
                                    onClick = {()=>{
                                        handleUpdateRole();
                                        onClose();
                                    }
                                    }
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
			)}
		</>
	);
};