import { ActionEmitEvent, QUALITY_IMAGE_UPLOAD } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import {
	ChannelsEntity,
	deleteClanWebhookById,
	deleteWebhookById,
	fetchClanWebhooks,
	fetchWebhooks,
	selectAllChannels,
	selectClanWebhooksById,
	selectCurrentClanId,
	updateClanWebhookById,
	updateWebhookBySpecificId,
	useAppDispatch
} from '@mezon/store-mobile';
import { handleUploadFileMobile, useMezon } from '@mezon/transport';
import { ChannelIsNotThread } from '@mezon/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { ApiWebhook, MezonUpdateClanWebhookByIdBody, MezonUpdateWebhookByIdBody } from 'mezon-js/api.gen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Image, Keyboard, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import { CameraOptions } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import MezonConfirm from '../../../../../componentUI/MezonConfirm';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IFile } from '../../../../../componentUI/MezonImagePicker';
import MezonInput from '../../../../../componentUI/MezonInput';
import MezonMenu, { IMezonMenuItemProps, IMezonMenuSectionProps } from '../../../../../componentUI/MezonMenu';
import MezonOption from '../../../../../componentUI/MezonOption';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { style } from './styles';

export function WebhooksEdit({ route, navigation }: { route: any; navigation: any }) {
	const { themeValue } = useTheme();
	const styles = useMemo(() => style(themeValue), [themeValue]);
	const { webhook, isClanIntegration, isClanSetting } = route.params || {};
	const { sessionRef, clientRef } = useMezon();
	const [urlImageWebhook, setUrlImageWebhook] = useState<string>('');
	const [webhookName, setWebhookName] = useState<string>('');
	const [webhookChannel, setWebhookChannel] = useState<ChannelsEntity>(null);
	const [hasChange, setHasChange] = useState<boolean>(false);
	const clanId = useSelector(selectCurrentClanId) as string;
	const allChannel = useSelector(selectAllChannels);
	const currentWebhook = useSelector((state: any) => selectClanWebhooksById(state, webhook?.id));
	const [isCopied, setIsCopied] = useState(false);
	const { t } = useTranslation(['screenStack', 'clanIntegrationsSetting']);
	const parentChannelsInClan = useMemo(() => allChannel?.filter((channel) => channel?.parent_id === ChannelIsNotThread.TRUE), [allChannel]);
	const dispatch = useAppDispatch();

	const channel = useMemo(() => {
		return parentChannelsInClan?.map((channel) => ({
			title: channel?.channel_label,
			value: channel?.channel_id,
			icon: <MezonIconCDN icon={IconCDN.channelText} color={themeValue.text} />
		}));
	}, [parentChannelsInClan, themeValue.text]);

	const getChannelSelect = useCallback(
		(idChannel = '') => {
			return parentChannelsInClan?.find((channel) => channel?.channel_id === idChannel);
		},
		[parentChannelsInClan]
	);

	useEffect(() => {
		if (webhook?.avatar || webhook?.channel_id || webhook?.webhook_name) {
			setUrlImageWebhook(webhook?.avatar);
			setWebhookName(webhook?.webhook_name);
			const channelSelect = getChannelSelect(webhook?.channel_id);
			setWebhookChannel(channelSelect);
		}
	}, [webhook, getChannelSelect]);

	const handleResetChange = useCallback(() => {
		if (hasChange) {
			setUrlImageWebhook(webhook?.avatar);
			setWebhookName(webhook?.webhook_name);
			const channelSelect = getChannelSelect(webhook?.channel_id);
			setWebhookChannel(channelSelect);
			setHasChange(false);
		}
	}, [hasChange, getChannelSelect, webhook]);

	const updateClanWebhookProcess = useCallback(async (webhookId: string, resetToken: boolean = false) => {
		const request: MezonUpdateClanWebhookByIdBody = {
			avatar: urlImageWebhook,
			webhook_name: webhookName,
			clan_id: clanId,
			reset_token: resetToken
		};

		await dispatch(
			updateClanWebhookById({
				request: request,
				webhookId: webhookId,
				clanId: clanId
			})
		);
	}, [urlImageWebhook, webhookName, clanId, dispatch]);

	const updateWebhookProcess = useCallback(async (webhookId: string) => {
		const request: MezonUpdateWebhookByIdBody = {
			avatar: urlImageWebhook,
			channel_id_update: webhookChannel?.channel_id,
			webhook_name: webhookName,
			channel_id: webhook?.channel_id,
			clan_id: clanId
		};

		await dispatch(
			updateWebhookBySpecificId({
				request: request,
				webhookId: webhookId,
				channelId: webhook?.channel_id,
				clanId: clanId
			})
		);
	}, [urlImageWebhook, webhookChannel?.channel_id, webhookName, webhook?.channel_id, clanId, dispatch]);

	const handleEditWebhook = useCallback(async () => {
		if (!hasChange) return;

		if (isClanIntegration) {
			await updateClanWebhookProcess(webhook?.id, false);
		} else {
			await updateWebhookProcess(webhook?.id);
		}

		setHasChange(false);

		navigation.navigate(APP_SCREEN.MENU_CLAN.WEBHOOKS, {
			channelId: webhook?.channel_id,
			isClanIntegration,
			isClanSetting,
			clanId
		});

	}, [hasChange, isClanIntegration, updateClanWebhookProcess, updateWebhookProcess, webhook?.id, webhook?.channel_id, navigation, clanId, isClanSetting]);

	useEffect(() => {
		navigation.setOptions({
			headerStatusBarHeight: Platform.OS === 'android' ? 0 : undefined,
			headerRight: () =>
				hasChange ? (
					<Pressable onPress={handleEditWebhook} style={{ paddingRight: size.s_14 }}>
						<Text style={styles.textHeader}>{t('webhooksEdit.save', { ns: 'clanIntegrationsSetting' })}</Text>
					</Pressable>
				) : null,

			headerLeft: () =>
				hasChange ? (
					<Pressable style={{ paddingLeft: size.s_14 }}>
						<Text style={styles.textHeader} onPress={handleResetChange}>
							{t('webhooksEdit.cancel', { ns: 'clanIntegrationsSetting' })}
						</Text>
					</Pressable>
				) : (
					<Pressable style={{ padding: 20 }} onPress={() => navigation.goBack()}>
						<MezonIconCDN icon={IconCDN.arrowLargeLeftIcon} height={size.s_20} width={size.s_20} color={themeValue.text} />
					</Pressable>
				),

			headerTitle: t('menuClanStack.webhooksEdit')
		});
	}, [
		hasChange,
		handleEditWebhook,
		styles.textHeader,
		t,
		handleResetChange,
		navigation,
		themeValue.text
	]);

	const channelMenu: IMezonMenuItemProps[] = useMemo(() => {
		return [
			{
				title: webhookChannel?.channel_label,
				onPress: () => {
					const data = {
						snapPoints: ['50%'],
						children: <MezonOption data={channel} value={webhookChannel?.channel_id} onChange={handleChangeOption} />
					};
					DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: false, data });
					Keyboard.dismiss();
				},
				expandable: true,
				icon: <MezonIconCDN icon={IconCDN.channelText} color={themeValue.text} />
			}
		];
	}, [themeValue.text, webhookChannel?.channel_label, webhookChannel?.channel_id, channel]);

	const menu: IMezonMenuSectionProps[] = useMemo(() => [
		{
			title: t('webhooksEdit.channel', { ns: 'clanIntegrationsSetting' }),
			items: channelMenu
		}
	], [channelMenu, t]);

	const handleChooseFiles = useCallback(async () => {
		setHasChange(true);
		const options = {
			durationLimit: 10000,
			mediaType: 'photo',
			quality: QUALITY_IMAGE_UPLOAD
		};

		ImagePicker.launchImageLibrary(options as CameraOptions, async (response) => {
			if (response.didCancel) {
				console.warn('User cancelled camera');
			} else if (response.errorCode) {
				console.error('Camera Error: ', response.errorMessage);
			} else {
				const file = response.assets[0];
				const fileData = await RNFS.readFile(file.uri, 'base64');
				const fileFormat: IFile = {
					uri: file?.uri,
					name: file?.fileName,
					type: file?.type,
					size: file?.fileSize?.toString(),
					fileData
				};
				handleFile([fileFormat][0]);
			}
		});
	}, []);

	const handleFile = useCallback(async (file: IFile | any) => {
		const session = sessionRef.current;
		const client = clientRef.current;
		if (!file || !client || !session) {
			throw new Error('Client or files are not initialized');
		}
		const res = await handleUploadFileMobile(client, session, webhook?.clan_id, webhook?.channel_id, file.name, file);
		if (!res?.url) return;
		setUrlImageWebhook(res?.url);
	}, [sessionRef, clientRef, webhook?.clan_id, webhook?.channel_id]);

	const handleChangeText = useCallback((value) => {
		setHasChange(true);
		setWebhookName(value);
	}, []);

	const handleChangeOption = useCallback(
		(value) => {
			setHasChange(true);
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
			const channelSelect = getChannelSelect(value);
			setWebhookChannel(channelSelect);
		},
		[getChannelSelect]
	);

	const handleResetToken = useCallback(async () => {
		await updateClanWebhookProcess(webhook?.id, true);
	}, [updateClanWebhookProcess, webhook?.id]);

	const handleCopyToClipboard = useCallback(() => {
		Clipboard.setString(currentWebhook?.url || webhook?.url);
		setIsCopied(true);
	}, [currentWebhook?.url, webhook?.url]);

	const handleDeleteWebhook = useCallback(async (webhook: ApiWebhook) => {
		if (isClanIntegration) {
			await dispatch(deleteClanWebhookById({ webhook: webhook, clanId }));
			await dispatch(fetchClanWebhooks({ clanId }));
		} else {
			await dispatch(deleteWebhookById({ webhook: webhook, channelId: webhook?.channel_id as string, clanId }));
			await dispatch(fetchWebhooks({ channelId: isClanSetting ? '0' : (webhook?.channel_id ?? ''), clanId: clanId }));
		}

		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });

		navigation.navigate(APP_SCREEN.MENU_CLAN.WEBHOOKS, {
			clanId,
			isClanSetting,
			isClanIntegration,
			channelId: webhook?.channel_id
		});
	}, [isClanIntegration, dispatch, clanId, isClanSetting, navigation]);

	const handleDeletePress = useCallback(() => {
		const data = {
			children: (
				<MezonConfirm
					confirmText={t('webhooksEdit.yes', { ns: 'clanIntegrationsSetting' })}
					title={t('webhooksEdit.deleteCaptionHook', { ns: 'clanIntegrationsSetting' })}
					children={
						<Text style={{ color: themeValue.white }}>
							{t('webhooksEdit.deleteWebhookConfirmation', {
								ns: 'clanIntegrationsSetting',
								webhookName: webhook?.webhook_name
							})}
						</Text>
					}
					onConfirm={() => handleDeleteWebhook(webhook)}
				/>
			)
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	}, [t, themeValue.white, webhook?.webhook_name, handleDeleteWebhook, webhook]);

	return (
		<View style={{ backgroundColor: themeValue.primary, width: '100%', height: '100%', padding: size.s_10 }}>
			<View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '20%' }}>
				<TouchableOpacity onPress={handleChooseFiles} style={styles.upload}>
					<Image
						style={styles.image}
						source={{
							uri: urlImageWebhook
						}}
					/>
					<MezonIconCDN
						icon={IconCDN.uploadPlusIcon}
						customStyle={styles.uploadIcon}
						height={size.s_20}
						width={size.s_20}
						color={themeValue.white}
					/>
				</TouchableOpacity>
				<Text style={styles.textRecommend}>{t('webhooksEdit.recommendImage', { ns: 'clanIntegrationsSetting' })}</Text>
			</View>
			<MezonInput label={'Name'} value={webhookName} onTextChange={handleChangeText} />

			{!isClanIntegration && <MezonMenu menu={menu} />}

			<View>
				<Text style={styles.label}>{t('webhooksEdit.webhookURL', { ns: 'clanIntegrationsSetting' })}</Text>
				<TouchableOpacity style={styles.btnLink} onPress={handleCopyToClipboard}>
					<Text style={styles.textBtnLink}>{currentWebhook?.url || webhook?.url}</Text>
					<Text style={styles.textLink}>
						{isCopied
							? t('webhooksEdit.copied', { ns: 'clanIntegrationsSetting' })
							: t('webhooksEdit.copy', { ns: 'clanIntegrationsSetting' })}
					</Text>
				</TouchableOpacity>
			</View>

			{isClanIntegration && (
				<TouchableOpacity style={styles.btnResetToken} onPress={handleResetToken}>
					<Text style={styles.textBtnDelete}>{t('webhooksEdit.resetToken', { ns: 'clanIntegrationsSetting' })}</Text>
				</TouchableOpacity>
			)}

			<TouchableOpacity
				onPress={handleDeletePress}
				style={styles.btnDelete}
			>
				<Text style={styles.textBtnDelete}>{t('webhooksEdit.delete', { ns: 'clanIntegrationsSetting' })}</Text>
			</TouchableOpacity>
		</View>
	);
}
