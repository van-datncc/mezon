import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { generateClanWebhook, generateWebhook, selectAllClanWebhooks, selectWebhooksByChannelId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { ApiGenerateClanWebhookRequest, ApiWebhookCreateRequest } from 'mezon-js/api.gen';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { WebhookChannelSelectModal } from './WebhookChannelSelectModal';
import { WebhooksEmpty } from './WebhooksEmpty';
import { WebhooksItem } from './WebhooksItem';
import { style } from './styles';

// Constants
const WEBHOOK_NAMES = ['Captain hook', 'Spidey bot', 'Komu Knight'] as const;
const WEBHOOK_AVATARS = [
	`${process.env.NX_BASE_IMG_URL}/1787707828677382144/1791037204600983552/1787691797724532700/211_0mezon_logo_white.png`,
	`${process.env.NX_BASE_IMG_URL}/1787707828677382144/1791037204600983552/1787691797724532700/211_1mezon_logo_black.png`,
	`${process.env.NX_BASE_IMG_URL}/0/1833395573034586112/1787375123666309000/955_0mezon_logo.png`
] as const;


const useWebhookData = (route: any) => {
	const { clanId, isClanSetting, channelId, isClanIntegration } = route?.params || {};

	const allChannelWebhooks = useAppSelector((state) =>
		selectWebhooksByChannelId(state, isClanSetting ? '0' : (channelId ?? ''))
	);
	const allClanWebhooks = useAppSelector(selectAllClanWebhooks);

	const webhookList = useMemo(() => {
		return isClanIntegration ? allClanWebhooks : allChannelWebhooks;
	}, [allClanWebhooks, allChannelWebhooks, isClanIntegration]);

	return {
		clanId,
		isClanSetting,
		channelId,
		isClanIntegration,
		webhookList
	};
};

const useWebhookActions = (clanId: string, isClanSetting: boolean, isClanIntegration: boolean, channelId: string) => {
	const dispatch = useAppDispatch();

	const getRandomWebhookName = useCallback((): string => {
		const randomIndex = Math.floor(Math.random() * WEBHOOK_NAMES.length);
		return WEBHOOK_NAMES[randomIndex];
	}, []);

	const getRandomAvatar = useCallback((): string => {
		const randomIndex = Math.floor(Math.random() * WEBHOOK_AVATARS.length);
		return WEBHOOK_AVATARS[randomIndex];
	}, []);

	const addWebhookProcess = useCallback(async (channelId: string) => {
		const newWebhookReq: ApiWebhookCreateRequest = {
			channel_id: channelId,
			webhook_name: getRandomWebhookName(),
			avatar: getRandomAvatar(),
			clan_id: clanId
		};
		dispatch(generateWebhook({ request: newWebhookReq, channelId, clanId, isClanSetting }));
	}, [clanId, isClanSetting, getRandomWebhookName, getRandomAvatar, dispatch]);

	const handleAddChannelWebhook = useCallback(async () => {
		if (isClanSetting) {
			const data = {
				children: (
					<WebhookChannelSelectModal
						onConfirm={async (selectedChannelId) => {
							await addWebhookProcess(selectedChannelId);
							DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
						}}
						onCancel={() => {
							DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
						}}
					/>
				)
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		} else {
			await addWebhookProcess(channelId);
		}
	}, [isClanSetting, addWebhookProcess, channelId]);

	const handleAddClanWebhook = useCallback(async () => {
		if (isClanIntegration) {
			const newWebhookReq: ApiGenerateClanWebhookRequest = {
				webhook_name: getRandomWebhookName(),
				avatar: getRandomAvatar(),
				clan_id: clanId
			};
			await dispatch(generateClanWebhook({ request: newWebhookReq, clanId }));
		}
	}, [isClanIntegration, clanId, getRandomWebhookName, getRandomAvatar, dispatch]);

	return {
		handleAddChannelWebhook,
		handleAddClanWebhook
	};
};

const useWebhookDescription = (isClanIntegration: boolean, styles: any) => {
	const { t } = useTranslation(['clanIntegrationsSetting']);

	const descriptionText = useMemo(() => {
		const baseDescription = isClanIntegration
			? t('clanWebhooks.description')
			: t('webhooks.description');

		if (isClanIntegration) {
			return (
				<>
					{baseDescription} &nbsp;
					<Text style={styles.textLink}>{t('clanWebhooks.tips')}</Text>
				</>
			);
		}

		return (
			<>
				{baseDescription} &nbsp;
				<Text style={styles.textLink} onPress={() => Linking.openURL('')}>
					{t('webhooks.learnMore')}
				</Text>
				&nbsp;or try&nbsp;
				<Text style={styles.textLink} onPress={() => Linking.openURL('')}>
					{t('webhooks.buildOne')}
				</Text>
			</>
		);
	}, [isClanIntegration, t, styles]);

	return descriptionText;
};

// Main component
export function Webhooks({ route }: { route: any }) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const {
		clanId,
		isClanSetting,
		channelId,
		isClanIntegration,
		webhookList
	} = useWebhookData(route);

	const { handleAddChannelWebhook, handleAddClanWebhook } = useWebhookActions(
		clanId,
		isClanSetting,
		isClanIntegration,
		channelId
	);

	const descriptionText = useWebhookDescription(isClanIntegration, styles);

	const handleAddWebhook = useCallback(() => {
		if (isClanIntegration) {
			handleAddClanWebhook();
		} else {
			handleAddChannelWebhook();
		}
	}, [isClanIntegration, handleAddClanWebhook, handleAddChannelWebhook]);

	const renderWebhookItem = useCallback(({ item }: { item: any }) => (
		<WebhooksItem
			webhook={item}
			isClanIntegration={isClanIntegration}
			isClanSetting={isClanSetting}
		/>
	), [isClanIntegration, isClanSetting]);

	const keyExtractor = useCallback((item: any) => item.id?.toString(), []);

	return (
		<View
			style={{
				paddingHorizontal: size.s_16,
				paddingVertical: size.s_16,
				backgroundColor: themeValue.primary,
				width: '100%',
				height: '100%'
			}}
		>
			<Text style={styles.description}>
				{descriptionText}
			</Text>

			<FlatList
				data={webhookList}
				keyExtractor={keyExtractor}
				renderItem={renderWebhookItem}
				ListEmptyComponent={<WebhooksEmpty />}
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
			/>

			<TouchableOpacity
				style={styles.stickyNewButton}
				onPress={handleAddWebhook}
				activeOpacity={0.8}
			>
				<Text style={styles.stickyNewButtonText}> + </Text>
			</TouchableOpacity>
		</View>
	);
}
