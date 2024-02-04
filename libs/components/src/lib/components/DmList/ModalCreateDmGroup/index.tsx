import React, { useEffect, useState } from 'react';
import * as Icons from '../../Icons';
import { Modal } from '@mezon/ui';
import {
    channelsActions,
    directActions,
    getStoreAsync,
    joinChanel,
} from '@mezon/store';
import { useAppDispatch } from '@mezon/store';
import { useNavigate } from 'react-router-dom';
import {
    useAppNavigation,
    useAppParams,
    useChannelMembers,
    useChat,
} from '@mezon/core';
import { ApiCreateChannelDescRequest } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

interface ModalCreateDMProps {
    onClose: () => void;
    isOpen: boolean;
}

export function ModalCreateDM({ onClose, isOpen }: ModalCreateDMProps) {
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const { toDmGroupPage } = useAppNavigation();
    const navigate = useNavigate();

    const [length, setLength] = useState<number>(selectedFriends.length);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setSelectedFriends((prevSelectedFriends) => {
            if (prevSelectedFriends.includes(value)) {
                return prevSelectedFriends.filter((friend) => friend !== value);
            } else {
                return [...prevSelectedFriends, value];
            }
        });
    };

    const handleCreateDM = async () => {
        const bodyCreateDmGroup: ApiCreateChannelDescRequest = {
            type: length > 1 ? 3 : 2,
            channel_private: 1,
            user_ids: selectedFriends,
        };
        const response = await dispatch(
            directActions.createNewDirectMessage(bodyCreateDmGroup),
        );
        const resPayload = response.payload as ApiCreateChannelDescRequest;
        console.log('resPayload', resPayload);
        if (resPayload.channel_id) {
            await dispatch(
                directActions.joinDirectMessage({
                    directMessageId: resPayload.channel_id,
                    channelName: resPayload.channel_lable,
                    type: Number(resPayload.type),
                }),
            );
            const directChat = toDmGroupPage(
                resPayload.channel_id,
                Number(resPayload.type),
            );
            navigate(directChat);
        }
        setSelectedFriends([]);
        onClose();
    };

    const [searchTerm, setSearchTerm] = useState<string>('');
    const { directId } = useAppParams();
    const { members } = useChannelMembers({
        channelId: '69df9c32-57aa-4c16-a90b-ecd33d4ef353',
    });
    interface FriendProps {
        name: string;
        id: string;
    }

    const [friends, setFriends] = useState<FriendProps[]>([
        { name: 'USER10', id: '26e7e1ff-7b83-4f46-bb87-58991d0cbdb1' },
        { name: 'USER11', id: '4f0ab1da-d153-4965-841d-b8d0123b645d' },
        { name: 'Truong Le Xuan', id: '842b743e-7dc5-479c-aba8-1f174dd4e621' },
        {
            name: 'Phong Nguyen Nam',
            id: 'e7766349-0e0b-40c2-ad02-603a74d23735',
        },
        { name: 'Minh Luc Van', id: '83c79681-0320-432a-8fe4-b2c7a18c27d7' },
        {
            name: 'Nhan Nguyen Tran',
            id: '8c464912-9e60-4b84-a5ef-318c03989980',
        },
        { name: 'Vy Pham Thi Mai', id: '327ea2df-cf03-4768-b41e-66fe84fecd75' },
        { name: 'Anh Nguyen Diep', id: '2a062f8b-5cb7-4cc7-b1a9-40293d2c9ea9' },
    ]);

    const filteredFriends = friends.filter((friend: FriendProps) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    useEffect(() => {
        setLength(selectedFriends.length);
    }, [selectedFriends]);

    const resetAndCloseModal = () => {
        setSelectedFriends([]);
        onClose();
    };

    return (
        <div className="overflow-y-scroll  flex-1 pt-3 space-y-[21px] h-32 flex flex-row justify-center text-gray-300 scrollbar-hide font-bold font-['Manrope']">
            <div className="flex flex-row items-center w-full gap-4 h-fit ">
                <Modal
                    title="Create DM"
                    showModal={isOpen}
                    onClose={resetAndCloseModal}
                >
                    <div className="bg-[#323232] w-full h-full">
                        <p className="pb-3">Select Friends</p>
                        <input
                            className="bg-gray-700 border  text-gray-900 text-sm rounded-lg border-[#1E1E1E] focus:border-blue-500 focus:outline-none
                        block ps-10 p-2.5 w-[500px] dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search user"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul
                            className="h-[400px] px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownSearchButton"
                        >
                            {filteredFriends.map((friend, index) => (
                                <li key={index}>
                                    <div className="flex items-center p-2 mt-2 rounded ">
                                        <input
                                            id={`checkbox-item-${index}`}
                                            type="checkbox"
                                            value={friend.id}
                                            className="w-4 h-4 border border-white cursor-pointer text-blue-600 bg-gray-100  rounded   dark:bg-gray-600 dark:border-gray-500"
                                            onChange={handleCheckboxChange}
                                        />
                                        <label
                                            htmlFor={`checkbox-item-${index}`}
                                            className="w-full ms-2 text-sm font-medium cursor-pointer text-white rounded"
                                        >
                                            {friend.name}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled={length === 0}
                            onClick={handleCreateDM}
                            className="w-full bg-blue-700 py-2 disabled:cursor-not-allowed disabled:bg-blue-500"
                        >
                            CREATE DM/GROUP
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
