import { selectFriendStatus, selectMemberByUserId } from '@mezon/store';
import { Modal } from 'flowbite-react';
import { useState } from 'react';
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
	const userById = useSelector(selectMemberByUserId(userId ?? ''));
	const checkAddFriend = useSelector(selectFriendStatus(userById?.user?.id || ''));
	const [openGroupIconBanner, setGroupIconBanner] = useState<OpenModalProps>(initOpenModal);
	return (
		<Modal
			className="bg-bgModalDark z-[999999999] absolute"
			style={{ position: 'absolute' }}
			theme={{ content: { inner: 'w-[600px] h-[80vh] flex flex-col' } }}
			show={openModal}
			dismissible={true}
			onClose={onClose}
		>
			<div className="dark:bg-[#544845] bg-bgLightMode h-[210px] rounded-t-md">
				<div className={`rounded-tl-lg rounded-tr-lg h-[60px] flex justify-end gap-x-2 p-2 `}>
					<GroupIconBanner
						checkAddFriend={checkAddFriend}
						openModal={openGroupIconBanner}
						setOpenModal={setGroupIconBanner}
						user={userById}
					/>
				</div>
			</div>
			<div className="dark:bg-[#ffffff] bg-bgLightMode rounded-b-md flex-1">Xin chào</div>
		</Modal>
	);
};

export default UserProfileModalInner;
