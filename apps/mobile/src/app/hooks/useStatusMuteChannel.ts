import { selectCurrentChannelNotificatonSelected, selectDefaultNotificationCategory, selectDefaultNotificationClan } from '@mezon/store-mobile';
import { NotificationType } from 'mezon-js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ENotificationActive } from '../components/MuteThreadDetailModal';

const useStatusMuteChannel = () => {
	const [statusMute, setStatusMute] = useState<ENotificationActive>(ENotificationActive.ON);
	const defaultNotificationCategory = useSelector(selectDefaultNotificationCategory);
	const getNotificationChannelSelected = useSelector(selectCurrentChannelNotificatonSelected);
	const defaultNotificationClan = useSelector(selectDefaultNotificationClan);
	useEffect(() => {
		if (
			getNotificationChannelSelected?.active === 1 &&
			getNotificationChannelSelected?.notification_setting_type === NotificationType.NOTHING_MESSAGE
		) {
			setStatusMute(ENotificationActive.OFF);
		} else if (getNotificationChannelSelected?.id !== '0' && getNotificationChannelSelected?.active !== 1) {
			setStatusMute(ENotificationActive.OFF);
		} else if (getNotificationChannelSelected?.id === '0') {
			if (
				defaultNotificationCategory?.notification_setting_type &&
				defaultNotificationCategory?.notification_setting_type === NotificationType.NOTHING_MESSAGE
			) {
				setStatusMute(ENotificationActive.OFF);
			} else if (
				defaultNotificationClan?.notification_setting_type &&
				defaultNotificationClan?.notification_setting_type === NotificationType.NOTHING_MESSAGE
			) {
				setStatusMute(ENotificationActive.OFF);
			} else {
				setStatusMute(ENotificationActive.ON);
			}
		} else {
			setStatusMute(ENotificationActive.ON);
		}
	}, [getNotificationChannelSelected, defaultNotificationCategory, defaultNotificationClan]);
	return {
		statusMute,
	};
};

export default useStatusMuteChannel;
