import React, { useEffect, useMemo, useState } from "react";
import { InputField } from "@mezon/ui";
import SettingRightClanCard, {
  Profilesform,
} from "../SettingUserClanProfileCard";
import { useAuth, useClanProfileSetting } from "@mezon/core";
import {
  UserClanProfileEntity,
  selectUserClanProfileByClanID,
} from "@mezon/store";
import { useSelector } from "react-redux";
import SettingUserClanProfileSave, {
  ModalSettingSave,
} from "./settingUserClanProfileSave";

const SettingRightClanEdit = ({
  flagOption,
  setFlagOptionsTrue,
  setFlagOptionsfalse,
  clanId,
}: {
  flagOption: boolean;
  setFlagOptionsTrue?: () => void;
  setFlagOptionsfalse?: () => void;
  clanId: string;
}) => {
  const { userProfile } = useAuth();
  // console.log("clanId: ", clanId)

  const userClansProfile = useSelector(
    selectUserClanProfileByClanID(clanId || "", userProfile?.user?.id || ""),
  );
  const [draftProfile, setDraftProfile] = useState(userClansProfile);
  const setUrlImage = (url_image: string) => {
    setDraftProfile((prevState) => {
      if (!prevState) {
        return prevState;
      }
      return {
        ...prevState,
        url_image,
      };
    });
  };
  const setDisplayName = (nick_name: string) => {
    setDraftProfile((prevState) => {
      if (!prevState) {
        return prevState;
      }
      return {
        ...prevState,
        nick_name,
      };
    });
  };
  
  const editProfile = useMemo<Profilesform> (() => {
      const profileVaile = {
          displayName: userProfile?.user?.username || "",
          urlImage: userProfile?.user?.avatar_url || ''
        }
        if (draftProfile?.nick_name ) {
            profileVaile.displayName = draftProfile?.nick_name
        }
        if (draftProfile?.avartar ) {
            profileVaile.urlImage = draftProfile.avartar
        }
        return profileVaile
    },[draftProfile, userProfile]);
    console.log("editProfile: ", editProfile)
    console.log("draftProfile: ", draftProfile)
    const {displayName, urlImage} = editProfile; 

  const { updateUserClanProfile } = useClanProfileSetting({ clanId });

  const handleFile = (e: any) => {
    const fileToStore: File = e.target.files[0];
    setUrlImage(URL.createObjectURL(fileToStore));
  };
  const handleDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleRemoveButtonClick = () => {
    setFlagOptionsTrue?.();
    setUrlImage(userProfile?.user?.avatar_url||'');
  };

//   useEffect(() => {
//     if (userClansProfile?.nick_name !== undefined) {
//       if (displayName !== userClansProfile.nick_name) {
//         setFlagOptionsTrue?.();
//       } else {
//         setFlagOptionsfalse?.();
//       }
//     } else {
//       if (displayName !== userProfile?.user?.username) {
//         setFlagOptionsTrue?.();
//       } else {
//         setFlagOptionsfalse?.();
//       }
//     }
//   }, [displayName, userClansProfile]);
//   useEffect(() => {
//     if (userClansProfile?.avartar !== undefined) {
//       if (urlImage !== userClansProfile.avartar) {
//         setFlagOptionsTrue?.();
//       } else {
//         setFlagOptionsfalse?.();
//       }
//     } else {
//       if (urlImage !== userProfile?.user?.avatar_url) {
//         setFlagOptionsTrue?.();
//       } else {
//         setFlagOptionsfalse?.();
//       }
//     }
//   }, [urlImage, userClansProfile]);

  const handleClose = () => {
    if (
      userClansProfile?.nick_name !== undefined ||
      userClansProfile?.avartar !== undefined
    ) {
      setDisplayName(userClansProfile.nick_name || "");
      setUrlImage(userClansProfile.avartar || "");
    } else {
      setDisplayName(userProfile?.user?.username||'');
      setUrlImage(userProfile?.user?.avatar_url||'');
    }
    setFlagOptionsTrue?.();
  };
  const handlSaveClose = () => {
    setFlagOptionsfalse?.();
  };
  const handleUpdateUser = async () => {
    if (urlImage || displayName) {
      await updateUserClanProfile(
        userClansProfile?.clan_id || "",
        displayName || "",
        urlImage || "",
      );
    }
  };
  const saveProfile: ModalSettingSave = {
    flagOption: flagOption,
    handleClose,
    handlSaveClose,
    handleUpdateUser,
  };
  return (
    <>
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
        </div>
        <div className="w-1/2 text-white">
          <p className="ml-[30px] mt-[30px]">PREVIEW</p>
          <SettingRightClanCard profiles={editProfile} />
        </div>
      </div>
      <SettingUserClanProfileSave PropsSave={saveProfile} />
    </>
  );
};
export default SettingRightClanEdit;
