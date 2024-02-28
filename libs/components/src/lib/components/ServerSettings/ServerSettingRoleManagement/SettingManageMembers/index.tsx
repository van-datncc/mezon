import { useClans, useRoles } from "@mezon/core";
import { getSelectedRoleId } from "@mezon/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AddMembersModal } from "../AddMembersModal";

const SettingManageMembers = () => {
    const { RolesClan, updateRole } = useRoles();
    const clickRole = useSelector(getSelectedRoleId);
    const activeRole = RolesClan.find(role => role.id === clickRole);
    const memberRoles = activeRole?.role_user_list?.role_users;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { currentClan } = useClans();
    const handleOpenModal = () => {
		setOpenModal(true);
	};

    const handleCloseModal = () => {
		setOpenModal(false);
	};

    useEffect(() => {
        const results = memberRoles?.filter(member =>
            member.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results || []);
    }, [memberRoles, searchTerm]);
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
                        <li key={member.id} className="flex justify-between items-center">
                        <span>{member.display_name}</span>
                        <span onClick={() => handleRemoveMember(member.id)} className="text-white cursor-pointer">x</span>
                    </li>
                    ))}
                </ul>
            </div>
            <AddMembersModal isOpen={openModal} onClose={handleCloseModal} />
        </>
    );
};

export default SettingManageMembers;
