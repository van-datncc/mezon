import { useClans } from '@mezon/core';
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
		<div className=" overflow-y-auto w-1/6 xl:w-1/4 min-w-56 bg-black flex justify-end pt-96 pr-2 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 2xl:flex-grow hide-scrollbar flex-grow">
			<div className="w-170px ">
				<p className="text-[#84ADFF] font-bold text-sm tracking-wider uppercase">{currentClan?.clan_name}</p>
				<button
					className={`text-[#AEAEAE] w-[170px] text-[15px] rounded-[5px] text-left ml-[-8px] p-2 mt-4  ${selectedButton === 'Roles' ? 'bg-[#232E3B] text-white' : ''}`}
					onClick={() => {
						handleButtonClick('Roles');
						onItemClick && onItemClick('Roles');
					}}
				>
					Roles
				</button>
				<br />
				<button
					className={`p-2 text-[#AEAEAE] text-[15px] pl-2 ml-[-8px]  mt-1 w-[170px] text-left rounded-[5px]${selectedButton === 'LogOut' ? 'bg-[#155EEF1A]' : ''} w-[170px] text-left rounded-[5px] hover:text-white`}
					onClick={() => {}}
				>
					Delete Server
				</button>
				<LogoutModal isOpen={openModal} handleLogOut={handleLogOut} onClose={handleCloseModal} />
			</div>
		</div>
	);
};

export default ServerSettingItems;
