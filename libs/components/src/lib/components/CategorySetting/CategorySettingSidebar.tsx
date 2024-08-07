import { categorySettingList, ItemObjProps } from "../ClanSettings/ItemObj";
import SettingItem from "../ClanSettings/SettingItem";

interface ICategorySettingSidebarProps {
  onClickItem: (settingItem: ItemObjProps) => void;
  handleMenu: (value: boolean) => void;
  currentSetting: ItemObjProps;
  setIsShowDeletePopup: () => void;
  categoryName: string;
}

const CategorySettingSidebar: React.FC<ICategorySettingSidebarProps> = ({ onClickItem, handleMenu, setIsShowDeletePopup, currentSetting, categoryName}) => {
  const handleClickButtonSidebar = (setting: ItemObjProps) => {
    onClickItem(setting);
  }
  
  return (
    <>
      <div className="flex flex-row flex-1 justify-end">
        <div className="w-[220px] py-[60px] pl-5 pr-[6px]">
          <p className="text-[#84ADFF] pl-[10px] pb-[6px] font-bold text-sm tracking-wider uppercase truncate">{categoryName}</p>
          {categorySettingList.map((settingItem) => (
              <SettingItem
                key={settingItem.id}
                name={settingItem.name}
                active={currentSetting.id === settingItem.id}
                onClick={() => handleClickButtonSidebar(settingItem)}
                handleMenu={handleMenu}
              />
          ))}
          <div className={"border-t-[0.08px] dark:border-borderDividerLight border-bgModifierHoverLight"}>
            <button
              className={`mt-[5px] text-red-500 w-full py-1 px-[10px] mb-1 text-[16px] font-medium rounded text-left dark:hover:bg-bgHover hover:bg-bgModifierHoverLight `}
              onClick={setIsShowDeletePopup}
            >
              Delete Category
            </button>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default CategorySettingSidebar