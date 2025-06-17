import { useTheme } from '@mezon/mobile-ui';
import { selectAllAccount } from '@mezon/store-mobile';
import { formatNumber } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { style } from './styles';

export const WalletManageScreen = ({ navigation }: any) => {
	const { t } = useTranslation(['token']);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const userProfile = useSelector(selectAllAccount);

	const tokenInWallet = useMemo(() => {
		return userProfile?.wallet || 0;
	}, [userProfile?.wallet]);

	return (
		<View style={styles.container}>
			<ScrollView style={styles.form}>
				<Text style={styles.heading}>{t('management')}</Text>
				<LinearGradient
					start={{ x: 1, y: 1 }}
					end={{ x: 0, y: 1 }}
					colors={[themeValue.secondaryLight, themeValue.colorAvatarDefault]}
					style={styles.cardWallet}
				>
					<View style={styles.cardWalletWrapper}>
						<View style={styles.cardWalletLine}>
							<Text style={styles.cardTitle}>{t('debitAccount')}</Text>
							<Text style={styles.cardTitle}>{userProfile?.user?.username || userProfile?.user?.display_name}</Text>
						</View>
						<View style={styles.cardWalletLine}>
							<Text style={styles.cardTitle}>{t('balance')}</Text>
							<Text style={styles.cardAmount}>{tokenInWallet ? formatNumber(Number(tokenInWallet), 'vi-VN', 'VND') : '0'}</Text>
						</View>
					</View>
				</LinearGradient>
			</ScrollView>
		</View>
	);
};
