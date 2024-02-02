import React, { useState } from "react";
import SettingRightClanEdit from "./settingUserClanProfileEdit";
import { useChat, useClans } from "@mezon/core";
const SettingRightClan = ({
  onUserProfileClick,
}: {
  onUserProfileClick?: () => void;
}) => {
  const { clans ,currentClan } = useClans();
  // const { currentClan } = useChat()
  const [flagOption, setFlagOption] = useState(false);
  const [selectedClanId, setSelectedClanId] = useState<string | undefined>(
    currentClan ? currentClan.id : undefined,
  );
  const handleUserProfileButtonClick = () => {
    if (onUserProfileClick) {
      onUserProfileClick();
    }
  };
  const handleClanChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedClanId(event.target.value);
  };
  // console.log("currentClan: ", currentClan)
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
            {" "}
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
      <SettingRightClanEdit
        flagOption={flagOption}
        setFlagOptionsTrue={() => setFlagOption(true)}
        setFlagOptionsfalse={() => setFlagOption(false)}
        clanId={selectedClanId || ""}
      />
    </div>
  );
};
export default SettingRightClan;
