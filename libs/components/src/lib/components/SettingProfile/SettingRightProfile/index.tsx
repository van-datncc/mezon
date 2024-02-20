import { useChat } from '@mezon/core';
import { useEffect, useState } from 'react';
import SettingRightClan from '../SettingRightClanProfile';
import SettingRightUser from '../SettingRightUserProfile';
const SettingRightProfile = () => {
	const { userProfile } = useChat();
	const [isUserSettings, setIsUserSettings] = useState(true);

	const handleClanProfileClick = () => {
		setIsUserSettings(false);
	};

	useEffect(() => {}, [userProfile]);

	const handleUserSettingsClick = () => {
		setIsUserSettings(true);
	};

	return (
		<>
			{isUserSettings ? (
				<SettingRightUser
					onClanProfileClick={handleClanProfileClick}
					name={userProfile?.user?.username || ''}
					avatar={userProfile?.user?.avatar_url || ''}
					nameDisplay={userProfile?.user?.display_name || ''}
				/>
			) : (
				<SettingRightClan onUserProfileClick={handleUserSettingsClick} />
			)}
		</>
	);
};

export default SettingRightProfile;
