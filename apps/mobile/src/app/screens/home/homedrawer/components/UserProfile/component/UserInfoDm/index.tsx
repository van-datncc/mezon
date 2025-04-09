import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '@mezon/mobile-ui';
import { channelMembersActions, ChannelMembersEntity, ChannelsEntity, directActions, useAppDispatch } from '@mezon/store-mobile';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import MezonMenu, { IMezonMenuItemProps, IMezonMenuSectionProps } from '../../../../../../../componentUI/MezonMenu';
import { style } from './UserInfoDm.styles';

export default function UserInfoDm({ user, currentChannel }: { user: ChannelMembersEntity; currentChannel: ChannelsEntity }) {
	const { themeValue } = useTheme();
	const { t } = useTranslation(['userProfile']);
	const styles = style(themeValue);
	const { dismiss } = useBottomSheetModal();
	const dispatch = useAppDispatch();
	// const formatDate = (dateString: string) => {
	// 	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
	// 	const date = new Date(dateString);
	// 	return date.toLocaleDateString('en-US', options);
	// };

	const settingsMenu: IMezonMenuItemProps[] = [
		{
			title: t('userInfoDM.menu.removeFromGroup'),
			onPress: () => {
				handleRemoveMemberChannel();
			},
			styleBtn: { backgroundColor: themeValue.bgInputPrimary }
		}
	];

	const handleRemoveMemberChannel = async () => {
		if (user) {
			dismiss();
			const userIds = [user?.id ?? ''];
			try {
				const response = await dispatch(channelMembersActions.removeMemberChannel({ channelId: currentChannel?.channel_id, userIds }));
				if (response?.meta?.requestStatus === 'rejected') {
					throw new Error('removeMemberChannel failed');
				} else {
					Toast.show({
						type: 'info',
						text1: t('userInfoDM.menu.removeSuccess')
					});
					dispatch(directActions.fetchDirectMessage({ noCache: true }));
				}
			} catch (error) {
				console.error('Error removing member from channel:', error);
				Toast.show({
					type: 'info',
					text1: t('userInfoDM.menu.removeFailed')
				});
			}
		}
	};

	const menu: IMezonMenuSectionProps[] = [
		{
			items: settingsMenu
		}
	];

	return (
		<View>
			<View />
			{/* <Text style={styles.title}>ABOUT ME</Text>
				<Text style={styles.desc}>{user?.user?.about_me}</Text> */}
			<View>
				{/*<Text style={styles.title}>{t('userInfoDM.mezonMemberSince')}</Text>*/}
				{/*<Text style={styles.desc}>{formatDate(user?.user?.create_time)}</Text>*/}
			</View>
			<MezonMenu menu={menu} />
		</View>
	);
}
