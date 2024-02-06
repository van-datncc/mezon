import React, { useEffect, useState } from 'react';
import * as Icons from '../../Icons';
import { Modal } from '@mezon/ui';
import { DirectEntity, IFriend, channelsActions, directActions, getStoreAsync, joinChanel, selectAllFriends } from '@mezon/store';
import { useAppDispatch } from '@mezon/store';
import { useNavigate } from 'react-router-dom';
import { useAppNavigation, useAppParams, useChannelMembers, useChat, useChatDirect } from '@mezon/core';
import { ApiCreateChannelDescRequest } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import { useSelector } from 'react-redux';
import { IChannel } from '@mezon/utils';

interface ModalCreateDMProps {
	onClose: () => void;
	isOpen: boolean;
}

export function ModalCreateDM({ onClose, isOpen }: ModalCreateDMProps) {
	const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
	const dispatch = useAppDispatch();
	const { toDmGroupPage } = useAppNavigation();
	const navigate = useNavigate();
	const { friends } = useChatDirect(undefined);
	const [length, setLength] = useState<number>(selectedFriends.length);
	const { listDM } = useChatDirect(undefined);

	const filterDmGroupsByChannelLabel = (data: IChannel[]) => {
		const uniqueLabels = new Set();
		return data.filter((obj: IChannel) => {
			const isUnique = !uniqueLabels.has(obj.channel_lable);
			uniqueLabels.add(obj.channel_lable);
			return isUnique;
		});
	};

	const filteredDataDM = filterDmGroupsByChannelLabel(listDM);

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

	function getUsernamesByIds(idsInput: string[], dataFriens: IFriend[]) {
		return dataFriens.filter((item) => idsInput.includes(item.id)).map((item) => item?.user?.username);
	}

	function findChannelsByLabel(data: DirectEntity[], names: any) {
		data.filter((item: DirectEntity) => {
			const label = item.channel_lable?.split(',');
			const sortLabel = label?.sort();

			const areArraysEqual = sortLabel?.length === names.length && sortLabel?.every((value, index) => value === names[index]);
            console.log("-----------")
            console.log('sortLabel', sortLabel);
			console.log('name', names);
			console.log('areArraysEqual', areArraysEqual);
			if (areArraysEqual) {
				return item;
			}

			// if (sortLabel) {
			// 	if (sortLabel === names) return item;
			// }
		});
	}

	const [isExist, setIsExist] = useState<boolean>(false);
	useEffect(() => {
		const usernamesArray = getUsernamesByIds(selectedFriends, friends).sort();

		if (usernamesArray.length > 0) {
			console.log('usernamesArray', usernamesArray);
			const itemMatching = findChannelsByLabel(filteredDataDM, usernamesArray);
			console.log('itemmatching', itemMatching);
		}
	}, [selectedFriends]);

	const handleCreateDM = async () => {
		const bodyCreateDmGroup: ApiCreateChannelDescRequest = {
			type: length > 1 ? 3 : 2,
			channel_private: 1,
			user_ids: selectedFriends,
		};

		const response = await dispatch(directActions.createNewDirectMessage(bodyCreateDmGroup));
		const resPayload = response.payload as ApiCreateChannelDescRequest;
		if (resPayload.channel_id) {
			await dispatch(
				directActions.joinDirectMessage({
					directMessageId: resPayload.channel_id,
					channelName: resPayload.channel_lable,
					type: Number(resPayload.type),
				}),
			);
			const directChat = toDmGroupPage(resPayload.channel_id, Number(resPayload.type));
			navigate(directChat);
		}
		setSelectedFriends([]);
		onClose();
	};

	const [searchTerm, setSearchTerm] = useState<string>('');
	const filteredFriends = friends.filter((friend: IFriend) => friend.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()));
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
				<Modal title="Create DM" showModal={isOpen} onClose={resetAndCloseModal}>
					<div className="bg-[#323232] w-full h-full">
						<p className="pb-3">Select Friends</p>
						<input
							className="bg-black border font-thin text-white text-sm rounded-lg border-[#1E1E1E] focus:border-blue-500 focus:outline-none
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
									<div className="flex items-center py-2 my-2 rounded w-full">
										<input
											id={`checkbox-item-${index}`}
											type="checkbox"
											value={friend.id}
											className="w-4 h-4 border border-white cursor-pointer text-blue-600 bg-gray-100  rounded placeholder:text-gray-300  dark:bg-gray-600 dark:border-gray-500"
											onChange={handleCheckboxChange}
										/>
										<label
											htmlFor={`checkbox-item-${index}`}
											className="w-full ms-2 text-sm font-medium cursor-pointer text-white rounded"
										>
											{friend.user?.username}
										</label>
									</div>
								</li>
							))}
						</ul>
						<button
							disabled={length === 0}
							onClick={handleCreateDM}
							className="w-full bg-blue-700 py-2 disabled:cursor-not-allowed disabled:bg-gray-500"
						>
							{selectedFriends.length === 0
								? 'CREATE DM or GROUP CHAT'
								: selectedFriends.length === 1
									? 'CREATE DM'
									: 'CREATE GROUP CHAT'}
						</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}
