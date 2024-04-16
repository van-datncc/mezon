import { selectCurrentChannelId, selectMemberByUserId, selectMembersByChannelId } from '@mezon/store';
import { EPermission} from '@mezon/utils';
import { useDirect, useRoles, useSendInviteMessage, UserRestrictionZone, useClanRestriction, useAuth, useClans } from '@mezon/core';
import { useMezon } from '@mezon/transport';
import { ChannelType } from 'mezon-js';
import { ChangeEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
type ShortUserProfilePopup = {
    userID?:string;
}

    const ShortUserProfile = ({userID}:ShortUserProfilePopup) => {   
        const currentChannelId = useSelector(selectCurrentChannelId);
        const userById = useSelector(selectMemberByUserId(userID||''))
        
        const { RolesClan, updateRole } = useRoles(currentChannelId|| '');
        const { currentClan } = useClans();
        
        const [searchTerm, setSearchTerm] = useState('');
        const activeRoles = RolesClan.filter((role) => role.active === 1);
        const { sendInviteMessage } = useSendInviteMessage();
        const { createDirectMessageWithUser } = useDirect();
        const [content, setContent] = useState<string>('');
        const [showPopupAddRole, setShowPopupAddRole] = useState(false)
        const mezon = useMezon();
        const { userProfile } = useAuth();
        const userRolesClan = useMemo(() => {
            return userById?.role_id?(RolesClan.filter(role => userById?.role_id?.includes(role.id))):[];
        }, [userById?.role_id, RolesClan]);
        const activeRolesWithoutUserRoles = activeRoles.filter(role =>
            !userRolesClan.some(userRole => userRole.id === role.id)
        );
          
        const [hasManageChannelPermission, { isClanCreator }] = useClanRestriction([EPermission.manageChannel]);
        const sendMessage = async (userId: string) =>{
            const response = await createDirectMessageWithUser(userId);
            if (response.channel_id) {
                mezon.joinChatDirectMessage(response.channel_id, '', ChannelType.CHANNEL_TYPE_DM);
                sendInviteMessage(content, response.channel_id);
                setContent('')
            }
            
        }
        const handleContent = (e: React.ChangeEvent<HTMLInputElement>) => {
            setContent(e.target.value);
        };
        const checkOwner = (userId: string) => {
            return userId === userProfile?.user?.google_id;
        };
        const handModalAddRole =()=> {
            setShowPopupAddRole(true)
        }
        const handleClickOutside = () => {
            if (showPopupAddRole) {
                setShowPopupAddRole(false)
            }
        }
        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        };
        
        const filteredListRoleBySearch = useMemo(
            () => {
                return activeRolesWithoutUserRoles?.filter(role => {
                    return role.title?.toLowerCase().includes(searchTerm.toLowerCase());
                });
            },
            [activeRolesWithoutUserRoles, searchTerm],
        );
        const addRole = async(roleId:string) => {
            setShowPopupAddRole(false)
            const activeRole = RolesClan.find((role) => role.id === roleId);
            const userIDArray = userById?.user?.id?.split(','); 
            await updateRole(currentClan?.clan_id || '', roleId, activeRole?.title ?? '', userIDArray||[], [], [], []);
        }

        const deleteRole = async(roleId:string) => {
            const activeRole = RolesClan.find((role) => role.id === roleId);
            const userIDArray = userById?.user?.id?.split(','); 
            await updateRole(currentClan?.clan_id || '', roleId, activeRole?.title ?? '', [], [], userIDArray||[], []);
        }
	return (
            <div className="relative">
                <div onClick={handleClickOutside} className='text-white'>
                    <div className="h-[60px] bg-[#8CBC4F] rounded-tr-[10px] rounded-tl-[10px]"></div>
                    <div className="text-black ml-[50px]">
                    {userById?.user?.avatar_url === undefined || userById?.user?.avatar_url === '' ? (
                        <div className="w-[90px] h-[90px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[50px] mt-[-50px] ml-[-25px]">
                            {userById?.user?.username?.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <img
                            src={userById?.user?.avatar_url}
                            alt=""
                            className="w-[90px] h-[90px] xl:w-[100px] xl:h-[100px] rounded-[50px] bg-bgSecondary mt-[-50px] ml-[-25px] border-[6px] border-solid border-black object-cover"
                        />
                    )}
                    </div>
                    <div className="px-[16px]">
                        <div className="bg-bgSecondary w-full p-4 my-[16px] rounded-[10px] flex flex-col gap-y-6 xl:gap-y-7">
                            <div className="w-[300px]">
                                <p className="font-bold tracking-wider text-xl one-line">{userById?.user?.username}</p>
                                <p className="font-medium tracking-wide text-sm">{userById?.user?.display_name}</p>
                            </div>
                            <hr className='mt-[-18px]'/>
                            <div className="font-bold tracking-wider text-sm one-line mt-[-15px]">
                                ROLES
                            </div>
                            <div className='mt-[-18px]'>
                                {userRolesClan.map((role, index) => (
                                    <span key={index} className="inline-block text-xs border border-bgDisable rounded-[10px] px-2 py-1 bg-bgDisable mr-2 mb-2">
                                    <button 
                                        className="mr-2 px-1 border border-bgDisable rounded-full bg-bgDisable hover:bg-gray-400"
                                        onClick={()=>deleteRole(role.id)}
                                    >x</button>
                                    <span>
                                        {role.title}
                                    </span>
                                </span>
                                ))}
                                <UserRestrictionZone policy={isClanCreator || hasManageChannelPermission}>
                                    <span className='font-bold border border-bgDisable rounded-full bg-bgDisable px-2 relative'
                                        onClick={handModalAddRole}
                                    >
                                        +
                                        <div className='absolute left-0 top-10 '>
                                            { showPopupAddRole ? 
                                                <div className='w-[300px] h-[200px] bg-[#323232] p-2 text-white overflow-y: auto'>
                                                    <input type="text"
                                                        className='w-full border-[#1d1c1c] rounded-[5px] bg-[#1d1c1c] px-2' 
                                                        placeholder='Role'
                                                        onChange={handleInputChange}
                                                    />
                                                    {filteredListRoleBySearch.map((role, index) => (
                                                    <div key={index} 
                                                        className=" text-xs w-full border border-bgDisable rounded-[10px] px-2 py-1 bg-bgDisable mr-2 hover:bg-[#1d1c1c] "
                                                        onClick={()=>addRole(role.id)}
                                                        >
                                                            {role.title}
                                                    </div>
                                                    ))}
                                                </div>
                                            : null}
                                        </div>
                                    </span>
                                    
                                </UserRestrictionZone>
                            </div>
                            {!checkOwner(userById?.user?.google_id || '') ? 
                                <div className="w-full items-center">
                                    <input type="text" 
                                        className='w-full border border-bgDisable rounded-[5px] bg-bgDisable p-[5px] ' 
                                        placeholder={`Message @${userById?.user?.username}`} 
                                        value={content}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                sendMessage(userById?.user?.id||'');
                                            }
                                            }}
                                            onChange={handleContent}
                                    />
                                </div>
                            : 
                                null}
                        </div>
                    </div>
                </div>
               
                
            </div>
            
	);
};

export default ShortUserProfile;
