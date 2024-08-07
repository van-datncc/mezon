import { useOnClickOutside } from '@mezon/core';
import { selectFriendStatus, selectMemberByUserId } from '@mezon/store';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { OpenModalProps } from '../ModalUserProfile';
import GroupIconBanner from '../ModalUserProfile/StatusProfile/groupIconBanner';

type UserProfileModalInnerProps = {
	openModal: boolean;
	onClose?: () => void;
	userId?: string;
};

const initOpenModal = {
	openFriend: false,
	openOption: false,
};

const UserProfileModalInner = ({ openModal, userId, onClose }: UserProfileModalInnerProps) => {
	const userProfileRef = useRef<HTMLDivElement | null>(null);
	const userById = useSelector(selectMemberByUserId(userId ?? ''));
	const checkAddFriend = useSelector(selectFriendStatus(userById?.user?.id || ''));
	const [openGroupIconBanner, setGroupIconBanner] = useState<OpenModalProps>(initOpenModal);

	useOnClickOutside(userProfileRef, () => onClose?.());
	return (
		<div className="w-[100vw] h-[100vh] overflow-hidden fixed top-0 left-0 z-50 bg-black bg-opacity-80 flex flex-row justify-center items-center">
			<div
				ref={userProfileRef}
				className="w-[600px] h-[80vh] dark:bg-bgPrimary bg-bgLightModeThird rounded-lg flex-col justify-start  items-start inline-flex overflow-hidden"
			>
				<div className="dark:bg-[#544845] bg-bgLightMode w-full h-[210px] rounded-t-md">
					<div className={`rounded-tl-lg rounded-tr-lg h-[60px] flex justify-end gap-x-2 p-2 `}>
						<GroupIconBanner
							checkAddFriend={checkAddFriend}
							openModal={openGroupIconBanner}
							setOpenModal={setGroupIconBanner}
							user={userById}
						/>
					</div>
				</div>
				<div className="dark:bg-[#ffffff] bg-bgLightMode rounded-b-md w-full flex-1">Profile</div>
			</div>
		</div>
	);
};

export default UserProfileModalInner;
