import {  useClans, useRoles } from '@mezon/core';
import { authActions, useAppDispatch } from '@mezon/store';
import { LogoutModal } from 'libs/ui/src/lib/LogOutButton';
import { useState } from 'react';
const ServerSettingItems = ({ onItemClick }: { onItemClick?: (settingName: string) => void }) => {
	const [selectedButton, setSelectedButton] = useState<string | null>('Roles');
	const handleButtonClick = (buttonName: string) => {
		setSelectedButton(buttonName);
	};
    const { currentClan } = useClans();
	
	const [openModal, setOpenModal] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const handleLogOut = () => {
		dispatch(authActions.logOut());
	};
	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedButton('');
	};
	return (
		<div className="hidden overflow-y-auto w-1/4 bg-black md:block pt-96 pl-[142px] pr-[16px] pb-[96px] scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
			<div className="w-170px ">
				<p className="text-blue-500 ">{currentClan?.clan_name}</p>
				{/* <button
					className={`pt-1 pl-1 text-white w-[170px] rounded-[5px] text-left mt-[16px] ${selectedButton === 'Account' ? 'bg-blue-400' : ''}`}
					onClick={() => {
						handleButtonClick('Account');
						onItemClick && onItemClick('Account');
					}}
				>
					My Account
				</button> */}
				{/* <br /> */}
				<button
					className={`pt-1 pl-1 text-white w-[170px] rounded-[5px] text-left mt-[16px] ${selectedButton === 'Roles' ? 'bg-blue-400' : ''}`}
					onClick={() => {
						handleButtonClick('Roles');
						onItemClick && onItemClick('Roles');
					}}
				>
					Roles
				</button>
				<br />
				<button
					className={`pt-1 pl-1 text-white ${selectedButton === 'LogOut' ? 'bg-blue-400' : ''} mt-[16px] w-[170px] text-left rounded-[5px]`}
					onClick={() => {
					}}
				>
					Delete server
				</button>
				<LogoutModal isOpen={openModal} handleLogOut={handleLogOut} onClose={handleCloseModal} />
			</div>
		</div>
	);
};

export default ServerSettingItems;
