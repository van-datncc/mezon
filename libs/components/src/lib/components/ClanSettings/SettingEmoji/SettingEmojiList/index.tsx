import SettingEmojiItem from "../SettingEmojiItem";
type SettingEmojiListProps = {
  title: string;

};

const SettingEmojiList = ({ title }: SettingEmojiListProps) => {
  return (
    <div className={'flex flex-col gap-4 dark:text-textDarkTheme text-textLightTheme'}>
      <h2 className="text-base font-bold">
        {title} - 2 slots available
      </h2>
      <div className={'flex flex-row w-full dark:text-textSecondary text-textSecondary800'}>
        <p className={'w-14 h-8 text-xs font-bold '}>
          IMAGE
        </p>
        <p className={'flex-1 relative text-xs font-bold'}>
          NAME
        </p>
        <p className={'flex-1 flex text-xs font-bold'}>
          UPLOADED BY
        </p>
      </div>
      <div className={'flex flex-col w-full'}>
        <SettingEmojiItem />
        <SettingEmojiItem />

        <SettingEmojiItem />

        <SettingEmojiItem />

        <SettingEmojiItem />


      </div>
    </div>
  )
}

export default SettingEmojiList;
