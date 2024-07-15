import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { baseColor, useTheme } from '@mezon/mobile-ui';
import { ClansEntity } from '@mezon/store-mobile';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { APP_SCREEN, AppStackScreenProps } from 'apps/mobile/src/app/navigation/ScreenTypes';
import { IMezonMenuItemProps, IMezonMenuSectionProps, MezonClanAvatar, MezonMenu, reserve } from 'apps/mobile/src/app/temp-ui';
import MezonButtonIcon from 'apps/mobile/src/app/temp-ui/MezonButtonIcon';
import MezonToggleButton from 'apps/mobile/src/app/temp-ui/MezonToggleButton';
import { MutableRefObject, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import DeleteClanModal from '../../../../../../components/DeleteClanModal';
import ClanMenuInfo from '../ClanMenuInfo';
import { style } from './styles';

interface IServerMenuProps {
	clan: ClansEntity;
	inviteRef: MutableRefObject<any>;
}

export default function ClanMenu({ clan, inviteRef }: IServerMenuProps) {
	const { t } = useTranslation(['clanMenu']);
	const { themeValue } = useTheme();
	const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState<boolean>(false);
	const styles = style(themeValue);

	const user = useAuth();
	const navigation = useNavigation<AppStackScreenProps['navigation']>();
	const { dismiss } = useBottomSheetModal();

	const handleOpenInvite = () => {
		inviteRef?.current.present();
		dismiss();
	};
	const isOwner = useMemo(() => user?.userId === clan?.creator_id, [user, clan]);

	const handleOpenSettings = () => {
		navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.SETTINGS });
		dismiss();
	};

	const ToggleBtn = () => <MezonToggleButton onChange={() => {}} height={25} width={45} />;

	const watchMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			title: t('menu.watchMenu.markAsRead'),
		},
		{
			onPress: () => reserve(),
			title: t('menu.watchMenu.browseChannels'),
		},
	];

	const organizationMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => reserve(),
			title: t('menu.organizationMenu.createChannel'),
		},
		{
			onPress: () => {
				dismiss();
				navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_CATEGORY });
			},
			title: t('menu.organizationMenu.createCategory'),
		},
		{
			onPress: () => {
				dismiss();
				navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, { screen: APP_SCREEN.MENU_CLAN.CREATE_EVENT });
			},
			title: t('menu.organizationMenu.createEvent'),
		},
	];

	const optionsMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => {
				dismiss();
				navigation.navigate(APP_SCREEN.SETTINGS.STACK, { screen: APP_SCREEN.SETTINGS.PROFILE });
			},
			title: t('menu.optionsMenu.editServerProfile'),
		},
		{
			title: t('menu.optionsMenu.showAllChannels'),
			component: <ToggleBtn />,
		},
		{
			title: t('menu.optionsMenu.hideMutedChannels'),
			component: <ToggleBtn />,
		},
		{
			title: t('menu.optionsMenu.allowDirectMessage'),
			component: <ToggleBtn />,
		},
		{
			title: t('menu.optionsMenu.allowMessageRequest'),

			component: <ToggleBtn />,
		},
		{
			onPress: () => reserve(),
			title: t('menu.optionsMenu.reportServer'),
		},
		{
			onPress: () => reserve(),
			isShow: !isOwner,
			title: t('menu.optionsMenu.leaveServer'),
			textStyle: { color: 'red' },
		},
		{
			onPress: () => {
				setIsVisibleDeleteModal(true);
			},
			isShow: isOwner,
			title: t('menu.optionsMenu.deleteClan'),
			textStyle: { color: 'red' },
		},
	];

	const devMenu: IMezonMenuItemProps[] = [
		{
			onPress: () => {
				Clipboard.setString(clan?.clan_id);
				Toast.show({
					type: 'info',
					text1: t('menu.devMode.serverIDCopied'),
				});
			},
			title: t('menu.devMode.copyServerID'),
		},
	];

	const menu: IMezonMenuSectionProps[] = [
		{
			items: watchMenu,
		},
		{
			items: organizationMenu,
		},
		{
			items: optionsMenu,
		},
		{
			title: t('menu.devMode.title'),
			items: devMenu,
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.avatarWrapper}>
					<MezonClanAvatar image={clan?.logo} alt={clan?.clan_name} />
				</View>
				<Text style={styles.serverName}>{clan?.clan_name}</Text>
				<ClanMenuInfo clan={clan} />

				<ScrollView contentContainerStyle={styles.actionWrapper} horizontal>
					<MezonButtonIcon
						title={`18 ${t('actions.boot')}`}
						icon={<Icons.BoostTier2Icon color={baseColor.purple} />}
						onPress={() => reserve()}
					/>
					<MezonButtonIcon
						title={t('actions.invite')}
						icon={<Icons.GroupPlusIcon color={themeValue.textStrong} />}
						onPress={handleOpenInvite}
					/>
					<MezonButtonIcon
						title={t('actions.notifications')}
						icon={<Icons.BellIcon color={themeValue.textStrong} />}
						onPress={() => reserve()}
					/>

					{isOwner && (
						<MezonButtonIcon
							title={t('actions.settings')}
							icon={<Icons.SettingsIcon color={themeValue.textStrong} />}
							onPress={handleOpenSettings}
						/>
					)}
				</ScrollView>
				<View>
					<MezonMenu menu={menu} />
				</View>
			</View>
			<DeleteClanModal
				isVisibleModal={isVisibleDeleteModal}
				visibleChange={(isVisible) => {
					setIsVisibleDeleteModal(isVisible);
				}}
			></DeleteClanModal>
		</View>
	);
}
