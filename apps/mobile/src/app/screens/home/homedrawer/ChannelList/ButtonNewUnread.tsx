import { useTheme } from '@mezon/mobile-ui';
import { selectChannelsByClanId, selectCurrentClanId, useAppSelector } from '@mezon/store';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import { style } from './styles';
type ButtonNewUnreadProps = {
	handleScrollToChannel: (id: string, isActiveScroll: boolean) => void;
};

const ButtonNewUnread = React.memo(({ handleScrollToChannel }: ButtonNewUnreadProps) => {
	const { themeValue } = useTheme();
	const isTabletLandscape = useTabletLandscape();
	const styles = style(themeValue, isTabletLandscape);
	const { t } = useTranslation('channelMenu');
	const currentClanId = useSelector(selectCurrentClanId);
	const channelsInClan = useAppSelector((state) => selectChannelsByClanId(state, currentClanId as string));

	const findFirstChannelWithBadgeCount = (channels = []) => channels?.find((item) => item?.count_mess_unread > 0) || null;

	const firstChannelBadgeCount = useMemo(() => {
		return findFirstChannelWithBadgeCount(channelsInClan);
	}, [channelsInClan]);

	if (firstChannelBadgeCount) {
		return (
			<TouchableOpacity
				onPress={() => {
					handleScrollToChannel(firstChannelBadgeCount?.channel_id, true);
				}}
				style={styles.buttonBadgeCount}
			>
				<Text style={styles.buttonBadgeCountText}>@{t('btnBadgeCount')}</Text>
			</TouchableOpacity>
		);
	}

	return <View />;
});

export default ButtonNewUnread;
