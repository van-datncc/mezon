import { createAsyncThunk } from "@reduxjs/toolkit";
import SettingEmojiList from "./SettingEmojiList";
import { IUserAccount } from "@mezon/utils";
import { ensureSession, getMezonCtx } from "libs/store/src/lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { AppDispatch, selectAllEmoji, selectCurrentClanId, settingClanEmojiActions, useAppDispatch } from "@mezon/store";

const SettingEmoji = () => {
  const dispatch = useAppDispatch();
  const currentClanId = useSelector(selectCurrentClanId) ?? '';
  
  const emojiList = useSelector(selectAllEmoji);
  console.log(emojiList);
  
  const fetchEmojis = useCallback(async () => {
    if (currentClanId) {
      await dispatch(settingClanEmojiActions.fetchEmojisByClanId({ clanId: currentClanId }));
    }
  }, [dispatch, currentClanId]);
  
  useEffect(() => {
    fetchEmojis();
  }, [fetchEmojis]);
  
  return (
    <>
      
      <div className="flex flex-col gap-3 pb-[40px] dark:text-textSecondary text-textSecondary800 text-sm">
        <div className={'dark:text-textSecondary flex flex-col gap-2 text-textSecondary800'}>
          <p className={''}>Add up to 250 custom emoji that anyone can use in this server. Animated GIF emoji may be used by members with Mezon Nitro</p>
          <p className={'uppercase text-xs'}>Upload requirements</p>
          <ul className={"list-disc ml-[16px]"}>
            <li>File type: JPEG, PNG, GIF</li>
            <li>Recommended file size: 256 KB (We'll compress for you)</li>
            <li>Recommended dimensions: 128x128</li>
            <li>Naming: Emoji names must be at least 2 characters long and can only contain alphanumeric characters and underscores</li>
          </ul>
        </div>
        <div className="h-[38px] font-semibold rounded bg-[#3297ff] text-[#ffffff] w-28 relative flex flex-row items-center justify-center hover:bg-[#2b80d7]">
          Upload emoji
          <input className="absolute w-full h-full cursor-pointer z-10 opacity-0 file:cursor-pointer" type="file" title=" " tabIndex={0} multiple accept=".jpg,.jpeg,.png,.gif" ></input>
        </div>
      </div>
      
      <SettingEmojiList title={"Emoji"} emojiList={emojiList.staticEmoji}/>
      <SettingEmojiList title={"Emoji Animated"} emojiList={emojiList.animatedEmoji}/>
    </>
  )
}

export default SettingEmoji;
