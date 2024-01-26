import React, { useState,useEffect } from 'react';
import SettingRightUser from '../SettingRightUserProfile'
import SettingRightClan from '../SettingRightClanProfile'
import { useChat } from '@mezon/core';
const SettingRightProfile = () => {
  const { currentChanel, currentClan, userProfile } = useChat();
  const [isUserSettings, setIsUserSettings] = useState(true);

  const handleClanProfileClick = () => {
    setIsUserSettings(false);
  };

  const handleUserSettingsClick = () => {
    setIsUserSettings(true);
  };
  
  
    return (
        <>
        {isUserSettings ? (
          <SettingRightUser onClanProfileClick={handleClanProfileClick} name={userProfile?.user?.username || ''} avatar={userProfile?.user?.avatar_url || ''}/>
        ) : (
          <SettingRightClan onUserProfileClick={handleUserSettingsClick}/>
        )}
        </>
    )
  }
  
  export default SettingRightProfile;