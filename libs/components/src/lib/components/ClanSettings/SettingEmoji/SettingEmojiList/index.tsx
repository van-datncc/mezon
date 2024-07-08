import SettingEmojiItem from "../SettingEmojiItem";


const SettingEmojiList = () => {
  return (
    <div className={'flex flex-col items-center gap-6'}>
      <div className={'flex flex-row w-full'}>
        <p className={'w-14 h-8'}>
            Hình Ảnh
        </p>
        <p className={'flex-1 relative'}>
            Tên
        </p>
        <p className={'flex-1 flex'}>
            Tải Lên Bởi
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
