import { ActionEmitEvent, load, STORAGE_ENCRYPTED_WALLET } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { selectAllAccount } from '@mezon/store-mobile';
import { sleep } from '@mezon/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, DeviceEventEmitter, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../constants/icon_cdn';
import { ModalConfirmPin } from './components/ModalConfirmPin';
import { ModalWalletSetupPin } from './components/ModalWalletSetupPin';
import { style } from './styles';
import WalletCrypto from './WalletCrypto';
global.Buffer = Buffer;

export const WalletManageScreen = ({ navigation }: any) => {
	const { t } = useTranslation(['token']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const userProfile = useSelector(selectAllAccount);
	const [walletData, setWalletData] = useState({
		address: '',
		privateKey: '',
		recoveryPhrase: '',
		showPrivateKey: false,
		showRecoveryPhrase: false,
		isEncrypted: false
	});
	const [loadingGenWallet, setLoadingGenWallet] = useState(false);

	useEffect(() => {
		loadWalletData();
	}, [userProfile]);

	const loadWalletData = async () => {
		if (!userProfile?.user?.id) return;
		try {
			const encryptedWalletStr = load(STORAGE_ENCRYPTED_WALLET);
			const encryptedWallet = JSON.parse(encryptedWalletStr || '{}');
			if (encryptedWallet?.address) {
				setWalletData((prev) => ({
					...prev,
					address: encryptedWallet.address || '',
					isEncrypted: true
				}));
			} else {
				if (userProfile?.user?.metadata) {
					try {
						const metadata = JSON.parse(userProfile.user.metadata);
						if (metadata.wallet) {
							setWalletData((prev) => ({
								...prev,
								address: metadata.wallet.address || '',
								privateKey: metadata.wallet.privateKey || '',
								recoveryPhrase: metadata.wallet.recoveryPhrase || '',
								isEncrypted: false
							}));
						}
					} catch (error) {
						console.error('Error parsing wallet metadata:', error);
					}
				}
			}
		} catch (error) {
			console.error('Error loading wallet data:', error);
		}
	};

	const validateMnemonic = (mnemonic: string): boolean => {
		return bip39.validateMnemonic(mnemonic);
	};

	const onGenerateNewWallet = async () => {
		setLoadingGenWallet(true);
		await sleep(200);
		try {
			let walletDataTemp = {
				address: '',
				privateKey: '',
				recoveryPhrase: '',
				showPrivateKey: false,
				showRecoveryPhrase: false,
				isEncrypted: false
			};
			const mnemonic = bip39.generateMnemonic(128);

			if (!validateMnemonic(mnemonic)) {
				Toast.show({
					type: 'error',
					text1: 'Generated mnemonic failed validation'
				});
				return;
			}
			const recoveryPhrase = mnemonic;
			const seed = bip39.mnemonicToSeedSync(mnemonic);
			const privateKey = (seed || '')?.slice?.(0, 32).toString('hex');
			const addressArray = crypto.getRandomValues(new Uint8Array(20));
			const address = '0x' + Array.from(addressArray, (byte) => byte.toString(16).padStart(2, '0')).join('');
			walletDataTemp = {
				...walletDataTemp,
				address,
				privateKey,
				recoveryPhrase
			};
			setLoadingGenWallet(false);
			const data = {
				children: <ModalWalletSetupPin walletData={walletDataTemp} />
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		} catch (error) {
			setLoadingGenWallet(false);
			console.error('Error generating wallet:', error);
			Toast.show({
				type: 'error',
				text1: 'Error generating wallet'
			});
		}
	};

	const onShowModalConfirmPin = (type: 'privateKey' | 'recoveryPhrase') => {
		const data = {
			children: <ModalConfirmPin onSubmit={(passcode) => decryptAndShow(type, passcode)} />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	};

	const decryptAndShow = async (type: 'privateKey' | 'recoveryPhrase', passcode: string) => {
		try {
			const encryptedWalletStr = load(STORAGE_ENCRYPTED_WALLET);
			const encryptedWallet = JSON.parse(encryptedWalletStr || '{}');
			if (!encryptedWallet) return;

			if (type === 'privateKey') {
				const { encryptedData, salt, iv } = encryptedWallet.encryptedPrivateKey;
				const decryptedPrivateKey = await WalletCrypto.decryptPrivateKey(encryptedData, salt, iv, passcode);
				setWalletData((prev) => ({
					...prev,
					privateKey: decryptedPrivateKey,
					showPrivateKey: true
				}));
			} else {
				const { encryptedData, salt, iv } = encryptedWallet.encryptedRecoveryPhrase;
				const decryptedRecoveryPhrase = await WalletCrypto.decryptPrivateKey(encryptedData, salt, iv, passcode);
				setWalletData((prev) => ({
					...prev,
					recoveryPhrase: decryptedRecoveryPhrase,
					showRecoveryPhrase: true
				}));
			}
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Incorrect passcode or corrupted data'
			});
		}
	};

	const handleActionCopyText = (text: string) => {
		Clipboard.setString(text);
		Toast.show({
			type: 'info',
			text1: t('copyText')
		});
	};
	return (
		<View style={styles.container}>
			{!walletData.address ? (
				<View style={styles.form}>
					<View style={styles.empty}>
						<View style={styles.iconEmpty}>
							<MezonIconCDN icon={IconCDN.wallet} height={size.s_30} width={size.s_30} color={themeValue.text} />
						</View>
						<Text style={styles.text}>{t('notWalletFound')}</Text>
					</View>
					<TouchableOpacity disabled={loadingGenWallet} style={styles.button} onPress={onGenerateNewWallet}>
						{loadingGenWallet ? (
							<ActivityIndicator size="small" color={themeValue.black} />
						) : (
							<Text style={styles.textButton}>{t('genNewWallet')}</Text>
						)}
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: size.s_100 }}>
					{/* Wallet Address */}
					<View style={styles.section}>
						<Text style={styles.label}>{t('walletAddress')}</Text>
						<View style={styles.valueBox}>
							<Text style={styles.valueText} numberOfLines={1} ellipsizeMode="middle">
								{walletData.address}
							</Text>
							<TouchableOpacity style={styles.copyButton} onPress={() => handleActionCopyText(walletData.address)}>
								<MezonIconCDN icon={IconCDN.copyIcon} width={size.s_16} height={size.s_24} color={themeValue.text} />
							</TouchableOpacity>
						</View>
					</View>

					{/* Private Key */}
					<View style={styles.section}>
						<Text style={styles.label}>{t('wallet.privateKey.title')}</Text>

						{walletData?.showPrivateKey && walletData?.privateKey ? (
							<View style={styles.valueBox}>
								<Text style={styles.valueText} numberOfLines={1} ellipsizeMode="middle">
									{walletData?.privateKey}
								</Text>
								<TouchableOpacity style={styles.copyButton} onPress={() => handleActionCopyText(walletData?.privateKey)}>
									<MezonIconCDN icon={IconCDN.copyIcon} width={size.s_16} height={size.s_24} color={themeValue.text} />
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity style={styles.valueBox} onPress={() => onShowModalConfirmPin('privateKey')}>
								<MezonIconCDN icon={IconCDN.eyeIcon} width={size.s_16} height={size.s_24} color={themeValue.text} />
								<Text style={styles.showButtonText}>
									{walletData?.showPrivateKey ? t('wallet.privateKey.hide') : t('wallet.privateKey.show')}
								</Text>
							</TouchableOpacity>
						)}
					</View>

					{/* Secret Recovery Phrase */}
					<View style={styles.section}>
						<Text style={styles.label}>{t('wallet.secretPhrase.title')}</Text>
						{walletData?.showRecoveryPhrase ? (
							<View>
								<View style={styles.phraseContainer}>
									{walletData.recoveryPhrase.split(' ').map((word, index) => (
										<View key={index} style={styles.wordBox}>
											<Text style={styles.wordIndex}>{index + 1}</Text>
											<Text style={styles.word}>{word}</Text>
										</View>
									))}
								</View>
								<TouchableOpacity style={styles.valueBox} onPress={() => handleActionCopyText(walletData?.recoveryPhrase)}>
									<MezonIconCDN icon={IconCDN.copyIcon} width={size.s_16} height={size.s_24} color={themeValue.text} />
									<Text style={styles.showButtonText}>{t('copyToClipboard')}</Text>
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity style={styles.valueBox} onPress={() => onShowModalConfirmPin('recoveryPhrase')}>
								<MezonIconCDN icon={IconCDN.eyeIcon} width={size.s_16} height={size.s_24} color={themeValue.text} />
								<Text style={styles.showButtonText}>
									{walletData?.showRecoveryPhrase ? t('wallet.secretPhrase.hide') : t('wallet.secretPhrase.show')}
								</Text>
							</TouchableOpacity>
						)}
					</View>

					{/* Warning Box */}
					<View style={styles.warningBox}>
						<Text style={styles.warningTitle}>{t('warning.title')}</Text>
						<Text style={styles.warningText}>• {t('warning.1')}</Text>
						<Text style={styles.warningText}>• {t('warning.2')}</Text>
						<Text style={styles.warningText}>• {t('warning.3')}</Text>
						<Text style={styles.warningText}>• {t('warning.4')}</Text>
					</View>
				</ScrollView>
			)}
		</View>
	);
};
