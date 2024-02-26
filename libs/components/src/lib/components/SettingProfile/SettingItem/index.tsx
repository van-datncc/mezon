import { authActions, useAppDispatch } from '@mezon/store';
import { LogoutModal } from 'libs/ui/src/lib/LogOutButton';
import { useState } from 'react';
const SettingItem = ({ onItemClick }: { onItemClick?: (settingName: string) => void }) => {
	const [selectedButton, setSelectedButton] = useState<string | null>('Account');
	const handleButtonClick = (buttonName: string) => {
		setSelectedButton(buttonName);
	};
	const [openModal, setOpenModal] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const handleOpenModal = () => {
		setOpenModal(true);
	};
	const handleLogOut = () => {
		dispatch(authActions.logOut());
	};
	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedButton('');
	};
	return (
		<div className=" overflow-y-auto w-1/4 min-w-72 bg-black flex justify-end pt-96 pr-2 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
			<div className="w-170px ">
				<p className="text-blue-500 font-bold text-sm">USER SETTINGS</p>
				<button
					className={`p-1 text-[#AEAEAE] w-[170px] text-base rounded-[5px] text-left mt-3 ${selectedButton === 'Account' ? 'bg-blue-400 text-white' : ''}`}
					onClick={() => {
						handleButtonClick('Account');
						onItemClick && onItemClick('Account');
					}}
				>
					My Account
				</button>
				<br />
				<button
					className={`p-1 text-[#AEAEAE] text-base ${selectedButton === 'Profiles' ? 'bg-blue-400 text-white' : ''} mt-3 w-[170px] text-left rounded-[5px]`}
					onClick={() => {
						handleButtonClick('Profiles');
						onItemClick && onItemClick('Profiles');
					}}
				>
					Profiles
				</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Privacy & Safety</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Family Center</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Family Center</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Authorized Apps</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Devices</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Connections</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Clips</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base mb-[10px] w-[170px] rounded-[5px] text-left mt-3">Friend Requests</button>
				<hr className="border-t border-solid border-borderDefault mt-4" />
				<button className="pt-2 text-blue-500 mt-3 font-bold text-sm">USER SETTINGS</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Appearance</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Accessibility</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Voice & Video</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Text & Image</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Notifications</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Keybinds</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Language</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Streamer Mode</button>
				<br />
				<button className="p-1 text-[#AEAEAE] text-base w-[170px] rounded-[5px] text-left mt-3">Advanced</button>
				<br />
				<button
					className={`p-1 text-[#AEAEAE] text-base ${selectedButton === 'Log Out' ? 'bg-blue-400' : ''} mt-3 w-[170px] text-left rounded-[5px]`}
					onClick={() => {
						handleButtonClick('Log Out');
						handleOpenModal();
					}}
				>
					Log Out
				</button>
				<LogoutModal isOpen={openModal} handleLogOut={handleLogOut} onClose={handleCloseModal} />
				<div className="h-9"></div>
			</div>
		</div>
	);
};

export default SettingItem;
