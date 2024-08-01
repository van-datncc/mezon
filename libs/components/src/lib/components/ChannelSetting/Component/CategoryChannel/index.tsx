import { CategoriesEntity, channelsActions, selectAllCategories, useAppDispatch } from "@mezon/store";
import { Icons } from "@mezon/ui";
import { IChannel } from "@mezon/utils";
import { Dropdown } from "flowbite-react";
import { ApiUpdateChannelDescRequest } from "mezon-js";
import { useSelector } from "react-redux";
import ItemPanel from "../../../PanelChannel/ItemPanel";

export type CategoryChannelProps = {
  channel: IChannel;
};
const SettingCategoryChannel = (props: CategoryChannelProps) => {
  const { channel } = props;
  const listCategory = useSelector(selectAllCategories);
  const channelID = channel.channel_id;
  const channelLabel = channel.channel_label;
  const dispatch = useAppDispatch();

  const handleMoveChannelToNewCategory = async (category: CategoriesEntity) => {
    const updateChannel: ApiUpdateChannelDescRequest = {
      category_id: category.id,
      channel_id: channelID ?? '',
      channel_label: channelLabel
    }
    await dispatch(channelsActions.updateChannel(updateChannel))
  }

  return (
    <div className="overflow-y-auto flex flex-col flex-1 shrink dark:bg-bgPrimary bg-bgLightModeSecond w-1/2 pt-[94px] pb-7 pr-[10px] pl-[40px] overflow-x-hidden min-w-[700px] 2xl:min-w-[900px] max-w-[740px] hide-scrollbar">
      <div className="dark:text-white text-black text-[15px] flex flex-col gap-4">
        <h3 className="font-bold">Category</h3>

        <p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase">Channel name</p>
        <div className="dark:bg-black bg-white pl-3 py-2 w-full border-0 outline-none rounded">{channel.channel_label}</div>
        <p className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mt-4">Category</p>
        <Dropdown
          trigger="click"
          dismissOnClick={false}
          renderTrigger={() => (
            <div className="w-full h-12 rounded-md dark:bg-black bg-white flex flex-row px-3 justify-between items-center">
              <p>{channel.category_name}</p>
              <div><Icons.ArrowDownFill /></div>
            </div>
          )}
          label=""
          placement="bottom-start"
          className="dark:bg-black bg-white border-none ml-[3px] py-[6px] px-[8px] w-[200px]"
        >
          {
            listCategory.map((category) => {
              if (category.id !== channel.category_id) {
                return <ItemPanel key={category.id} children={category.category_name ?? ''} onClick={() => handleMoveChannelToNewCategory(category)} />
              }
            })
          }

        </Dropdown>

      </div>
    </div>
  );
};

export default SettingCategoryChannel;
