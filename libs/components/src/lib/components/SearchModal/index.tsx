import { useAppNavigation, useAuth, useCategory, useChannels, useClans, useDirect, useFriends } from '@mezon/core';
import { InputField } from '@mezon/ui';
import { Modal } from 'flowbite-react';
import { useMemo, useState } from 'react';
import SuggestItem from '../MessageBox/ReactionMentionInput/SuggestItem';
import { removeDuplicatesById } from '@mezon/utils';

export type SearchModalProps = {
    open: boolean;
    onClose: () => void;
};

function SearchModal({ open, onClose }: SearchModalProps) {
    const { userProfile } = useAuth();
    const [searchText, setSearchText] = useState('')
    const accountId = userProfile?.user?.id ?? ''
    const { toDmGroupPageFromMainApp, toChannelPage, navigate } = useAppNavigation();
    const { createDirectMessageWithUser } = useDirect();
    const { listDM: dmGroupChatList } = useDirect();
    const { listChannels } = useChannels();
    const listGroup = dmGroupChatList.filter((groupChat) => groupChat.type === 2);
    const listDM = dmGroupChatList.filter((groupChat) => groupChat.type === 3);
    const { usersClan } = useClans();
    const { friends } = useFriends();

    const listMemSearch = useMemo(() => {
        let listDMSearch = listDM.length
            ? listDM.map((itemDM: any) => {
                return {
                    id: itemDM?.user_id[0] ?? '',
                    name: itemDM?.channel_label ?? '',
                    avatarUser: itemDM?.channel_avatar[0] ?? '',
                    idDM: itemDM?.id ?? '',
                    typeChat: 3
                };
            })
            : [];
        let listGroupSearch = listGroup.length
            ? listGroup.map((itemGr: any) => {
                return {
                    id: itemGr?.channel_id ?? '',
                    name: itemGr?.channel_label ?? '',
                    avatarUser: '/assets/images/avatar-group.png' ?? '',
                    idDM: itemGr?.id ?? '',
                    typeChat: 2
                };
            })
            : [];
        let listFriendsSearch = friends.length
            ? friends.map((itemFriend: any) => {
                return {
                    id: itemFriend?.id ?? '',
                    name: itemFriend?.user.username ?? '',
                    avatarUser: itemFriend?.user.avatar_url ?? '',
                    idDM: '',
                };
            })
            : [];
        let listUserClanSearch = usersClan.length
            ? usersClan.map((itemUserClan: any) => {
                return {
                    id: itemUserClan?.id ?? '',
                    name: itemUserClan?.user?.username ?? '',
                    avatarUser: itemUserClan?.user?.avatar_url ?? '',
                    idDM: '',
                };
            })
            : [];
        const listSearch = [...listDMSearch, ...listFriendsSearch, ...listUserClanSearch, ...listGroupSearch];
        return removeDuplicatesById(listSearch.filter(item => item.id !== accountId));
    }, []);

    const listChannelSearch = useMemo(() => {
        const list = listChannels.map((item) => {
            return {
                id: item?.channel_id ?? '',
                name: item?.channel_label ?? '',
                subText: item?.category_name ?? '',
                icon: '#',
                clanId: item?.clan_id ?? ''
            };
        });
        return list;
    }, []);

    const handleSelectMem = async (user: any) => {
        if (user.idDM) {
            const directChat = toDmGroupPageFromMainApp(user.idDM, user?.typeChat ?? 2);
            navigate(directChat);
        } else {
            const response = await createDirectMessageWithUser(user.id);
            if (response.channel_id) {
                const directChat = toDmGroupPageFromMainApp(response.channel_id, Number(response.type));
                navigate(directChat);
            }
        }
        onClose()
    }

    const handleSelectChannel = async (channel: any) => {
        const directChannel = toChannelPage(channel.id, channel.clanId);
        navigate(directChannel);
        onClose()
    }

    const isNoResult = !listChannelSearch.filter((item) => item.name.indexOf(searchText) > -1).length && !listMemSearch.filter((item: any) => item.name.indexOf(searchText) > -1).length

    return (
        <>
            <Modal show={open} dismissible={true} onClose={onClose} className="bg-[#111111] text-contentPrimary bg-opacity-90">
                <Modal.Body className="bg-[#36393e] px-6 py-4 rounded-[6px] h-[200px] w-[400px] w-full">
                    <div className="flex flex-col">
                        <InputField
                            type="text"
                            placeholder="Where would you like to go?"
                            className="py-[18px] bg-bgTertiary text-[16px] mt-2 mb-0 mb-[15px]"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className='w-full max-h-[250px] overflow-x-hidden overflow-y-auto w-full flex flex-col gap-[3px] pr-[5px] py-[10px]'>
                        {!searchText.startsWith('@') && !searchText.startsWith('#') ? (
                            <>
                                {listMemSearch.length ? (
                                    listMemSearch.filter((item: any) => item.name.indexOf(searchText) > -1)
                                        .slice(0, 7).map((item: any) => {
                                            return (
                                                <div onClick={() => handleSelectMem(item)} className='hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer'>
                                                    <SuggestItem name={item?.name} avatarUrl={item.avatarUser} />
                                                </div>
                                            );
                                        })
                                ) : (
                                    <></>
                                )}
                                {listChannelSearch.length ? (
                                    listChannelSearch.filter((item) => item.name.indexOf(searchText) > -1)
                                        .slice(0, 8).map((item: any) => {
                                            return (
                                                <div onClick={() => handleSelectChannel(item)} className='hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer'>
                                                    <SuggestItem name={item.name ?? ''} symbol={item.icon} subText={item.subText} />
                                                </div>
                                            );
                                        })
                                ) : (
                                    <></>
                                )}
                                {isNoResult && <span className=' flex flex-row justify-center'>Can't seem to find what you're looking for?</span>}
                            </>
                        ) : (
                            <>
                                {searchText.startsWith('@') && (
                                    <>
                                        <span className='text-left opacity-60 text-[11px] pb-1 uppercase'>Search friend and users</span>
                                        {listMemSearch.length ? (
                                            listMemSearch.filter((item: any) => item.name.indexOf(searchText.substring(1)) > -1)
                                                .slice(0, 25).map((item: any) => {
                                                    return (
                                                        <div onClick={() => handleSelectMem(item)} className='hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer'>
                                                            <SuggestItem name={item?.name} avatarUrl={item.avatarUser} />
                                                        </div>
                                                    );
                                                })
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                )}
                                {searchText.startsWith('#') && (
                                    <>
                                        <span className='text-left opacity-60 text-[11px] pb-1 uppercase'>Searching channel</span>
                                        {listChannelSearch.length ? (
                                            listChannelSearch.filter((item) => item.name.indexOf(searchText.substring(1)) > -1)
                                                .slice(0, 25).map((item: any) => {
                                                    return (
                                                        <div onClick={() => handleSelectChannel(item)} className='hover:bg-[#424549] w-full px-[10px] py-[4px] rounded-[6px] cursor-pointer'>
                                                            <SuggestItem name={item.name ?? ''} symbol={item.icon} subText={item.subText} />
                                                        </div>
                                                    );
                                                })
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                    </div>
                    <div className='pt-2'>
                        <span className='text-[13px] font-medium text-contentTertiary'><span className='text-[#2DC770] opacity-100 font-bold'>PROTIP: </span>Start searches with @, # to narrow down results.</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SearchModal;
