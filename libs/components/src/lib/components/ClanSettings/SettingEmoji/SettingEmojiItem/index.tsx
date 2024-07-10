import { ChangeEvent, useState } from "react";

type SettingEmojiItemProp = {
  author: string,
}

const SettingEmojiItem = ({ author }: SettingEmojiItemProp) => {
  const [nameEmoji, setNameEmoji] = useState<string>("__");
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const handleChangeEmojiName = (e: ChangeEvent<HTMLInputElement>) => {
    setNameEmoji(e.target.value);
  }
  return (
    <div className={'flex flex-row w-full max-w-[700px] pr-5 relative h-[65px]  hover:bg-[#f9f9f9] dark:hover:bg-transparent'} onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
      <div className="w-full h-full flex flex-row shadow-emoji_item dark:shadow-emoji_item_dark items-center">

        <div className={'w-14 h-8'}>
          <div className={'w-8 h-8 overflow-hidden flex items-center justify-center '}>
            <img className={'w-full h-auto object-cover'} src="https://motgame.vn/stores/news_dataimages/motgamevn/062023/30/05/hina-nu-cosplayer-noi-tieng-han-quoc-khien-bao-nguoi-me-met-nhan-lam-vo-la-ai-50-.6566.jpg" />
          </div>
        </div>

        <div className={'flex-1 relative'}>
          <div className={'h-[26px] px-1 w-fit relative before:absolute after:absolute before:content-[":"] before:text-gray-400 after:content-[":"] after:text-gray-400 before:left-[-3px] after:right-[-3px]'}>
            {nameEmoji}
          </div>
          {
            showEdit &&
            <input className={` dark:bg-channelTextarea bg-channelTextareaLight dark:text-white text-black animate-faded_input h-[26px] top-0 ml-[2px] outline-none pl-2 absolute rounded-[3px]  dark:text-white text-black`} value={nameEmoji} onChange={(e) => handleChangeEmojiName(e)} />
          }
        </div>

        <div className={'flex-1 flex gap-[6px]'}>
          <div className={'w-6 h-6 flex rounded-[50%] overflow-hidden flex items-center justify-center'}>
            <img className={'w-full h-auto object-cover'} src="https://64.media.tumblr.com/204861b8de03c6826f4b08e898256ee3/a62e949d921cdb7f-8b/s1280x1920/fa655ae1bb2bcfd1b72a4605af853aa6a7ef9c49.jpg" />
          </div>
          <p className={'text-sm h-auto leading-6'}>
            {author}
          </p>
        </div>

        {
          showEdit &&
          <button className="dark:border-black dark:shadow-[#000000] bg-white dark:bg-transparent text-red-600 shadow-emoji_item-delete absolute text-xs font-bold w-6 h-6 top-[-12px] right-[-12px] flex items-center justify-center rounded-[50%]">
            X
          </button>
        }

      </div>
    </div>
  )
}

export default SettingEmojiItem;
