import SettingItem from '../../../../../../libs/components/src/lib/components/SettingProfile/SettingLeft';
import SettingProfile from '../../../../../../libs/components/src/lib/components/SettingProfile/SettingRightProfile';
import ExitSetting from '../../../../../../libs/components/src/lib/components/SettingProfile/Exitseting';
import SettingAccount from '../../../../../../libs/components/src/lib/components/SettingAccount';
import { useChat } from '@mezon/core';
import React, { useState } from 'react';
import FooterProfile from '../../../../../../libs/components/src/lib/components/FooterProfile';

export type ModalSettingProps = {
  open: boolean;
  onClose: () => void;
};

const Setting = (props: ModalSettingProps) => {
  const { open, onClose } = props;
  const [currentSetting, setCurrentSetting] = useState<string>('Account');
  const handleSettingItemClick = (settingName: string) => {
    setCurrentSetting(settingName);
  };

  return (
    <>
      {open ? (
        <div className="  flex fixed inset-0  w-screen">
          <div className="flex text-gray- w-screen">
            <SettingItem onItemClick={handleSettingItemClick} />
            {currentSetting === 'Account' && <SettingAccount />}
            {currentSetting === 'Profiles' && <SettingProfile />}
            <ExitSetting onClose={onClose} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Setting;
