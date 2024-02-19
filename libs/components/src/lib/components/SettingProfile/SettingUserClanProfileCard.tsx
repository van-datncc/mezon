import React, { useState, useEffect, ChangeEvent } from 'react';
import { InputField, Modal } from '@mezon/ui';
import { IClan, IClanProfile } from '@mezon/utils';
import { ApiClanProfile } from '@mezon/mezon-js/dist/api.gen';
import { useAuth, useClanProfileSetting } from '@mezon/core';
import { string } from 'yup';
export type Profilesform = {
    displayName: string,
    urlImage:string
  };
  export type propProfilesform = {
    profiles : Profilesform;
  };
const SettingUserClanProfileCard = (props: propProfilesform)  => {
    const { userProfile } = useAuth();
    const { profiles } = props;
    
  return (
    <div className="bg-black h-[542px] ml-[30px] mt-[10px]  rounded-[20px] flex flex-col relative">
          <div className="h-1/6 bg-green-500 rounded-tr-[10px] rounded-tl-[10px]"></div>
          <div className="text-black ml-[50px]">
            {profiles.urlImage === undefined || profiles.urlImage === ''? (
              <div className="w-[100px] h-[100px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[50px] mt-[-50px] ml-[-25px]">
                {userProfile?.user?.username?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={profiles.urlImage}
                alt=""
                className="w-[100px] h-[100px] rounded-[50px] bg-bgSecondary mt-[-50px] ml-[-25px]"
              />
            )}
          </div>
          <div className='px-[12px]'>
            <div className="bg-bgSecondary w-full px-[10px] py-[10px] mt-[20px] rounded-[20px]">
              <div className="w-[300px] mt-[16px] ml-[16px]">
                <p className="text-xl font-medium">{profiles.displayName}</p>
                <p>{userProfile?.user?.username}</p>
              </div>
              <div className="w-full mt-[50px] ml-[16px]">
                <p>CUSTOMIZING MY PROFILE</p>
                <div className="flex">
                  <img
                    src="https://i.postimg.cc/3RSsTnbD/3d63f5caeb33449b32d885e5aa94bbbf.jpg"
                    alt=""
                    className="w-[100px] h-[100px] rounded-[8px] mt-[16px]"
                  />
                  <div className="mt-[40px] ml-[20px]">
                    <p>User Profile</p>
                    <p></p>
                  </div>
                </div>
              </div>
              <div className="w-full mt-[40px] items-center">
                <button className="w-5/6 h-[50px] ml-[30px] bg-black rounded-[8px]">
                  Example button
                </button>
              </div>
            </div>

          </div>
        </div>
    
  );
};
export default SettingUserClanProfileCard;
