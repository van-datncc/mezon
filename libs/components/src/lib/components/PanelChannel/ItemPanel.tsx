import { Checkbox, Radio } from 'flowbite-react';
import * as Icons from '../../../../../ui/src/lib/Icons';
import {notificationSettingActions, selectCurrentChannelId, selectCurrentClanId, useAppDispatch} from "@mezon/store";
import {useSelector} from "react-redux";

type ItemPanelProps = {
	children: string;
	dropdown?: string;
	danger?: boolean;
	type?: 'radio' | 'checkbox' | 'none';
	onClick?: () => void;
  notificationId?: string;
  defaultNotifi?: boolean;
  notifiSelected?: boolean;
  name?: string;
  muteTime?: string;
  defaultNotifiName?: string;
};

const ItemPanel = ({ children, dropdown, type, danger, onClick, notificationId, defaultNotifi, notifiSelected, name, muteTime, defaultNotifiName }: ItemPanelProps) => {
  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentClanId = useSelector(selectCurrentClanId);
  const dispatch = useAppDispatch();
  
  const setNotification = () => {
    if (defaultNotifi) {
      dispatch(notificationSettingActions.deleteNotiChannelSetting({ channel_id: currentChannelId || '', clan_id: currentClanId || '' }));
    } else {
      const body = {
        channel_id: currentChannelId || '',
        notification_type: notificationId || '',
        clan_id: currentClanId || '',
      };
      dispatch(notificationSettingActions.setNotificationSetting(body));
    }
  };
  
	return (
		<button
			onClick={onClick}
			className={`flex flex-col justify-center w-full rounded-sm hover:[&>*]:text-[#fff] pr-2 ${danger ? 'hover:bg-colorDanger' : 'hover:bg-bgSelectItem'}`}
		>
      <div className={'flex flex-row items-center justify-between w-full'}>
        <li
          className={`text-[14px] ${danger ? 'dark:text-colorDanger text-colorDanger' : 'dark:text-[#B5BAC1] text-textSecondary800'} dark:text-[#B5BAC1] text-colorTextLightMode font-medium w-full py-[6px] px-[8px] text-left cursor-pointer list-none textWhiteHoverImportant m-0`}
        >
          {children}
        </li>
        {dropdown && <Icons.RightIcon defaultFill="#fff" />}
        {type === 'checkbox' && <Checkbox id="accept" defaultChecked />}
        {type === 'radio' && <Radio className="" name={name} value="change here" onClick={setNotification} defaultChecked={notifiSelected}/>}
      </div>
      {defaultNotifi && <div className="text-[12px] text-[#B5BAC1] ml-[10px]">{defaultNotifiName}</div>}
      {muteTime != '' && <div className="text-[12px] text-[#B5BAC1] ml-[10px]">{muteTime}</div>}
    </button>
	);
};

export default ItemPanel;
