import ModalUserProfile from '../ModalUserProfile';

type ModalFooterProfileProps = {
	userId: string;
};

const ModalFooterProfile = ({ userId }: ModalFooterProfileProps) => {
	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={`fixed left-[50px] bottom-[70px] bg-bgSecondary600 mt-[10px] w-[340px] rounded-lg flex flex-col z-10 opacity-100 shadow-md shadow-bgTertiary-500/40`}
		>
			<ModalUserProfile userID={userId} isFooterProfile />
		</div>
	);
};

export default ModalFooterProfile;
