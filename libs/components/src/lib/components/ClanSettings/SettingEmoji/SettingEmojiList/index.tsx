import { ApiClanEmojiListResponse } from "mezon-js/api.gen";
import SettingEmojiItem from "../SettingEmojiItem";

type SettingEmojiListProps = {
  title: string;
  emojiList: ApiClanEmojiListResponse[]
};

const SettingEmojiList = ({ title, emojiList }: SettingEmojiListProps) => {

  return (
    <div className={'flex flex-col gap-3 dark:text-textDarkTheme text-textLightTheme pb-[60px]'}>
      <h2 className="text-base font-bold">
        {title} - {250 - emojiList.length} slots available
      </h2>
      <div className={'flex items-center flex-row w-full dark:text-textSecondary text-textSecondary800'}>
        <p className={'w-14 text-xs font-bold '}>
          IMAGE
        </p>
        <p className={'flex-1 text-xs font-bold'}>
          NAME
        </p>
        <p className={'flex-1 flex text-xs font-bold'}>
          UPLOADED BY
        </p>
      </div>
      <div className={'flex flex-col w-full'}>
        {emojiList.map((emoji, index) => (
          <SettingEmojiItem emoji={emoji} key={index}/>
        ))}
      </div>
    </div>
  )
}

export default SettingEmojiList;
