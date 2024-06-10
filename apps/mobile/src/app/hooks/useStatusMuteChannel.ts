import { selectDefaultNotificationCategory, selectDefaultNotificationClan, selectnotificatonSelected } from '@mezon/store-mobile';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const enum EActionMute {
	Mute = 1,
	UnMute = 0,
}

const useStatusMuteChannel = () => {
	const [statusMute, setStatusMute] = useState<EActionMute>(EActionMute.UnMute);
	const defaultNotificationCategory = useSelector(selectDefaultNotificationCategory);
	const getNotificationChannelSelected = useSelector(selectnotificatonSelected);
	const defaultNotificationClan = useSelector(selectDefaultNotificationClan);
	useEffect(() => {
		const isChannelMuted =
			getNotificationChannelSelected?.active !== EActionMute.Mute || getNotificationChannelSelected?.notification_setting_type === 'NOTHING';
		const isCategoryMuted = defaultNotificationCategory?.notification_setting_type === 'NOTHING';
		const isClanMuted = defaultNotificationClan?.notification_setting_type === 'NOTHING';
		if (isChannelMuted) {
			setStatusMute(EActionMute.Mute);
		} else if (!getNotificationChannelSelected?.notification_setting_type) {
			setStatusMute(isCategoryMuted || isClanMuted ? EActionMute.Mute : EActionMute.UnMute);
		} else {
			setStatusMute(EActionMute.UnMute);
		}
	}, [getNotificationChannelSelected, defaultNotificationCategory, defaultNotificationClan]);
	return {
		statusMute,
	};
};

export default useStatusMuteChannel;
