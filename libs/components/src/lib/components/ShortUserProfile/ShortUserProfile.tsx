import { IMessageWithUser } from '@mezon/utils';
import { useState } from 'react';
import ModalUserProfile from '../ModalUserProfile';
type ShortUserProfilePopup = {
	userID?: string;
	message?: IMessageWithUser;
	mode?: number;
	avatar?: string;
	positionType?: string;
	name?: string;
};

const ShortUserProfile = ({ userID, message, mode, positionType, avatar, name }: ShortUserProfilePopup) => {
	const [showPopupAddRole, setShowPopupAddRole] = useState(false);
	const handleClickOutside = () => {
		if (showPopupAddRole) {
			setShowPopupAddRole(false);
		}
	};
	return (
		<div className="relative">
			<div onClick={handleClickOutside} className="text-white w-full" role="button">
				<ModalUserProfile
					userID={userID}
					classBanner="rounded-tl-lg rounded-tr-lg h-[105px]"
					message={message}
					mode={mode}
					positionType={positionType}
					avatar={avatar}
					name={name}
				/>
			</div>
		</div>
	);
};

export default ShortUserProfile;
