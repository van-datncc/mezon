import { LogoutIcon, NittroIcon } from '@mezon/mobile-components';
import { authActions, channelsActions, clansActions, messagesActions, useAppDispatch } from '@mezon/store-mobile';
import { Colors, baseColor, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView } from 'react-native';
import { style } from './styles';
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
	const { t, i18n } = useTranslation(['setting']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);

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

	const AccountMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.getNitro'),
			icon: <NitroWheelIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.account'),
			icon: <UserCircleIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.privacySafety'),
			icon: <ShieldIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.familyCenter'),
			icon: <GroupIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.authorizedApp'),
			icon: <KeyIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.device'),
			icon: <LaptopPhoneIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.connection'),
			icon: <PuzzlePieceIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.clip'),
			icon: <ClipIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.friendRequests'),
			icon: <FriendIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('accountSettings.QRScan'),
			icon: <QRCodeCameraIcon color={themeValue.textStrong} />,
		},
	]

	const PaymentMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.serverBoost'),
			icon: <BoostTier2Icon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.nitroGift'),
			icon: <GiftIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('paymentSettings.restoreSubscription'),
			icon: <NitroWheelIcon color={themeValue.textStrong} />,
		},
	]

	const AppMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.voice'),
			icon: <MicrophoneIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => {
				navigation.navigate(APP_SCREEN.SETTINGS.STACK, {
					screen: APP_SCREEN.SETTINGS.APPEARANCE
				});
			},
			expandable: true,
			title: t('appSettings.appearance'),
			icon: <PaintPaletteIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.accessibility'),
			icon: <AccessibilityIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => {
				navigation.navigate(APP_SCREEN.SETTINGS.STACK, {
					screen: APP_SCREEN.SETTINGS.LANGUAGE
				});
			},
			title: t('appSettings.language'),
			expandable: true,
			previewValue: i18n.language,
			icon: <LanguageIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.chat'),
			icon: <ImageTextIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.webBrowser'),
			icon: <GlobeEarthIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.notifications'),
			icon: <BellIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.appIcon'),
			icon: <BrandDiscordIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('appSettings.advanced'),
			icon: <SettingsIcon color={themeValue.textStrong} />,
		},
	]

	const SupportMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.support'),
			icon: <CircleQuestionIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.uploadLog'),
			icon: <CircleInformationIcon color={themeValue.textStrong} />,
		},
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('supportSettings.acknowledgement'),
			icon: <CircleInformationIcon color={themeValue.textStrong} />,
		},
	]

	const WhatsNew: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			expandable: true,
			title: t('whatsNew.whatsNew'),
			icon: <CircleInformationIcon color={themeValue.textStrong} />,
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
				textStyle={{ color: baseColor.red }}
				icon={<DoorExitIcon color={baseColor.red} />}
			/>
		</ScrollView>
	);
};

