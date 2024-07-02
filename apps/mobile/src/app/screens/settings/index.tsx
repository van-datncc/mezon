import { Icons } from '@mezon/mobile-components';
import { authActions, channelsActions, clansActions, messagesActions, useAppDispatch } from '@mezon/store-mobile';
import { Colors } from '@mezon/mobile-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView } from 'react-native';
import { styles } from './styles';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import MezonSearch from '../../temp-ui/MezonSearch';
import { reserve, MezonMenu, IMezonMenuItemProps, IMezonMenuSectionProps } from '../../temp-ui';
import MezonMenuItem from '../../temp-ui/MezonMenuItem';

export const Settings = ({ navigation }: { navigation: any }) => {
	const { t } = useTranslation(['setting']);

	const dispatch = useAppDispatch();
	const logout = () => {
		dispatch(authActions.logOut());
		dispatch(channelsActions.removeAll());
		dispatch(messagesActions.removeAll());
		dispatch(clansActions.removeAll());
	};

	const confirmLogout = () => {
		Alert.alert(
			t('logOut'),
			'Are you sure you want to log out?',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'Yes', onPress: () => logout() },
			],
			{ cancelable: false },
		);
	};

	const navigateToLanguageSetting = () => {
		navigation.navigate(APP_SCREEN.SETTINGS.STACK, { screen: APP_SCREEN.SETTINGS.LANGUAGE });
	}

	const AccountMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.getNitro'),
			icon: <Icons.NitroWheelIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.account'),
			icon: <Icons.UserCircleIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.privacySafety'),
			icon: <Icons.ShieldIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.familyCenter'),
			icon: <Icons.GroupIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.authorizedApp'),
			icon: <Icons.KeyIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.device'),
			icon: <Icons.LaptopPhoneIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.connection'),
			icon: <Icons.PuzzlePieceIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.clip'),
			icon: <Icons.ClipIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.friendRequests'),
			icon: <Icons.FriendIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.QRScan'),
			icon: <Icons.QRCodeCameraIcon />,
		},
	]

	const PaymentMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.serverBoost'),
			icon: <Icons.BoostTier2Icon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.nitroGift'),
			icon: <Icons.GiftIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.restoreSubscription'),
			icon: <Icons.NitroWheelIcon />,
		},
	]

	const AppMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.voice'),
			icon: <Icons.MicrophoneIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.appearance'),
			icon: <Icons.PaintPaletteIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.accessibility'),
			icon: <Icons.AccessibilityIcon />,
		},
		{
			onPress: () => navigateToLanguageSetting(),
			title: t('appSettings.language'),
			icon: <Icons.LanguageIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.chat'),
			icon: <Icons.ImageTextIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.webBrowser'),
			icon: <Icons.GlobeEarthIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.notifications'),
			icon: <Icons.BellIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.appIcon'),
			icon: <Icons.BrandDiscordIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.advanced'),
			icon: <Icons.SettingsIcon />,
		},
	]

	const SupportMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.support'),
			icon: <Icons.CircleQuestionIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.uploadLog'),
			icon: <Icons.CircleInformationIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.acknowledgement'),
			icon: <Icons.CircleInformationIcon />,
		},
	]

	const WhatsNew: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('whatsNew.whatsNew'),
			icon: <Icons.CircleInformationIcon width={20} height={20} />,
		},
	]

	const menu: IMezonMenuSectionProps[] = [
		{
			title: t('accountSettings.title'),
			items: AccountMenu,
		},
		{
			title: t('paymentSettings.title'),
			items: PaymentMenu,
		},
		{
			title: t('appSettings.title'),
			items: AppMenu,
		},
		{
			title: t('supportSettings.title'),
			items: SupportMenu,
		},
		{
			title: t('whatsNew.title'),
			items: WhatsNew,
		},
	]

	return (
		<ScrollView contentContainerStyle={styles.settingContainer}>
			<MezonSearch />

			<MezonMenu menu={menu} />

			<MezonMenuItem
				isLast
				onPress={() => confirmLogout()}
				title={t('logOut')}
				icon={<Icons.DoorExitIcon color={Colors.textRed} />}
			/>
		</ScrollView>
	);
};

