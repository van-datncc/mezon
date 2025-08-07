import { usePermissionChecker } from '@mezon/core';
import { size, useTheme } from '@mezon/mobile-ui';
import { fetchClanWebhooks, fetchWebhooks, selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { EPermission } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../componentUI/MezonIconCDN';
import MezonMenu, { IMezonMenuItemProps, IMezonMenuSectionProps } from '../../../componentUI/MezonMenu';
import { IconCDN } from '../../../constants/icon_cdn';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { style } from '../styles';

export function Integrations({ route }) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const navigation = useNavigation<any>();
	const { t } = useTranslation(['clanIntegrationsSetting']);
	const { channelId, isClanSetting } = route?.params || {};
	const currentClanId = useSelector(selectCurrentClanId) as string;
	const [canManageClan] = usePermissionChecker([EPermission.manageClan]);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!canManageClan) return;
		dispatch(fetchWebhooks({ channelId: channelId || '0', clanId: currentClanId }));
		if (isClanSetting) dispatch(fetchClanWebhooks({ clanId: currentClanId }));
	}, [canManageClan, channelId, currentClanId, dispatch]);

	const clanWebhooksMenuItem = useMemo(() => {
		return {
			title: t('integration.clanWebhooks'),
			onPress: () => {
				navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, {
					screen: APP_SCREEN.MENU_CLAN.WEBHOOKS,
					params: {
						clanId: currentClanId,
						isClanIntegration: true,
						isClanSetting,
					}
				});
			},
			expandable: true,
			icon: <MezonIconCDN icon={IconCDN.webhookIcon} color={themeValue.text} />,
			description: t('integration.automatedMessage')
		}
	}, []);

	const integrationsMenu: IMezonMenuItemProps[] = [
		{
			title: t('integration.channelWebhooks'),
			onPress: () => {
				navigation.navigate(APP_SCREEN.MENU_CLAN.STACK, {
					screen: APP_SCREEN.MENU_CLAN.WEBHOOKS,
					params: {
						channelId,
						isClanSetting,
						clanId: currentClanId,
					}
				});
			},
			expandable: true,
			icon: <MezonIconCDN icon={IconCDN.webhookIcon} color={themeValue.text} />,
			description: t('integration.automatedMessage')
		}
	];

	if (isClanSetting) integrationsMenu.push(clanWebhooksMenuItem);

	const menu: IMezonMenuSectionProps[] = [
		{
			items: integrationsMenu
		}
	];

	return (
		<View style={{ paddingHorizontal: size.s_10, backgroundColor: themeValue.primary, width: '100%', height: '100%' }}>
			<Text style={styles.description}>
				{t('integration.description')}
				<Text style={styles.textLink} onPress={() => Linking.openURL('')}>
					{t('integration.learnMore')}
				</Text>
			</Text>
			<MezonMenu menu={menu} />
		</View>
	);
}
