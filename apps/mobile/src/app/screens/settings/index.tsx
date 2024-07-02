import { LogoutIcon, NittroIcon } from '@mezon/mobile-components';
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
import {
	AccessibilityIcon, BoostTier2Icon, BrandDiscordIcon, ClipIcon, FriendIcon, GiftIcon, GlobeEarthIcon, GroupIcon, ImageTextIcon, KeyIcon, LanguageIcon, LaptopPhoneIcon, MicrophoneIcon, NitroWheelIcon, PaintPaletteIcon, PuzzlePieceIcon, QRCodeCameraIcon, SettingsIcon, ShieldIcon, UserCircleIcon, BellIcon, CircleQuestionIcon, CircleInformationIcon, DoorExitIcon
}
	// @ts-ignore
	from 'libs/mobile-components/src/lib/icons2';

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
			icon: <NitroWheelIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.account'),
			icon: <UserCircleIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.privacySafety'),
			icon: <ShieldIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.familyCenter'),
			icon: <GroupIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.authorizedApp'),
			icon: <KeyIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.device'),
			icon: <LaptopPhoneIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.connection'),
			icon: <PuzzlePieceIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.clip'),
			icon: <ClipIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.friendRequests'),
			icon: <FriendIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.QRScan'),
			icon: <QRCodeCameraIcon />,
		},
	]

	const PaymentMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.serverBoost'),
			icon: <BoostTier2Icon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.nitroGift'),
			icon: <GiftIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.restoreSubscription'),
			icon: <NitroWheelIcon />,
		},
	]

	const AppMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.voice'),
			icon: <MicrophoneIcon />,
		},
		{
			onPress: () => {
				navigation.navigate(APP_SCREEN.SETTINGS.STACK, {
					screen: APP_SCREEN.SETTINGS.APPEARANCE
				});
			},
			expandable: true,
			title: t('appSettings.appearance'),
			icon: <PaintPaletteIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.accessibility'),
			icon: <AccessibilityIcon />,
		},
		{
			onPress: () => navigateToLanguageSetting(),
			title: t('appSettings.language'),
			icon: <LanguageIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.chat'),
			icon: <ImageTextIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.webBrowser'),
			icon: <GlobeEarthIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.notifications'),
			icon: <BellIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.appIcon'),
			icon: <BrandDiscordIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.advanced'),
			icon: <SettingsIcon />,
		},
	]

	const SupportMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.support'),
			icon: <CircleQuestionIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.uploadLog'),
			icon: <CircleInformationIcon />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.acknowledgement'),
			icon: <CircleInformationIcon />,
		},
	]

	const WhatsNew: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('whatsNew.whatsNew'),
			icon: <CircleInformationIcon width={20} height={20} />,
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
				icon={<DoorExitIcon color={Colors.textRed} />}
			/>
		</ScrollView>
	);
};

