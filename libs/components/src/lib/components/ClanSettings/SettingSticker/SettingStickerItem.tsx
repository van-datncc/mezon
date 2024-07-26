import { ISticker } from ".";
import { Icons } from "../../../components";


type SettingEmojiListProps = {
  deleteSticker: (sticker: ISticker) => void;
  updateSticker: (sticker: ISticker) => void;
  sticker: ISticker
};

const SettingStickerItem = ({ sticker, deleteSticker, updateSticker }: SettingEmojiListProps) => {

  const handleDeleteSticker = () => {
    // deleteSticker("Tran Truong Anh")
  }
  const handleUpdateSticker = () => {
    updateSticker(sticker);
  }
  return (
    <div className={'group relative text-xs w-[116px] h-[140px] rounded-lg flex flex-col items-center p-3 dark:hover:bg-bgTertiary dark:bg-bgSecondary bg-bgLightSecondary justify-between'}>
      <div className="aspect-square h-[72px] overflow-hidden flex justify-center">
        <img className={' w-auto h-full object-cover select-none'} src={sticker.source} />
      </div>
      <p className="font-semibold dark:text-white text-textPrimaryLight">{sticker.shortname}</p>
      <div className="flex items-end justify-center gap-1">
        <img className="w-4 h-4 rounded-full select-none" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgnNdXDM9Kin6VK57sYws5OIMgF3ce5RnohnndjQjq_GK0ApAf1iBGUSBaKm1dA-bjEEdu12DYne_l-3-CP7mzG9pT3cEm4AIi5nah3VU64_5te4j6-JskZokirmduxk3X0bmYInmEMcSvqIKFF6r5nEMEXbKS_FwgvQndGWfEDzlyz4zje9ITsyLUd/s1457/37-anya-forger-menoleh.jpg" />
        <p className="dark:text-white text-textPrimaryLight">.anyabunny</p>
      </div>
      <div className="group-hover:flex absolute flex-col right-[-12px] top-[-12px] gap-1 hidden select-none">
        <button onClick={handleUpdateSticker} className="aspect-square w-6 rounded-full text-textPrimaryLight dark:text-textPrimary bg-bgLightModeSecond hover:bg-bgLightModeThird  dark:bg-bgSecondary600 dark:hover:bg-bgSurface flex items-center justify-center shadow-sm"><Icons.EditMessageRightClick defaultSize="w-3 h-3" /></button>
        <button onClick={handleDeleteSticker} className="aspect-square w-6 text-sm rounded-full bg-bgLightModeSecond hover:bg-bgLightModeThird dark:bg-bgSecondary600 dark:hover:bg-bgSurface flex items-center justify-center mb-[1px] font-medium text-red-600 shadow-sm">x</button>
      </div>
    </div>
  )
}

export default SettingStickerItem;
