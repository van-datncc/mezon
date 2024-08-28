import { useAppNavigation, useCategory } from "@mezon/core";
import { categoriesActions, useAppDispatch } from "@mezon/store";
import { ICategoryChannel } from "@mezon/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categorySettingList, ItemObjProps } from "../ClanSettings/ItemObj";
import SettingItem from "../ClanSettings/SettingItem";
import ModalConfirm from "../ModalConfirm";

interface ICategorySettingSidebarProps {
  onClickItem: (settingItem: ItemObjProps) => void;
  handleMenu: (value: boolean) => void;
  currentSetting: ItemObjProps;
  setIsShowDeletePopup: () => void;
  category: ICategoryChannel;
}

const CategorySettingSidebar: React.FC<ICategorySettingSidebarProps> = ({ onClickItem, handleMenu, setIsShowDeletePopup, currentSetting, category }) => {
  const [showModal, setShowModal] = useState(false);
  const { categorizedChannels } = useCategory();
  const { toChannelPage, toMembersPage } = useAppNavigation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClickButtonSidebar = (setting: ItemObjProps) => {
    onClickItem(setting);
  }

  const handleDeleteCategory = () => {
    setShowModal(true);
  };

  const confirmDeleteCategory = async () => {
    await dispatch(categoriesActions.deleteCategory({ clanId: category.clan_id as string, categoryId: category.id as string }));
    const targetIndex = categorizedChannels.findIndex((obj) => obj.category_id === category.id);

    let channelNavId = '';
    if (targetIndex !== -1) {
      if (targetIndex === 0) {
        channelNavId = categorizedChannels[targetIndex + 1]?.channels[0]?.id;
        if (!channelNavId) {
          const clanPath = toMembersPage(category.clan_id ?? '');
          navigate(clanPath);
        }
      } else if (targetIndex === categorizedChannels.length - 1) {
        channelNavId = categorizedChannels[targetIndex - 1]?.channels[0]?.id;
      } else {
        channelNavId = categorizedChannels[targetIndex - 1]?.channels[0]?.id;
      }
    }

    if (channelNavId && category.clan_id) {
      const channelPath = toChannelPage(channelNavId ?? '', category.clan_id ?? '');
      navigate(channelPath);
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-row flex-1 justify-end">
        <div className="w-[220px] py-[60px] pl-5 pr-[6px]">
          <p className="text-[#84ADFF] pl-[10px] pb-[6px] font-bold text-sm tracking-wider uppercase truncate">{category.category_name}</p>
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
              onClick={handleDeleteCategory}
            >
              Delete Category
            </button>
          </div>
          {showModal && (
            <ModalConfirm
              handleCancel={() => setShowModal(false)}
              modalName={category?.category_name || ''}
              handleConfirm={confirmDeleteCategory}
              title='delete'
              buttonName='Delete category'
              message='This cannot be undone'
              customModalName='Category'
            />
          )}
        </div>
      </div>
    </>
  )
}

export default CategorySettingSidebar