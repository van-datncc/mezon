import { size, useTheme } from '@mezon/mobile-ui';
import { selectAccountCustomStatus, selectAllAccount } from '@mezon/store-mobile';
import { createImgproxyUrl, formatMoney } from '@mezon/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import { Grid } from 'react-native-animated-spinkit';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import RNQRGenerator from 'rn-qr-generator';
import MezonIconCDN from '../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../constants/icon_cdn';
import { useImage } from '../../../hooks/useImage';
import { style } from './styles';

type TabType = 'profile' | 'transfer';

interface QRCodeCache {
	profile: string;
	transfer: string;
}

export const MyQRCode = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue) as any;
	const { t } = useTranslation(['profile']);
	const userProfile = useSelector(selectAllAccount);
	const userCustomStatus = useSelector(selectAccountCustomStatus);
	const { saveImageToCameraRoll } = useImage();
	const [activeTab, setActiveTab] = useState<TabType>('profile');
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const qrCodeCache = useRef<QRCodeCache>({ profile: '', transfer: '' });
	const lastPayloadRef = useRef<{ profile: string; transfer: string }>({ profile: '', transfer: '' });

	const tokenInWallet = useMemo(() => {
		return userProfile?.wallet || 0;
	}, [userProfile?.wallet]);

	const profilePayload = useMemo(() => {
		try {
			const payload = {
				id: userProfile?.user?.id,
				avatar: userProfile?.user?.avatar_url,
				name: userProfile?.user?.display_name
			};

			const encodedPayload = btoa(encodeURIComponent(JSON.stringify(payload)));
			const deeplink = process.env.NX_CHAT_APP_REDIRECT_URI + `/chat/${userProfile?.user?.username}?data=${encodedPayload}`;

			return deeplink;
		} catch (error) {
			console.log('Error QR Profile Payload', error);
			return '';
		}
	}, [userProfile?.user?.id, userProfile?.user?.avatar_url, userProfile?.user?.username, userProfile?.user?.display_name]);

	const transferPayload = useMemo(() => {
		const data = {
			receiver_name: userProfile?.user?.username,
			receiver_id: userProfile?.user?.id
		};
		return JSON.stringify(data);
	}, [userProfile?.user?.id, userProfile?.user?.username]);

	const generateQRCode = useCallback(async (type: TabType) => {
		const payload = type === 'profile' ? profilePayload : transferPayload;

		if (lastPayloadRef.current[type] === payload && qrCodeCache.current[type]) {
			return qrCodeCache.current[type];
		}

		setIsGenerating(true);
		try {
			const res = await RNQRGenerator.generate({
				value: payload,
				height: Number(size.s_150 * 2.5),
				width: Number(size.s_150 * 2.5),
				correctionLevel: 'L'
			});

			qrCodeCache.current[type] = res?.uri || '';
			lastPayloadRef.current[type] = payload;

			return res?.uri || '';
		} catch (error) {
			console.log('Error generating QR code:', error);
			return '';
		} finally {
			setIsGenerating(false);
		}
	}, [profilePayload, transferPayload]);

	const handleTabChange = useCallback((tab: TabType) => {
		setActiveTab(tab);
	}, []);

	const handleDownloadQRCode = useCallback(async () => {
		try {
			const qrCodeUri = qrCodeCache.current.profile;
			if (!qrCodeUri) return;
			const filePath = qrCodeUri.startsWith('file://') ? qrCodeUri : `file://${qrCodeUri}`;
			await saveImageToCameraRoll(filePath, 'image', true);
		} catch (e) {
			console.log('QR Code download error:', e);
		}
	}, [saveImageToCameraRoll]);

	const handleShareQRCode = useCallback(async () => {
		try {
			const qrCodeUri = qrCodeCache.current.profile;
			if (!qrCodeUri) return;
			await Share.share({
				url: qrCodeUri,
				message: profilePayload || ''
			});
		} catch (e) {
			console.log('QR Code share error:', e);
		}
	}, [profilePayload]);

	const currentQRCode = useMemo(() => {
		return qrCodeCache.current[activeTab];
	}, [activeTab, qrCodeCache.current[activeTab]]);

	useEffect(() => {
		generateQRCode(activeTab);
	}, [generateQRCode, activeTab]);

	const renderTabButton = useCallback((tab: TabType, label: string) => (
		<TouchableOpacity
			style={[
				styles.tabButton,
				activeTab === tab && styles.activeTabButton
			]}
			onPress={() => handleTabChange(tab)}
		>
			<Text style={[
				styles.tabButtonText,
				activeTab === tab && styles.activeTabButtonText
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	), [activeTab, handleTabChange, styles]);

	const userInfo = useMemo(() => ({
		avatarUrl: userProfile?.user?.avatar_url,
		username: userProfile?.user?.username,
		displayName: userProfile?.user?.display_name,
	}), [userProfile?.user?.avatar_url, userProfile?.user?.username, userProfile?.user?.display_name, userCustomStatus]);

	const actionButtons = useMemo(() => {
		if (activeTab !== 'profile') return null;

		return (
			<View style={styles.actionsRow}>
				<TouchableOpacity style={styles.actionButton} onPress={handleDownloadQRCode}>
					<MezonIconCDN icon={IconCDN.downloadIcon} color={themeValue.primary} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={handleShareQRCode}>
					<MezonIconCDN icon={IconCDN.shareIcon} color={themeValue.primary} />
				</TouchableOpacity>
			</View>
		);
	}, [activeTab, handleDownloadQRCode, handleShareQRCode]);

	return (
		<View style={styles.container}>
			<View style={styles.tabContainer}>
				{renderTabButton('profile', t('qr_profile', 'QR Profile'))}
				{renderTabButton('transfer', t('qr_transfer', 'QR Transfer'))}
			</View>

			<LinearGradient
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 0 }}
				colors={[themeValue.primary, themeValue.secondaryLight]}
				style={[styles.card, { minHeight: size.s_100 * 5.5 }]}
			>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingBottom: size.s_14,
						gap: size.s_14,
						borderBottomColor: themeValue.border,
						borderBottomWidth: 1
					}}
				>
					{userInfo.avatarUrl ? (
						<FastImage
							source={{
								uri: createImgproxyUrl(userInfo.avatarUrl, { width: 200, height: 200, resizeType: 'fit' })
							}}
							style={styles.avatar}
						/>
					) : (
						<View style={styles.defaultAvatar}>
							<Text style={styles.textAvatar}>{userInfo.username?.charAt?.(0)?.toUpperCase()}</Text>
						</View>
					)}

					<View>
						<Text style={styles.nameProfile}>{userInfo.username || userInfo.displayName}</Text>
						<Text style={styles.tokenProfile}>
							{activeTab === 'profile'
								? "Share with others"
								: `${t('token')} ${formatMoney(Number(tokenInWallet || 0))}₫`
							}
						</Text>
					</View>
				</View>

				<View style={styles.qrContainer}>
					{(isGenerating || !currentQRCode) ? (
						<Grid color={themeValue.text} size={size.s_50} />
					) : (
						<View style={styles.qrWrapper}>
							<FastImage source={{ uri: currentQRCode }} style={styles.imageQR} />
						</View>
					)}
				</View>

				{actionButtons}

				<View style={styles.descriptionContainer}>
					<Text style={styles.descriptionText}>
						{activeTab === 'profile'
							? t('qr_profile_description', 'Scan this QR code to chat with me or view my profile')
							: t('qr_transfer_description', 'Scan this QR code to transfer funds')
						}
					</Text>
				</View>
			</LinearGradient>
		</View>
	);
};
