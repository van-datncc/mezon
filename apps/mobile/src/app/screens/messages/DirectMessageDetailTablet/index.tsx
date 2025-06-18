import { ActionEmitEvent, STORAGE_CLAN_ID, STORAGE_IS_DISABLE_LOAD_BACKGROUND, load, save } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import {
	appActions,
	clansActions,
	directActions,
	getStoreAsync,
	messagesActions,
	selectCurrentChannel,
	selectDmGroupCurrent
} from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState, DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ChatMessageWrapper } from '../ChatMessageWrapper';
import HeaderDirectMessage, { ChannelSeen } from '../DirectMessageDetail/HeaderDirectMessage';
import { style } from './styles';

export const DirectMessageDetailTablet = ({ directMessageId }: { directMessageId?: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const currentDmGroup = useSelector(selectDmGroupCurrent(directMessageId ?? ''));

	const currentChannel = useSelector(selectCurrentChannel);
	const isFetchMemberChannelDmRef = useRef(false);
	const isModeDM = useMemo(() => {
		return Number(currentDmGroup?.type) === ChannelType.CHANNEL_TYPE_DM;
	}, [currentDmGroup?.type]);

	const dmType = useMemo(() => {
		return currentDmGroup?.type;
	}, [currentDmGroup?.type]);

	const fetchMemberChannel = useCallback(async () => {
		const currentClanIdCached = await load(STORAGE_CLAN_ID);
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, null);

		if (!currentClanIdCached) {
			return;
		}
		const store = await getStoreAsync();
		store.dispatch(clansActions.setCurrentClanId(currentClanIdCached));
		// Rejoin previous clan (other than 0) when exiting the DM detail screen
		store.dispatch(clansActions.joinClan({ clanId: currentClanIdCached }));
	}, []);

	const directMessageLoader = useCallback(async () => {
		const store = await getStoreAsync();
		await Promise.all([
			store.dispatch(clansActions.setCurrentClanId('0')),
			store.dispatch(
				directActions.joinDirectMessage({
					directMessageId: directMessageId,
					type: dmType,
					noCache: true,
					isFetchingLatestMessages: true,
					isClearMessage: true
				})
			)
		]);
		save(STORAGE_CLAN_ID, currentChannel?.clan_id);
	}, [currentChannel?.clan_id, directMessageId, dmType]);

	useEffect(() => {
		const onMentionHashtagDM = DeviceEventEmitter.addListener(ActionEmitEvent.FETCH_MEMBER_CHANNEL_DM, ({ isFetchMemberChannelDM }) => {
			isFetchMemberChannelDM.current = isFetchMemberChannelDM;
		});
		return () => {
			onMentionHashtagDM.remove();
		};
	}, []);

	useEffect(() => {
		return () => {
			if (!isFetchMemberChannelDmRef.current) {
				fetchMemberChannel();
			}
		};
	}, [fetchMemberChannel, isFetchMemberChannelDmRef]);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (directMessageId) {
			timeout = setTimeout(() => {
				requestAnimationFrame(async () => {
					await directMessageLoader();
				});
			}, 100);
		}

		return () => {
			timeout && clearTimeout(timeout);
		};
	}, [directMessageId]);

	useEffect(() => {
		const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

		return () => {
			appStateSubscription.remove();
		};
	}, [directMessageId, directMessageId]);

	const handleAppStateChange = async (state: string) => {
		if (state === 'active') {
			try {
				const store = await getStoreAsync();
				save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, true);
				store.dispatch(
					messagesActions.fetchMessages({
						channelId: directMessageId,
						noCache: true,
						isFetchingLatestMessages: true,
						isClearMessage: true,
						clanId: '0'
					})
				);
				save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, false);
			} catch (error) {
				const store = await getStoreAsync();
				store.dispatch(appActions.setIsFromFCMMobile(false));
				save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, false);
			}
		}
	};

	return (
		<View style={styles.dmMessageContainer}>
			<ChannelSeen channelId={directMessageId || ''} currentDmGroup={currentDmGroup} />
			<HeaderDirectMessage directMessageId={directMessageId} styles={styles} themeValue={themeValue} />
			{directMessageId && (
				<ChatMessageWrapper
					directMessageId={directMessageId}
					isModeDM={isModeDM}
					currentClanId={'0'}
					targetUserId={currentDmGroup?.user_id?.[0]}
				/>
			)}
		</View>
	);
};
