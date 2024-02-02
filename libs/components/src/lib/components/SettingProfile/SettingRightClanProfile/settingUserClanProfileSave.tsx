import React, { useState, useEffect, ChangeEvent } from 'react';
import { InputField, Modal } from '@mezon/ui';
import { IClan, IClanProfile } from '@mezon/utils';
import { ApiClanProfile } from '@mezon/mezon-js/dist/api.gen';
import { useAuth, useClanProfileSetting } from '@mezon/core';
import { string } from 'yup';

  export type ModalSettingSave = {
    flagOption: boolean;
    handleClose: () => void;
    handlSaveClose: () => void;
    handleUpdateUser: () => void;
  };
  export type PropsModalSettingSave = {
    PropsSave: ModalSettingSave;
  };
const SettingUserClanProfileSave = (props: PropsModalSettingSave)  => {
    const { PropsSave} = props;
  return (
    <>
    {PropsSave.flagOption ? (
        <div className="flex items-center w-1/2 h-[50px] mt-[-90px] bg-gray-500 rounded-[8px] z-10 fixed top-[890px] pl-[20px] pr-[20px]">
          <p>Carefull - you have unsaved changes!</p>
          <button
            className="ml-[450px] bg-gray-600 rounded-[8px] p-[8px]"
            onClick={() => {
                PropsSave.handleClose();
            }}
          >
            Reset
          </button>
          <button
            className="ml-auto bg-blue-600 rounded-[8px] p-[8px]"
            onClick={() => {
                PropsSave.handlSaveClose();
                PropsSave.handleUpdateUser();
            }}
          >
            Save Changes
          </button>
        </div>
      ) : null}
    </>
  );
};
export default SettingUserClanProfileSave;
