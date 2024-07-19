import {
  notificationSettingActions,
  selectCurrentChannelId,
  selectCurrentClanId,
  selectDefaultNotificationCategory,
  selectDefaultNotificationClan,
  selectNotifiReactMessage,
  selectnotificatonSelected,
  useAppDispatch, notifiReactMessageActions,
} from '@mezon/store';
import { format } from 'date-fns';
import { Dropdown } from 'flowbite-react';
import { NotificationType } from 'mezon-js';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { notificationTypesList } from "../../../PanelChannel";
import ItemPanel from "../../../PanelChannel/ItemPanel";

const NotificationSetting = () => {
	const getNotificationChannelSelected = useSelector(selectnotificatonSelected);
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentClanId = useSelector(selectCurrentClanId);
	const [nameChildren, setNameChildren] = useState('');
	const [mutedUntil, setmutedUntil] = useState('');
	const defaultNotificationCategory = useSelector(selectDefaultNotificationCategory);
	const defaultNotificationClan = useSelector(selectDefaultNotificationClan);
	const notifiReactMessage = useSelector(selectNotifiReactMessage);
	const [defaultNotifiName, setDefaultNotifiName] = useState('');
	useEffect(() => {
		if (getNotificationChannelSelected?.active === 1) {
			setNameChildren('Mute Channel');
			setmutedUntil('');
		} else {
			setNameChildren('Unmute Channel');
			if (getNotificationChannelSelected?.time_mute) {
				const timeMute = new Date(getNotificationChannelSelected.time_mute);
				const currentTime = new Date();
				if (timeMute > currentTime) {
					const timeDifference = timeMute.getTime() - currentTime.getTime();
					const formattedDate = format(timeMute, 'dd/MM, HH:mm');
					setmutedUntil(`Muted until ${formattedDate}`);

					setTimeout(() => {
						const body = {
							channel_id: currentChannelId || '',
							notification_type: getNotificationChannelSelected?.notification_setting_type || '',
							clan_id: currentClanId || '',
							active: 1,
						};
						dispatch(notificationSettingActions.setMuteNotificationSetting(body));
					}, timeDifference);
				}
			}
		}

		if (defaultNotificationCategory?.notification_setting_type) {
			setDefaultNotifiName(defaultNotificationCategory.notification_setting_type);
		} else if (defaultNotificationClan?.notification_setting_type) {
			setDefaultNotifiName(defaultNotificationClan.notification_setting_type);
		}
	}, [getNotificationChannelSelected, defaultNotificationCategory, defaultNotificationClan]);

	const handleScheduleMute = (duration: number) => {
		if (duration !== Infinity) {
			const now = new Date();
			const unmuteTime = new Date(now.getTime() + duration);
			const unmuteTimeISO = unmuteTime.toISOString();

			const body = {
				channel_id: currentChannelId || '',
				notification_type: getNotificationChannelSelected?.notification_setting_type || '',
				clan_id: currentClanId || '',
				time_mute: unmuteTimeISO,
			};
			dispatch(notificationSettingActions.setNotificationSetting(body));
		} else {
			const body = {
				channel_id: currentChannelId || '',
				notification_type: getNotificationChannelSelected?.notification_setting_type || '',
				clan_id: currentClanId || '',
				active: 0,
			};
			dispatch(notificationSettingActions.setMuteNotificationSetting(body));
		}
	};

	const muteOrUnMuteChannel = (active: number) => {
		const body = {
			channel_id: currentChannelId || '',
			notification_type: getNotificationChannelSelected?.notification_setting_type || '',
			clan_id: currentClanId || '',
			active: active,
		};
		dispatch(notificationSettingActions.setMuteNotificationSetting(body));
	};
  
  const setNotification = (notificationType: string) => {
    if(notificationType) {
      const body = {
        channel_id: currentChannelId || '',
        notification_type: notificationType || '',
        clan_id: currentClanId || '',
      };
      dispatch(notificationSettingActions.setNotificationSetting(body));
    } else {
      dispatch(notificationSettingActions.deleteNotiChannelSetting({ channel_id: currentChannelId || '', clan_id: currentClanId || '' }));
    }
  };
  
  const setNotiReactMess = (isChecked: boolean) => {
    if (isChecked) {
      dispatch(notifiReactMessageActions.setNotifiReactMessage({ channel_id: currentChannelId || '' }));
    } else {
      dispatch(notifiReactMessageActions.deleteNotifiReactMessage({ channel_id: currentChannelId || '' }));
    }
  };

	return (
		<div className="absolute top-8 right-0 shadow z-[99999999]">
			<div className="flex flex-col rounded-[4px] w-[202px] shadow-sm overflow-hidden py-[6px] px-[8px] dark:bg-black bg-white">
				<div className="flex flex-col pb-1 mb-1 border-b-[0.08px] dark:border-b-[#6A6A6A] border-b-[#E1E1E1] last:border-b-0 last:mb-0 last:pb-0">
					{getNotificationChannelSelected?.active === 1 ? (
						<Dropdown
							trigger="hover"
							dismissOnClick={false}
							renderTrigger={() => (
								<div>
									<ItemPanel
										children={nameChildren}
										muteTime={mutedUntil}
										dropdown="change here"
										onClick={() => muteOrUnMuteChannel(0)}
									/>
								</div>
							)}
							label=""
							placement="right-start"
							className="dark:bg-black bg-white border-none ml-[3px] py-[6px] px-[8px] w-[200px]"
						>
							<ItemPanel children="For 15 Minutes" onClick={() => handleScheduleMute(15 * 60 * 1000)} />
							<ItemPanel children="For 1 Hour" onClick={() => handleScheduleMute(60 * 60 * 1000)} />
							<ItemPanel children="For 3 Hours" onClick={() => handleScheduleMute(3 * 60 * 60 * 1000)} />
							<ItemPanel children="For 8 Hours" onClick={() => handleScheduleMute(8 * 60 * 60 * 1000)} />
							<ItemPanel children="For 24 Hours" onClick={() => handleScheduleMute(24 * 60 * 60 * 1000)} />
							<ItemPanel children="Until I turn it back on" onClick={() => handleScheduleMute(Infinity)} />
						</Dropdown>
					) : (
						<ItemPanel
							children={nameChildren}
							muteTime={mutedUntil}
							onClick={() => muteOrUnMuteChannel(1)}
						/>
					)}
				</div>
				<div className="flex flex-col pb-2 mb-1 border-b-[0.08px] dark:border-b-[#6A6A6A] border-b-[#E1E1E1] last:border-b-0 last:mb-0 last:pb-0">
					<ItemPanel
						children="Reaction Message"
						type="checkbox"
						name="NotifiReactionSetting"
						defaultChecked={notifiReactMessage?.id !== '0'}
            onClickCheckbox={setNotiReactMess}
					/>
				</div>
        <ItemPanel
          children="Use Category Default"
          type="radio"
          name="NotificationSetting"
          defaultNotifi={true}
          defaultChecked={getNotificationChannelSelected?.notification_setting_type === undefined}
          defaultNotifiName={defaultNotifiName}
          onClickRadio={() => setNotification('')}
        />
        {notificationTypesList.map(notification => (
          <ItemPanel
            children={notification.label}
            notificationId={notification.value}
            type="radio"
            name="NotificationSetting"
            key={notification.value}
            defaultChecked={getNotificationChannelSelected?.notification_setting_type === notification.value}
            onClickRadio={() => setNotification(notification.value)}
          />
        ))}
			</div>
		</div>
	);
};

export default NotificationSetting;
