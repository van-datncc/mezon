import React, { useState, useEffect, ChangeEvent } from 'react';
import { InputField, Modal } from '@mezon/ui';
import { IClan, IClanProfile } from '@mezon/utils';
import { ApiClanProfile } from '@mezon/mezon-js/dist/api.gen';
import { useChat } from '@mezon/core';
const SettingRightClan = ({
  onUserProfileClick,
  currentClan,
  userClansProfile,
  clans,
  name,
  avatar,
  nameDisplay,
}: {
  onUserProfileClick?: () => void;
  currentClan: string;
  userClansProfile: IClanProfile;
  clans: IClan[];
  name: string;
  avatar: string;
  nameDisplay: string;
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [flagsRemoveAvartar, setFlagsRemoveAvartar] = useState(false);
  const [displayName, setDisplayName] = useState(
    userClansProfile.nick_name ? userClansProfile.nick_name : name,
  );
  const [urlImage, setUrlImage] = useState(
    userClansProfile.avartar ? userClansProfile.avartar : avatar,
  );
  const [flagOption, setFlagOption] = useState(false);
  const [selectedClanId, setSelectedClanId] = useState<string | undefined>(
    currentClan,
  );
  const { getUserClanProfile, updateUserClanProfile } = useChat();
  useEffect(() => {
    setDisplayName(userClansProfile.nick_name || name);
  }, [userClansProfile]);

  const handleFile = (e: any) => {
    const fileToStore: File = e.target.files[0];
    setUrlImage(URL.createObjectURL(fileToStore));
  };
  const handleUserProfileButtonClick = () => {
    if (onUserProfileClick) {
      onUserProfileClick();
    }
  };
  const handleUpdateUser = async () => {
    if (urlImage || displayName) {
      await updateUserClanProfile(
        userClansProfile.clan_id || '',
        displayName,
        urlImage,
      );
    }
  };
  const handleClose = () => {
    if (
      userClansProfile.nick_name !== undefined ||
      userClansProfile.avartar !== undefined
    ) {
      setDisplayName(userClansProfile.nick_name || '');
      setUrlImage(userClansProfile.avartar || '');
    } else {
      setDisplayName(name);
      setUrlImage(avatar);
    }
    setFlagOption(false);
    setFlagsRemoveAvartar(false);
  };
  const handleDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };
  const handleRemoveButtonClick = () => {
    // setFlagsRemoveAvartar(true);
    setFlagOption(true);
    setUrlImage(avatar);
  };
  const handlSaveClose = () => {
    setFlagOption(false);
  };

  const handleClanChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedClanId(event.target.value);
    await getUserClanProfile(event.target.value);
  };
  console.log(userClansProfile.avartar);
  useEffect(() => {
    if (userClansProfile.avartar) {
      setUrlImage(userClansProfile.avartar);
    } else {
      setUrlImage(avatar);
    }
  }, [userClansProfile.avartar, avatar]);
  useEffect(() => {
    if (userClansProfile.nick_name !== undefined) {
      if (displayName !== userClansProfile.nick_name) {
        setFlagOption(true);
      } else {
        setFlagOption(false);
      }
    } else {
      if (displayName !== name) {
        setFlagOption(true);
      } else {
        setFlagOption(false);
      }
    }
  }, [displayName, userClansProfile]);
  useEffect(() => {
    if (userClansProfile.avartar !== undefined) {
      if (urlImage !== userClansProfile.avartar) {
        setFlagOption(true);
      } else {
        setFlagOption(false);
      }
    } else {
      if (urlImage !== avatar) {
        setFlagOption(true);
      } else {
        setFlagOption(false);
      }
    }
  }, [urlImage, userClansProfile]);
  return (
    <div className="overflow-y-auto flex flex-col flex-1 shrink min-w-0 bg-bgSecondary w-1/2 pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
      <div className="mt-[16px] pl-[90px] text-white">
        <h1 className="text-2xl font-medium">Profiles</h1>
        <button
          className="pt-1 text-white mt-[20px] font-medium text-xl"
          onClick={handleUserProfileButtonClick}
        >
          User Profile
        </button>
        <button className="pt-1 text-white mt-[20px] font-medium text-xl ml-[16px] border-b-2 border-blue-500">
          Clan Profile
        </button>
        <div className="flex mt-[30px]">
          <p>Show who you are with different profiles for each of your clans</p>
          <a href="" className="ml-2 text-blue-500">
            {' '}
            Learn more about Clan Profiles
          </a>
        </div>
        <p className="mt-[20px]">CHOOSE A CLAN</p>
        <select
          name="clan"
          className="block w-full mt-1 bg-black border border-black text-white rounded p-2"
          disabled={flagOption}
          value={selectedClanId}
          onChange={handleClanChange}
        >
          {clans.map((clan) => (
            <option key={clan.id} value={clan.id}>
              {clan.clan_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex mt-[10px] pl-[90px] ">
        <div className="w-1/2 text-white">
          <div className="mt-[20px]">
            <label className="font-normal">CLAN NICKNAME</label>
            <br />
            <InputField
              onChange={handleDisplayName}
              type="text"
              className="rounded-[3px] w-full text-white border border-black px-4 py-2 mt-2 focus:outline-none focus:border-white-500 bg-black"
              placeholder={displayName}
              value={displayName}
              defaultValue={displayName}
            />
          </div>
          <div className="mt-[20px]">
            <p>AVATAR</p>
            <div className="flex">
              <label>
                <div
                  className="w-[130px] bg-blue-600 rounded-[3px] mt-[10px] p-[8px] pr-[10px] pl-[10px]"
                  onChange={(e) => handleFile(e)}
                >
                  Change avatar
                </div>
                <input
                  type="file"
                  onChange={(e) => handleFile(e)}
                  className="block w-full text-sm text-slate-500 hidden"
                />
              </label>
              <button
                className="bg-gray-600 rounded-[3px] mt-[10px] p-[8px] pr-[10px] pl-[10px] ml-[20px]"
                onClick={handleRemoveButtonClick}
              >
                Remove avatar
              </button>
            </div>
          </div>
          {/* <div className="mt-[20px]">
                        <label className="font-normal">PRONOUNS</label>
                        <br />
                        <input type="text"className="rounded-[3px] w-full text-white border border-black px-4 py-2 mt-2 focus:outline-none focus:border-white bg-black"placeholder="Add your pronoun"/>
                    </div> */}
        </div>
        <div className="w-1/2 text-white">
          <p className="ml-[30px] mt-[30px]">PREVIEW</p>
          <div className="bg-black h-[542px] ml-[30px] mt-[10px] rounded-[10px] flex flex-col relative">
            <div className="h-1/6 bg-green-500 rounded-tr-[10px] rounded-tl-[10px]"></div>
            <div className="text-black ml-[50px]">
              {urlImage === undefined ? (
                <div className="w-[100px] h-[100px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[30px] mt-[-50px] ml-[-25px]">
                  {name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <img
                  src={urlImage}
                  alt=""
                  className="w-[100px] h-[100px] rounded-[50px] bg-bgSecondary mt-[-50px] ml-[-25px]"
                />
              )}
            </div>
            <div className="bg-bgSecondary w-[380px] h-2/3 mt-[20px] ml-[15px] rounded-[20px]">
              <div className="w-[300px] mt-[16px] ml-[16px]">
                <p className="text-xl font-medium">{displayName}</p>
                <p>{name}</p>
              </div>
              <div className="w-[300px] mt-[50px] ml-[16px]">
                <p>CUSTOMIZING MY PROFILE</p>
                <div className="flex">
                  <img
                    src="https://i.postimg.cc/3RSsTnbD/3d63f5caeb33449b32d885e5aa94bbbf.jpg"
                    alt=""
                    className="w-[100px] h-[100px] rounded-[8px] mt-[16px]"
                  />
                  <div className="mt-[40px] ml-[20px]">
                    <p>User Profile</p>
                    <p>
                      {String(minutes).padStart(2, '0')}:
                      {String(seconds).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[300px] mt-[40px] ml-[16px]">
                <button className="w-5/6 h-[50px] ml-[30px] bg-black rounded-[8px]">
                  Example button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {flagOption ? (
        //   ||
        //   (displayName !== nameDisplay && flags) ||
        //   (flagsRemoveAvartar !== false && flags)
        <div className="flex items-center w-1/2 h-[50px] mt-[-90px] bg-gray-500 rounded-[8px] z-10 fixed top-[890px] pl-[20px] pr-[20px]">
          <p>Carefull - you have unsaved changes!</p>
          <button
            className="ml-[450px] bg-gray-600 rounded-[8px] p-[8px]"
            onClick={() => {
              handleClose();
            }}
          >
            Reset
          </button>
          <button
            className="ml-auto bg-blue-600 rounded-[8px] p-[8px]"
            onClick={() => {
              handlSaveClose();
              handleUpdateUser();
            }}
          >
            Save Changes
          </button>
        </div>
      ) : null}
      {/* <div className="w-1/3 text-black ml-[50px]">
                    <button className="bg-white w-[30px] h-[30px] rounded-[50px] font-bold">X</button>
                    <p className="text-white mt-[10px]">ESC</p>
                </div> */}
    </div>
  );
};
export default SettingRightClan;
