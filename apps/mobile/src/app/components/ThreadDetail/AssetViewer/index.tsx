import { attachmentActions, selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
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
	}
];

export const AssetsViewer = React.memo(({ channelId }: { channelId: string }) => {
	const ref = useRef<ScrollView>();
	const currentChannel = useContext(threadDetailContext);
	const [tabActive, setTabActive] = useState<number>(0);
	const currentClanId = useSelector(selectCurrentClanId);
	const dispatch = useAppDispatch();

	const handelHeaderTabChange = useCallback(
		(index: number) => {
			setTabActive(index);
			if (index === 1) dispatch(attachmentActions.fetchChannelAttachments({ clanId: currentClanId, channelId: channelId }));
		},
		[channelId, currentClanId, dispatch]
	);

	return (
		<>
			<AssetsHeader tabActive={tabActive} onChange={handelHeaderTabChange} tabList={TabList} />
			<View style={styles.container}>
				<ScrollView horizontal pagingEnabled ref={ref} scrollEventThrottle={100}>
					{tabActive === 0 ? (
						<MemberListStatus />
					) : tabActive === 1 ? (
						<MediaChannel />
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
