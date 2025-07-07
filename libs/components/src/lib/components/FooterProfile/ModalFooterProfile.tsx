import { RefObject, useCallback } from 'react';
import ModalUserProfile from '../ModalUserProfile';

type ModalFooterProfileProps = {
	userId: string;
	avatar?: string;
	name?: string;
	isDM: boolean;
	userStatusProfile: string;
	rootRef?: RefObject<HTMLElement>;
	onCloseModal?: () => void;
};

const ModalFooterProfile = ({ userId, avatar, name, isDM, userStatusProfile, rootRef, onCloseModal }: ModalFooterProfileProps) => {
	const handleCloseModalFooterProfile = useCallback(() => {
		onCloseModal?.();
	}, [onCloseModal]);

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={`outline-none fixed sbm:left-[50px] left-5 bottom-[70px]  mt-[10px] w-[340px] max-w-[89vw] rounded-lg flex flex-col z-30 opacity-100 shadow-md shadow-bgTertiary-500/40 origin-bottom bg-outside-footer `}
		>
			<ModalUserProfile
				rootRef={rootRef}
				onClose={handleCloseModalFooterProfile}
				userID={userId}
				isFooterProfile
				avatar={avatar}
				name={name}
				isDM={isDM}
				userStatusProfile={userStatusProfile}
			/>
		</div>
	);
};

export default ModalFooterProfile;
