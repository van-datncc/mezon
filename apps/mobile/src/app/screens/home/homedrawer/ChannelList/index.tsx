import { hasNonEmptyChannels } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { appActions, useAppDispatch } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { InteractionManager, ScrollView, View } from 'react-native';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import { AppStackScreenProps } from '../../../../navigation/ScreenTypes';
import { ChannelListContext } from '../Reusables';
import ChannelListBackground from '../components/ChannelList/ChannelListBackground';
import ChannelListBottomSheet from '../components/ChannelList/ChannelListBottomSheet';
import { ChannelListFavorite } from '../components/ChannelList/ChannelListFavorite';
import ChannelListHeader from '../components/ChannelList/ChannelListHeader';
import ChannelListLoading from '../components/ChannelList/ChannelListLoading';
import ChannelListScroll from '../components/ChannelList/ChannelListScroll';
import ChannelListSection from '../components/ChannelList/ChannelListSection';
import ButtonNewUnread from './ButtonNewUnread';
import { style } from './styles';
export type ChannelsPositionRef = {
	current: {
		[key: number]: {
			height: number;
			cateId?: string | number;
		};
	};
};

const ChannelList = React.memo(({ categorizedChannels }: { categorizedChannels: any }) => {
	const { themeValue } = useTheme();
	const isTabletLandscape = useTabletLandscape();
	const styles = style(themeValue, isTabletLandscape);

	const navigation = useNavigation<AppStackScreenProps['navigation']>();
	const flashListRef = useRef(null);
	const channelsPositionRef = useRef<ChannelsPositionRef>();
	const dispatch = useAppDispatch();

	const handleLayout = useCallback(
		(event, item) => {
			if (item) {
				const { y } = event?.nativeEvent?.layout || {};
				InteractionManager.runAfterInteractions(() => {
					dispatch(appActions.setCategoryChannelOffsets({ [item?.category_id]: Math.round(y) }));
				});
			}
		},
		[dispatch]
	);

	const renderItemChannelList = useCallback(
		({ item, index }) => {
			return (
				<View onLayout={(e) => handleLayout(e, item)} key={`${item?.category_id}_${index}_ItemChannelList}`}>
					<ChannelListSection channelsPositionRef={channelsPositionRef} data={item} />
				</View>
			);
		},
		[handleLayout]
	);

	return (
		<ChannelListContext.Provider value={{ navigation: navigation }}>
			<View style={styles.mainList}>
				<ScrollView
					stickyHeaderIndices={[1]}
					showsVerticalScrollIndicator={false}
					ref={flashListRef}
					scrollEventThrottle={16}
					removeClippedSubviews={false}
					nestedScrollEnabled={true}
					bounces={false}
				>
					<ChannelListBackground />
					<ChannelListHeader />
					<ChannelListFavorite />
					<ChannelListLoading isNonChannel={hasNonEmptyChannels(categorizedChannels || [])} />
					<ChannelListScroll channelsPositionRef={channelsPositionRef} flashListRef={flashListRef} />
					{!!categorizedChannels?.length &&
						categorizedChannels?.map((item, index) => {
							return renderItemChannelList({ item, index });
						})}
					<View style={{ height: 80 }} />
				</ScrollView>

				<ButtonNewUnread />
			</View>

			<ChannelListBottomSheet />
		</ChannelListContext.Provider>
	);
});

export default ChannelList;
