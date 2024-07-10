import SettingEmojiList from "./SettingEmojiList";


const SettingEmoji = () => {
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
        <div className="h-[38px] rounded bg-[#3297ff] text-[#ffffff] w-28 relative flex flex-row items-center justify-center hover:bg-[#2b80d7]">
            Upload emoji
            <input className="absolute w-full h-full cursor-pointer z-10 opacity-0 file:cursor-pointer" type="file" title=" " tabIndex={0} multiple accept=".jpg,.jpeg,.png,.gif" ></input>
        </div>
      </div>

      <SettingEmojiList title={"Emoji"} />
      <SettingEmojiList title={"Emoji Animated"} />
    </>

  )
}

export default SettingEmoji;
