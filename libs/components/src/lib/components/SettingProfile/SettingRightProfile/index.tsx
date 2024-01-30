import React, { useState,useEffect } from 'react';
import SettingRightUser from '../SettingRightUserProfile'
import SettingRightClan from '../SettingRightClanProfile'
import { useChat } from '@mezon/core';
const SettingRightProfile = () => {
  const {clans, userProfile } = useChat();
  const [isUserSettings, setIsUserSettings] = useState(true);

  const handleClanProfileClick = () => {
    setIsUserSettings(false);
  };

  useEffect(() => {
  }, [userProfile]);

  const handleUserSettingsClick = () => {
    setIsUserSettings(true);
  };
  
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
        {isUserSettings ? (
          <SettingRightUser onClanProfileClick={handleClanProfileClick} name={userProfile?.user?.username || ''} avatar={userProfile?.user?.avatar_url || '' } nameDisplay={userProfile?.user?.display_name || ''}/>
        ) : (
          <SettingRightClan onUserProfileClick={handleUserSettingsClick} clans={clans} name={userProfile?.user?.username || ''} avatar={userProfile?.user?.avatar_url || '' } nameDisplay={userProfile?.user?.display_name || ''}/>
        )}
        </>
    )
  }
  
  export default SettingRightProfile;