import { NavLink } from 'react-router-dom';
import MemberProfile from '../MemberProfile';
import { IconFriends } from '../Icons';
import { useAppNavigation, useAppParams, useChatDirect } from '@mezon/core';
import * as Icons from '../Icons';
import { ModalCreateDM } from './ModalCreateDmGroup/index';
import { useState } from 'react';
import { ChannelTypeEnum } from '@mezon/utils';

export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

function DirectMessageList() {
    const { directId } = useAppParams();
    const dmGroupList = useChatDirect(directId);
    console.log('dmGroupList', dmGroupList.listDM);
    const { navigate } = useAppNavigation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const onClickOpenModal = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <hr className="h-[0.08px] w-[272px] mt-[24px] border-[#1E1E1E]" />
            <div className="overflow-y-scroll flex-1 pt-3 space-y-[21px] font-medium text-gray-300 scrollbar-hide ">
                {
                    <div className="flex flex-col gap-4 font-['Manrope'] text-[#AEAEAE] py-4 px-2">
                        <button
                            className={` rounded-[4px] flex items-center gap-3`}
                            onClick={() => {
                                navigate('/chat/direct/friends');
                            }}
                        >
                            <IconFriends />
                            Add Friend
                        </button>
                        <div className="text-[14px] font-bold text-[#fff] mt-3 flex flex-row items-center justify-center gap-3  h-5">
                            DIRECT MESSAGE
                            <button
                                onClick={onClickOpenModal}
                                className="cursor-pointer flex flex-row justify-end ml-0"
                            >
                                <Icons.Plus />
                            </button>
                            <ModalCreateDM
                                onClose={onClickOpenModal}
                                isOpen={isOpen}
                            />
                        </div>
                        {dmGroupList.listDM.map((directMessage: any) => (
                            <NavLink
                                className={'hover:bg-gray-800 w-full px-2 py-1'}
                                to={`/chat/direct/message/${directMessage.channel_id}/${directMessage.type}`}
                            >
                                <MemberProfile
                                    numberCharacterCollapse={20}
                                    avatar={directMessage?.user?.avatar ?? ''}
                                    name={directMessage?.channel_lable ?? ''}
                                    status={false}
                                    isHideStatus={false}
                                    key={directMessage.channel_id}
                                />
                            </NavLink>
                        ))}
                    </div>
                }
            </div>
        </>
    );
}

export default DirectMessageList;
