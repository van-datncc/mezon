import SettingEmojiList from "./SettingEmojiList";


const SettingEmoji = () => {
  return (
    <>
      <div className={'dark:text-textSecondary text-textSecondary800'}>
        <p className={''}>Add up to 250 custom emoji that anyone can use in this server. Animated GIF emoji may be used by members with Mezon Nitro</p>
        <p className={'uppercase'}>Upload requirements</p>
        <ul className={"list-disc"}>
          <li>File type: JPEG, PNG, GIF</li>
          <li>Recommended file size: 256 KB (We'll compress for you)</li>
          <li>Recommended dimensions: 128x128</li>
          <li>Naming: Emoji names must be at least 2 characters long and can only contain alphanumeric characters and underscores</li>
        </ul>
      </div>
      <SettingEmojiList title={"Emoji"}/>
      <SettingEmojiList title={"Emoji Animated"}/>

    </>

  )
}

export default SettingEmoji;
