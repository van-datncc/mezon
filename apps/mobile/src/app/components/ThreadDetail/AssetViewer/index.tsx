import { attachmentActions, selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import Canvas from '../../Canvas';
import MediaChannel from '../../MediaChannel/MediaChannel';
import { MemberListStatus } from '../../MemberStatus';
import PinMessage from '../../PinMessage';
import AssetsHeader from '../AssetsHeader';
import { threadDetailContext } from '../MenuThreadDetail';
import styles from './style';

const TabList = [
	{
		title: 'Members'
	},
	{
		title: 'Media'
	},
	{
		title: 'Pins'
	},
	{
		title: 'Canvas'
	}
];

export const AssetsViewer = React.memo(({ channelId }: { channelId: string }) => {
	const ref = useRef<ScrollView>();
	const currentChannel = useContext(threadDetailContext);
	const [tabActive, setTabActive] = useState<number>(0);
	const currentClanId = useSelector(selectCurrentClanId);
	const dispatch = useAppDispatch();

	const headerTablist = useMemo(() => {
		if (currentChannel.parrent_id === '0') {
			return TabList;
		}
		const resultArray = TabList.slice(0, -1);
		return resultArray;
	}, []);

	const handelHeaderTabChange = useCallback(
		(index: number) => {
			setTabActive(index);
			if (index === 1) dispatch(attachmentActions.fetchChannelAttachments({ clanId: currentClanId, channelId: channelId }));
		},
		[channelId, currentClanId, dispatch]
	);

	return (
		<>
			<AssetsHeader tabActive={tabActive} onChange={handelHeaderTabChange} tabList={headerTablist} />
			<View style={styles.container}>
				<ScrollView horizontal pagingEnabled ref={ref} scrollEventThrottle={100}>
					{tabActive === 0 ? (
						<MemberListStatus />
					) : tabActive === 1 ? (
						<MediaChannel />
					) : tabActive === 3 && !!currentChannel.parrent_id ? (
						<Canvas
							channelId={
								[ChannelType.CHANNEL_TYPE_DM, ChannelType.CHANNEL_TYPE_GROUP].includes(currentChannel?.type)
									? currentChannel?.channel_id
									: channelId
							}
							clanId={currentClanId}
						/>
					) : (
						<PinMessage
							currentChannelId={
								[ChannelType.CHANNEL_TYPE_DM, ChannelType.CHANNEL_TYPE_GROUP].includes(currentChannel?.type)
									? currentChannel?.channel_id
									: channelId
							}
						/>
					)}
				</ScrollView>
			</View>
		</>
	);
});
