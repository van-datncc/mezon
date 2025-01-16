import { useCategory } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { RootState, selectAllClans, selectIsShowEmptyCategory } from '@mezon/store-mobile';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import useTabletLandscape from '../../../hooks/useTabletLandscape';
import BackNativeListener from './BackNativeListener';
import ChannelList from './ChannelList';
import ProfileBar from './ProfileBar';
import ServerList from './ServerList';
import UserEmptyClan from './UserEmptyClan';
import { style } from './styles';

const ChannelListWrapper = React.memo(() => {
	const clans = useSelector(selectAllClans);
	const clansLoadingStatus = useSelector((state: RootState) => state?.clans?.loadingStatus);
	const { categorizedChannels: categorizedChannelsRaw } = useCategory();
	const isShowEmptyCategory = useSelector(selectIsShowEmptyCategory);
	const previousCategorizedChannels = useRef(null);

	const categorizedChannels = useMemo(() => {
		if (!categorizedChannelsRaw?.length && !!previousCategorizedChannels?.current) {
			return previousCategorizedChannels?.current;
		}
		const dataFormat = categorizedChannelsRaw.map((item) => {
			if (!isShowEmptyCategory && item?.channels?.length === 0) {
				return null;
			}
			return item;
		});
		previousCategorizedChannels.current = dataFormat;
		return dataFormat;
	}, [categorizedChannelsRaw, isShowEmptyCategory]);

	return (
		<>
			{clansLoadingStatus === 'loaded' && !clans?.length ? (
				<UserEmptyClan />
			) : (
				<MemoizedChannelList categorizedChannels={categorizedChannels} />
			)}
		</>
	);
});

const MemoizedChannelList = React.memo(ChannelList, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.categorizedChannels) === JSON.stringify(nextProps.categorizedChannels);
});

const DrawerContent = React.memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const isTabletLandscape = useTabletLandscape();

	return (
		<View style={[styles.containerDrawerContent, { backgroundColor: isTabletLandscape ? themeValue.tertiary : themeValue.primary }]}>
			<View style={styles.container}>
				<View style={styles.rowContainer}>
					<ServerList />
					{!isTabletLandscape && <BackNativeListener />}
					<ChannelListWrapper />
				</View>
				{isTabletLandscape && <ProfileBar />}
			</View>
			{isTabletLandscape && <View style={styles.wall}></View>}
		</View>
	);
});

export default DrawerContent;
