import {
	ActionEmitEvent,
	getUpdateOrAddClanChannelCache,
	Icons,
	load,
	save,
	STORAGE_CHANNEL_CURRENT_CACHE,
	STORAGE_DATA_CLAN_CHANNEL_CACHE
} from '@mezon/mobile-components';
import { Block, size, useTheme } from '@mezon/mobile-ui';
import { channelsActions, ChannelsEntity, getStoreAsync, selectAllChannelsFavorite } from '@mezon/store-mobile';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Linking, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import useTabletLandscape from '../../../../../../hooks/useTabletLandscape';
import { AppStackScreenProps } from '../../../../../../navigation/ScreenTypes';
import { linkGoogleMeet } from '../../../../../../utils/helpers';
import { StatusVoiceChannel } from '../ChannelListItem';
import { ChannelFavoriteItem } from './ChannelFavoriteItem';
import { style } from './styles';

export const ChannelListFavorite = React.memo(() => {
	const channelFavorites = useSelector(selectAllChannelsFavorite);

	const { themeValue } = useTheme();
	const [isCollapse, setIsCollapse] = useState<boolean>(false);
	const styles = style(themeValue);
	const { t } = useTranslation('channelMenu');
	const handleCollapse = () => {
		setIsCollapse(!isCollapse);
	};
	const isTabletLandscape = useTabletLandscape();
	const navigation = useNavigation<AppStackScreenProps['navigation']>();
	const timeoutRef = useRef<any>();

	useEffect(() => {
		return () => {
			timeoutRef.current && clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleScrollToChannelFavorite = useCallback(
		async (channel?: ChannelsEntity) => {
			if (channel?.type === ChannelType.CHANNEL_TYPE_GMEET_VOICE) {
				if (channel?.status === StatusVoiceChannel.Active && channel?.meeting_code) {
					const urlVoice = `${linkGoogleMeet}${channel?.meeting_code}`;
					await Linking.openURL(urlVoice);
				}
			} else {
				const channelId = channel?.channel_id || '';
				const clanId = channel?.clan_id || '';
				const store = await getStoreAsync();
				const channelsCache = load(STORAGE_CHANNEL_CURRENT_CACHE) || [];
				const isCached = channelsCache?.includes(channelId);
				store.dispatch(channelsActions.setCurrentChannelId({ clanId, channelId }));
				if (!isTabletLandscape) {
					navigation.dispatch(DrawerActions.closeDrawer());
				}
				store.dispatch(channelsActions.setIdChannelSelected({ clanId, channelId }));
				timeoutRef.current = setTimeout(async () => {
					DeviceEventEmitter.emit(ActionEmitEvent.ON_SWITCH_CHANEL, isCached ? 100 : 0);
					store.dispatch(
						channelsActions.joinChannel({
							clanId: clanId ?? '',
							channelId: channelId,
							noFetchMembers: false,
							isClearMessage: true,
							noCache: true
						})
					);
				}, 0);
				const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
				save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
			}
		},
		[isTabletLandscape, navigation]
	);

	return (
		<Block>
			{channelFavorites?.length ? (
				<Block width={'100%'} paddingHorizontal={size.s_8} paddingVertical={size.s_10}>
					<TouchableOpacity onPress={handleCollapse} style={styles.categoryItem}>
						<Icons.ChevronSmallDownIcon
							width={size.s_20}
							height={size.s_20}
							color={themeValue.text}
							style={[isCollapse && { transform: [{ rotate: '-90deg' }] }]}
						/>
						<Text style={styles.categoryItemTitle}>{t('favoriteChannel')}</Text>
					</TouchableOpacity>
					<Block display={isCollapse ? 'none' : 'flex'}>
						{channelFavorites?.length
							? channelFavorites?.map((channelId: string, index: number) => (
									<ChannelFavoriteItem
										onPress={handleScrollToChannelFavorite}
										channelId={channelId}
										key={`${index}_${channelId}_ChannelItemFavorite`}
									/>
								))
							: null}
					</Block>
				</Block>
			) : null}
		</Block>
	);
});
