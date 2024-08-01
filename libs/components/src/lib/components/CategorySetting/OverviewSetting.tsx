import React, {useMemo, useState} from "react";
import {ICategory, ValidateSpecialCharacters} from "@mezon/utils";
import ModalSaveChanges from "../ClanSettings/ClanSettingOverview/ModalSaveChanges";
import {categoriesActions, selectCurrentClan, useAppDispatch} from "@mezon/store";
import {useSelector} from "react-redux";
import {ApiUpdateCategoryDescRequest} from "mezon-js/api.gen";

interface IOverViewSettingProps {
  category: ICategory | null;
}

const OverviewSetting: React.FC<IOverViewSettingProps> = ({category}) => {
  const [categoryName, setCategoryName] = useState (category?.category_name || '');
  const [checkValidate, setCheckValidate] = useState(!ValidateSpecialCharacters().test(categoryName));
  const hasChanges = useMemo(() => {
    return categoryName !== category?.category_name;
  }, [categoryName])
  const dispatch = useAppDispatch();
  const currentClan = useSelector(selectCurrentClan);
  
  
  const handleChangeCategoryName = (categoryName: string) => {
    setCategoryName(categoryName);
    
    const regex = ValidateSpecialCharacters();
    
    if (categoryName.length === 0 || categoryName.length === 64 || !regex.test(categoryName)) {
      setCheckValidate(true);
    } else {
      setCheckValidate(false);
    }
  }
  
  const handleSave = () => {
    const request: ApiUpdateCategoryDescRequest = {
      category_id: category?.category_id || '',
      category_name: categoryName,
    }
    dispatch(categoriesActions.updateCategory({
      clanId: currentClan?.clan_id || '',
      request: request
    }))
  }
  
  const handleReset = () => {
    setCategoryName(category?.category_name || '');
  }
  
  return (
    <>
      <div className="flex flex-1 flex-col">
        <h3 className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">Category Name</h3>
        <div className="w-full">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => handleChangeCategoryName(e.target.value)}
            className="dark:text-[#B5BAC1] text-textLightTheme outline-none w-full h-10 p-[10px] dark:bg-bgInputDark bg-bgLightModeThird text-base rounded placeholder:text-sm"
            placeholder="Support has arrived!"
            maxLength={Number(process.env.NX_MAX_LENGTH_NAME_ALLOWED)}
          />
        </div>
        {checkValidate && (
          <p className="text-[#e44141] text-xs italic font-thin">
            Please enter a valid channel name (max 64 characters, only words, numbers, _ or -).
          </p>
        )}
      </div>
      
      {hasChanges && <ModalSaveChanges onSave={handleSave} onReset={handleReset} />}
    </>
  )
}

export default OverviewSetting;