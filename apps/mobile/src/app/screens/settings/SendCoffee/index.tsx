import { useDirect, useSendInviteMessage } from '@mezon/core';
import { size, useTheme } from '@mezon/mobile-ui';
import { appActions, getStoreAsync, giveCoffeeActions, selectAllAccount, selectDirectsOpenlist, selectUpdateToken } from '@mezon/store-mobile';
import { TypeMessage, formatMoney } from '@mezon/utils';
import { ChannelStreamMode, safeJSONParse } from 'mezon-js';
import { ApiTokenSentEvent } from 'mezon-js/dist/api.gen';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { APP_SCREEN, SettingScreenProps } from '../../../navigation/ScreenTypes';
import { style } from './styles';

type ScreenSettingSendCoffee = typeof APP_SCREEN.SETTINGS.SEND_COFFEE;
export const SendCoffeeScreen = ({ navigation, route }: SettingScreenProps<ScreenSettingSendCoffee>) => {
	const { themeValue } = useTheme();
	const { t } = useTranslation(['token']);
	const styles = style(themeValue);
	const { formValue } = route.params;
	const jsonObject: ApiTokenSentEvent = safeJSONParse(formValue || '{}');
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [tokenCount, setTokenCount] = useState(jsonObject?.amount?.toString() || '1');
	const [note, setNote] = useState(jsonObject?.note || t('sendToken'));
	const [plainTokenCount, setPlainTokenCount] = useState(1);
	const userProfile = useSelector(selectAllAccount);
	const listDM = useSelector(selectDirectsOpenlist);
	const { createDirectMessageWithUser } = useDirect();
	const { sendInviteMessage } = useSendInviteMessage();

	const tokenInWallet = useMemo(() => {
		return userProfile?.wallet ? safeJSONParse(userProfile?.wallet || '{}')?.value : 0;
	}, [userProfile?.wallet]);
	const getTokenSocket = useSelector(selectUpdateToken(userProfile?.user?.id ?? ''));

	const directMessageId = useMemo(() => {
		const directMessage = listDM?.find?.((dm) => dm?.user_id?.length === 1 && dm?.user_id[0] === jsonObject?.receiver_id);
		return directMessage?.id;
	}, [jsonObject?.receiver_id, listDM]);

	const sendToken = async () => {
		const store = await getStoreAsync();
		try {
			if (Number(plainTokenCount || 0) <= 0) {
				Toast.show({
					type: 'error',
					text1: t('toast.error.amountMustThanZero')
				});
				return;
			}

			if (Number(plainTokenCount || 0) > Number(tokenInWallet)) {
				Toast.show({
					type: 'error',
					text1: t('toast.error.exceedWallet')
				});
				return;
			}
			store.dispatch(appActions.setLoadingMainMobile(true));

			const tokenEvent: ApiTokenSentEvent = {
				sender_id: userProfile?.user?.id || '',
				sender_name: userProfile?.user?.username || '',
				receiver_id: jsonObject?.receiver_id || '',
				extra_attribute: jsonObject?.extra_attribute || '',
				amount: Number(plainTokenCount || 1),
				note: note || ''
			};

			const res = store.dispatch(giveCoffeeActions.sendToken(tokenEvent));
			store.dispatch(giveCoffeeActions.updateTokenUser({ tokenEvent }));
			store.dispatch(appActions.setLoadingMainMobile(false));

			if (directMessageId) {
				sendInviteMessage(
					`${t('tokensSent')} ${formatMoney(Number(plainTokenCount || 1))}₫ | ${note || ''}`,
					directMessageId,
					ChannelStreamMode.STREAM_MODE_DM,
					TypeMessage.SendToken
				);
			} else {
				const response = await createDirectMessageWithUser(jsonObject?.receiver_id);
				if (response?.channel_id) {
					sendInviteMessage(
						`${t('tokensSent')} ${formatMoney(Number(plainTokenCount || 1))}₫ | ${note || ''}`,
						response?.channel_id,
						ChannelStreamMode.STREAM_MODE_DM,
						TypeMessage.SendToken
					);
				}
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			if (res?.action?.action?.requestStatus === 'rejected' || !res) {
				Toast.show({
					type: 'error',
					text1: t('toast.error.anErrorOccurred')
				});
			} else {
				setShowConfirmModal(true);
			}
		} catch (err) {
			store.dispatch(appActions.setLoadingMainMobile(false));
		}
	};

	const handleConfirmSuccessful = () => {
		setShowConfirmModal(false);
		navigation.pop(2);
	};

	const handleChangeText = (text: string) => {
		let sanitizedText = text.replace(/[^0-9]/g, '');

		if (sanitizedText === '') {
			setTokenCount('0');
			setPlainTokenCount(0);
			return;
		}

		sanitizedText = sanitizedText.replace(/^0+/, '');
		const numericValue = parseInt(sanitizedText, 10) || 0;

		setPlainTokenCount(numericValue);
		setTokenCount(numericValue.toLocaleString());
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.form}>
				<Text style={styles.heading}>{t('receiverInfo')}</Text>
				<View>
					<Text style={styles.title}>{t('username')}</Text>
					<View style={styles.textField}>
						<TextInput
							style={styles.textInput}
							placeholderTextColor="#535353"
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							value={jsonObject?.receiver_name || 'KOMU'}
							editable={false}
						/>
					</View>
				</View>
				<View>
					<Text style={styles.title}>{t('tokenCount')}</Text>
					<View style={styles.textField}>
						<TextInput
							style={styles.textInput}
							value={tokenCount}
							keyboardType="numeric"
							placeholderTextColor="#535353"
							editable={!jsonObject?.amount}
							onChangeText={handleChangeText}
						/>
					</View>
				</View>
				<View>
					<Text style={styles.title}>{t('note')}</Text>
					<View style={styles.textField}>
						<TextInput
							style={[styles.textInput, { height: size.s_100, paddingVertical: size.s_10, paddingTop: size.s_10 }]}
							placeholderTextColor="#535353"
							autoCapitalize="none"
							value={note}
							numberOfLines={5}
							multiline={true}
							editable={!jsonObject?.note}
							textAlignVertical="top"
							onChangeText={(text) => setNote(text)}
						/>
					</View>
				</View>
			</ScrollView>
			<Pressable style={styles.button} onPress={sendToken}>
				<Text style={styles.buttonTitle}>{t('sendToken')}</Text>
			</Pressable>
			<Modal
				isVisible={showConfirmModal}
				animationIn={'bounceIn'}
				animationOut={'bounceOut'}
				hasBackdrop={true}
				coverScreen={true}
				avoidKeyboard={false}
				backdropColor={'rgba(0,0,0, 0.7)'}
				deviceHeight={Dimensions.get('screen').height}
			>
				<View style={styles.modalContainer}>
					<View style={styles.heading}>
						<Text style={styles.heading}>{t('toast.success.sendSuccess')}</Text>
					</View>
					<TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirmSuccessful}>
						<Text style={styles.buttonTitle}>Ok</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</SafeAreaView>
	);
};
