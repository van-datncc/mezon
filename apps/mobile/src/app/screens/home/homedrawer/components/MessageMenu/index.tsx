import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { ENotificationActive, ENotificationChannelId, Icons, UserMinus } from '@mezon/mobile-components';
import { baseColor, useTheme } from '@mezon/mobile-ui';
import {
	DirectEntity,
	deleteChannel,
	directActions,
	fetchDirectMessage,
	notificationSettingActions,
	removeMemberChannel,
	selectCurrentClan,
	selectCurrentUserId,
	selectSelectedChannelNotificationSetting,
	useAppDispatch,
	useAppSelector
} from '@mezon/store-mobile';
import { createImgproxyUrl } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { ChannelType } from 'mezon-js';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { IMezonMenuItemProps, IMezonMenuSectionProps, MezonConfirm, MezonMenu, reserve } from '../../../../../componentUI';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { style } from './styles';

interface IServerMenuProps {
	// inviteRef: MutableRefObject<any>;
	messageInfo: DirectEntity;
}

function MessageMenu({ messageInfo }: IServerMenuProps) {
	const { t } = useTranslation(['dmMessage']);
	const { themeValue } = useTheme();
	const [isVisibleLeaveGroupModal, setIsVisibleLeaveGroupModal] = useState<boolean>(false);
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const currentClan = useSelector(selectCurrentClan);
	useEffect(() => {
		dispatch(notificationSettingActions.getNotificationSetting({ channelId: messageInfo?.channel_id }));
	}, []);

	const getNotificationChannelSelected = useSelector(selectSelectedChannelNotificationSetting);

	const isDmUnmute = useMemo(() => {
		return (
			getNotificationChannelSelected?.active === ENotificationActive.ON || getNotificationChannelSelected?.id === ENotificationChannelId.Default
		);
	}, [getNotificationChannelSelected]);

	const { dismiss } = useBottomSheetModal();

	const isGroup = useMemo(() => {
		return Number(messageInfo?.type) === ChannelType.CHANNEL_TYPE_GROUP;
	}, [messageInfo?.type]);

	const lastOne = useMemo(() => {
		return !messageInfo?.user_id?.length;
	}, [messageInfo?.user_id]);

	const leaveGroupMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => {
				setIsVisibleLeaveGroupModal(true);
			},
			isShow: isGroup,
			title: lastOne ? t('delete.leaveGroup') : t('menu.leaveGroup'),
			textStyle: { color: 'red' }
		}
	];

	const profileMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			title: t('menu.profile'),
			isShow: !isGroup,
			icon: <Icons.UserBoxIcon color={baseColor.gray} />
		},
		{
			onPress: async () => {
				await dispatch(directActions.closeDirectMessage({ channel_id: messageInfo?.channel_id }));
				dismiss();
			},
			title: t('menu.closeDm'),
			isShow: !isGroup,
			icon: <UserMinus color={baseColor.gray} />
		}
	];

	const markAsReadMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			title: t('menu.markAsRead'),
			icon: <Icons.EyeIcon color={baseColor.gray} />
		}
	];

	const favoriteMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			title: t('menu.favorite'),
			icon: <Icons.FavoriteFilledIcon color={baseColor.gray} />
		}
	];

	const muteOrUnMuteChannel = (active: ENotificationActive) => {
		const body = {
			channel_id: messageInfo?.channel_id || '',
			notification_type: getNotificationChannelSelected?.notification_setting_type || 0,
			clan_id: currentClan?.clan_id || '',
			active
		};
		dispatch(notificationSettingActions.setMuteNotificationSetting(body));
	};

	const optionsMenu: IMezonMenuItemProps[] = [
		{
			title: isDmUnmute ? t('menu.muteConversation') : t('menu.unMuteConversation'),
			onPress: () => {
				if (!isDmUnmute) {
					muteOrUnMuteChannel(ENotificationActive.ON);
				} else {
					navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, {
						screen: APP_SCREEN.MENU_THREAD.MUTE_THREAD_DETAIL_CHANNEL,
						params: { currentChannel: messageInfo, isCurrentChannel: false }
					});
				}
				dismiss();
			},
			icon: isDmUnmute ? (
				<Icons.BellSlashIcon color={themeValue.textStrong} />
			) : (
				<Icons.BellIcon width={22} height={22} color={themeValue.text} />
			)
		}
		// {
		// 	onPress: () => reserve(),
		// 	title: t('menu.notificationSettings')
		// }
	];

	const menu: IMezonMenuSectionProps[] = [
		{
			items: leaveGroupMenu
		},
		{
			items: profileMenu
		},
		{
			items: markAsReadMenu
		},
		{
			items: favoriteMenu
		},
		{
			items: optionsMenu
		}
	];
	const currentUserId = useAppSelector(selectCurrentUserId);

	const handleLeaveGroupConfirm = async () => {
		const isLeaveOrDeleteGroup = lastOne
			? await dispatch(deleteChannel({ clanId: '', channelId: messageInfo?.channel_id ?? '', isDmGroup: true }))
			: await dispatch(removeMemberChannel({ channelId: messageInfo?.channel_id || '', userIds: [currentUserId], kickMember: false }));
		if (!isLeaveOrDeleteGroup) {
			return;
		}

		await dispatch(fetchDirectMessage({ noCache: true }));
		setIsVisibleLeaveGroupModal(false);
		dismiss();
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				{isGroup ? (
					<View style={styles.groupAvatar}>
						<Icons.GroupIcon />
					</View>
				) : (
					<View style={styles.avatarWrapper}>
						{messageInfo?.channel_avatar?.[0] ? (
							<FastImage
								source={{
									uri: createImgproxyUrl(messageInfo?.channel_avatar?.[0] ?? '', { width: 100, height: 100, resizeType: 'fit' })
								}}
								style={styles.friendAvatar}
							/>
						) : (
							<View style={styles.wrapperTextAvatar}>
								<Text style={styles.textAvatar}>{(messageInfo?.channel_label || messageInfo?.usernames)?.charAt?.(0)}</Text>
							</View>
						)}
					</View>
				)}
				<View style={styles.titleWrapper}>
					<Text style={styles.serverName} numberOfLines={2}>
						{messageInfo?.channel_label || messageInfo?.usernames}
					</Text>
					{isGroup && <Text style={styles.memberText}>{messageInfo?.user_id?.length + 1} members</Text>}
				</View>
			</View>

			<View>
				<MezonMenu menu={menu} />
			</View>

			<MezonConfirm
				visible={isVisibleLeaveGroupModal}
				onConfirm={handleLeaveGroupConfirm}
				onVisibleChange={setIsVisibleLeaveGroupModal}
				title={t('confirm.title', {
					groupName: messageInfo?.channel_label
				})}
				content={t('confirm.content', {
					groupName: messageInfo?.channel_label
				})}
				confirmText={t('confirm.confirmText')}
			/>
		</View>
	);
}

export default memo(MessageMenu);
