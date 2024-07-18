import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AngleRight, MuteIcon } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import {
	notificationSettingActions,
	selectCurrentChannel,
	selectCurrentChannelId,
	selectCurrentClanId,
	selectnotificatonSelected,
	useAppDispatch,
} from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { IMezonMenuSectionProps, MezonBottomSheet, MezonMenu } from '../../temp-ui';
import NotificationSetting from '../NotificationSetting';
import { style } from './MuteThreadDetailModal.styles';

const MuteThreadDetailModal = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['notificationSetting']);
	const menu = useMemo(() => ([
		{
			items: [
				{
					title: t('notifySettingThreadModal.muteDuration.forFifteenMinutes'),
					onPress: () => { handleScheduleMute(15 * 60 * 1000); },
				},
				{
					title: t('notifySettingThreadModal.muteDuration.forOneHour'),
					onPress: () => { handleScheduleMute(60 * 60 * 1000); },
				},
				{
					title: t('notifySettingThreadModal.muteDuration.forThreeHours'),
					onPress: () => { handleScheduleMute(3 * 60 * 60 * 1000); },
				},
				{
					title: t('notifySettingThreadModal.muteDuration.forEightHours'),
					onPress: () => { handleScheduleMute(8 * 60 * 60 * 1000); },
				},
				{
					title: t('notifySettingThreadModal.muteDuration.forTwentyFourHours'),
					onPress: () => { handleScheduleMute(24 * 60 * 60 * 1000); },
				},
				{
					title: t('notifySettingThreadModal.muteDuration.untilTurnItBackOn'),
					onPress: () => { handleScheduleMute(Infinity); },
				},
			],
		}
	]) as IMezonMenuSectionProps[], [])

	const navigation = useNavigation();
	const [mutedUntil, setMutedUntil] = useState('');
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const getNotificationChannelSelected = useSelector(selectnotificatonSelected);
	const currentClanId = useSelector(selectCurrentClanId);
	const dispatch = useAppDispatch();

	const openBottomSheet = () => {
		bottomSheetRef.current?.present();
	};

	useEffect(() => {
		let idTimeOut;
		if (getNotificationChannelSelected?.active === 1) {
			setMutedUntil('');
		} else if (getNotificationChannelSelected?.active !== 1) {
			if (getNotificationChannelSelected?.time_mute) {
				const timeMute = new Date(getNotificationChannelSelected.time_mute);
				const currentTime = new Date();
				if (timeMute > currentTime) {
					const timeDifference = timeMute.getTime() - currentTime.getTime();
					const formattedDate = format(timeMute, 'dd/MM, HH:mm');
					setMutedUntil(`Muted until ${formattedDate}`);
					idTimeOut = setTimeout(() => {
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
		return () => {
			clearTimeout(idTimeOut);
		};
	}, [getNotificationChannelSelected, dispatch, currentChannelId, currentClanId]);

	const muteOrUnMuteChannel = (active: number) => {
		const body = {
			channel_id: currentChannelId || '',
			notification_type: getNotificationChannelSelected?.notification_setting_type || '',
			clan_id: currentClanId || '',
			active: active,
		};
		dispatch(notificationSettingActions.setMuteNotificationSetting(body));
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.BOTTOM_SHEET });
	};

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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.BOTTOM_SHEET });
	};

	return (
		<View style={styles.wrapper}>
			{getNotificationChannelSelected?.active === 1 ? (
				<MezonMenu menu={menu} />
			) : (
				<View style={styles.optionsBox}>
					<TouchableOpacity
						onPress={() => {
							muteOrUnMuteChannel(1);
						}}
						style={styles.wrapperUnmuteBox}
					>
						<MuteIcon width={20} height={20} style={{ marginRight: 20 }} />
						<Text style={styles.option}>{`Unmute #${currentChannel?.channel_label}`}</Text>
					</TouchableOpacity>
				</View>
			)}

			<Text style={styles.InfoTitle}>{mutedUntil}</Text>
			<TouchableOpacity onPress={() => openBottomSheet()} style={styles.wrapperItemNotification}>
				<Text style={styles.option}>Notification Settings</Text>
				<AngleRight width={20} height={20} color={themeValue.text} />
			</TouchableOpacity>
			<Text style={styles.InfoTitle}>{t('notifySettingThreadModal.description')}</Text>

			<MezonBottomSheet
				heightFitContent
				ref={bottomSheetRef} >
				<NotificationSetting />
			</MezonBottomSheet>
		</View >
	);
};

export default MuteThreadDetailModal;
