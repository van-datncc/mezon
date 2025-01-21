import { Icons, load, save, STORAGE_AGE_RESTRICTED_CHANNEL_IDS } from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import { selectCurrentChannelId } from '@mezon/store-mobile';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { style } from './styles';

const AgeRestricted = ({ onClose }: { onClose: () => void }) => {
	const { themeValue } = useTheme();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const navigation = useNavigation<any>();
	const { t } = useTranslation('ageRestricted');
	const isTabletLandscape = useTabletLandscape();

	const styles = style(themeValue);
	const handleSaveChannel = () => {
		const storedData = load(STORAGE_AGE_RESTRICTED_CHANNEL_IDS) || '[]';
		const channelIds = JSON.parse(storedData);

		if (currentChannelId && !channelIds.includes(currentChannelId)) {
			channelIds.push(currentChannelId);
			save(STORAGE_AGE_RESTRICTED_CHANNEL_IDS, JSON.stringify(channelIds));
		}

		onClose();
	};

	const handleNode = useCallback(() => {
		if (isTabletLandscape) {
			navigation.dispatch(DrawerActions.openDrawer());
		}
	}, [isTabletLandscape]);

	return (
		<Block backgroundColor={themeValue.secondary} borderRadius={size.s_10} padding={size.s_20}>
			<Block flexDirection="row" alignItems="center" justifyContent="center">
				<Icons.AgeRestrictedWarningIcon width={size.s_100} height={size.s_100} />
			</Block>
			<Block>
				<Text style={styles.title}>{t('title')}</Text>
				<Text style={styles.description}>{t('des')}</Text>
			</Block>
			<Block marginTop={size.s_20} flexDirection="row" justifyContent="center" gap={size.s_30}>
				<TouchableOpacity style={styles.buttonNope} onPress={handleNode}>
					<Text style={styles.btnText}>{t('nope')}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttonContinue} onPress={handleSaveChannel}>
					<Text style={styles.btnText}>{t('continue')}</Text>
				</TouchableOpacity>
			</Block>
		</Block>
	);
};

export default React.memo(AgeRestricted);
