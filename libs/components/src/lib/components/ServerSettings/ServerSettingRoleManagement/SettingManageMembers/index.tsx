import { useClans, useRoles } from "@mezon/core";
import { getNewAddMembers, getSelectedRoleId } from "@mezon/store";
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { AddMembersModal } from "../AddMembersModal";

const SettingManageMembers = () => {
    const { RolesClan, updateRole } = useRoles();
    const { currentClan } = useClans();
    const addUsers: string[] = useSelector(getNewAddMembers);
    const clickRole = useSelector(getSelectedRoleId);
    const activeRole = RolesClan.find(role => role.id === clickRole);
    const { usersClan } = useClans();
    const memberRoles = activeRole?.role_user_list?.role_users;
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    
    const commonUsers = usersClan.filter(user => addUsers.includes(user.id));
    const [searchResults, setSearchResults] = useState<any[]>(commonUsers);
    const handleOpenModal = () => {
		setOpenModal(true);
	};
    
    const handleCloseModal = () => {
		setOpenModal(false);
	};

    useEffect(() => {
            const results = commonUsers?.filter(member =>
                member.user?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results || []);
    }, [memberRoles, searchTerm, addUsers, clickRole]);

    
    const handleRemoveMember = async (userID:string[]) =>{
        await updateRole(currentClan?.id ?? '',clickRole,'',[],[],userID,[]);
    }
    return (
        <>
            <div className="w-full pr-[10px] flex">
                <input 
                    className="flex-grow bg-black p-[7px] border-2 rounded-lg mr-[10px]"
                    type="text" 
                    placeholder="Search Members"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="flex-grow bg-blue-500 text-white p-[7px] rounded-lg"
                    onClick={() => {
                        handleOpenModal();
                    }}
                >
                    Add Members
                </button>
            </div>
            <br />
            <div>
                <ul>
                    {searchResults.map((member: any) => (
                        <li key={member.user.id} className="flex justify-between items-center">
                            <span>{member.user.display_name}</span>
                            {clickRole !== "New Role" ?(
                                <span onClick={() => handleRemoveMember(member.user.id)} className="text-white cursor-pointer">x</span>
                            ):null
                            }
                        </li>
                    ))}
                </ul>  
            </div>
            <AddMembersModal isOpen={openModal} onClose={handleCloseModal} />
        </>
    );
};

export default SettingManageMembers;
