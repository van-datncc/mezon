import { useThreads } from '@mezon/core';
import { size, useTheme } from '@mezon/mobile-ui';
import {
	ChannelsEntity,
	RootState,
	ThreadsEntity,
	selectActiveThreads,
	selectCurrentChannel,
	selectJoinedThreadsWithinLast30Days,
	selectShowEmptyStatus,
	selectThreadsOlderThan30Days,
	threadsActions,
	useAppDispatch
} from '@mezon/store-mobile';
import { checkIsThread } from '@mezon/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuThreadScreenProps } from '../../navigation/ScreenTypes';
import EmptyThread from './EmptyThread';
import GroupThread from './GroupThread';
import { SearchThreadsBar } from './SearchThread';
import SkeletonThread from './SkeletonThread/SkeletonThread';
import ThreadAddButton from './ThreadAddButton';
import ThreadItem from './ThreadItem';
import { style } from './styles';

type CreateThreadModalScreen = typeof APP_SCREEN.MENU_THREAD.CREATE_THREAD;
export default function CreateThreadModal({ navigation, route }: MenuThreadScreenProps<CreateThreadModalScreen>) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { channelThreads } = route.params || {};
	const { t } = useTranslation(['createThread']);
	const [searchText, setSearchText] = useState<string>('');
	const { setValueThread } = useThreads();
	const dispatch = useAppDispatch();
	navigation.setOptions({
		headerShown: true,
		headerTitle: t('threads'),
		headerTitleAlign: 'center',
		headerRight: () => <ThreadAddButton onPress={handleNavigateCreateForm} />
	});

	const currentChannel = useSelector(selectCurrentChannel);
	const isThread = checkIsThread(currentChannel as ChannelsEntity);
	const loadingStatus = useSelector((state: RootState) => state?.threads?.loadingStatus);
	const isLoading = useMemo(() => ['loading']?.includes(loadingStatus), [loadingStatus]);

	useEffect(() => {
		fetchThreads();
	}, [currentChannel, dispatch, isThread]);

	const fetchThreads = async () => {
		const body = {
			channelId: isThread ? (currentChannel?.parrent_id ?? '') : (currentChannel?.channel_id ?? ''),
			clanId: currentChannel?.clan_id ?? '',
			noCache: true
		};
		await dispatch(threadsActions.fetchThreads(body));
	};

	const isEmpty = useSelector(selectShowEmptyStatus());
	const getActiveThreads = useSelector(selectActiveThreads(searchText));
	const getJoinedThreadsWithinLast30Days = useSelector(selectJoinedThreadsWithinLast30Days(searchText));
	const getThreadsOlderThan30Days = useSelector(selectThreadsOlderThan30Days(searchText));

	const handleNavigateCreateForm = useCallback(() => {
		dispatch(threadsActions.setOpenThreadMessageState(false));
		setValueThread(null);
		navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, {
			screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL,
			params: {
				channelThreads: channelThreads
			}
		});
	}, []);

	const debouncedSetSearchText = useCallback((value) => {
		setSearchText(value);
	}, []);

	return (
		// TODO: MezonMenu??
		<View style={styles.createChannelContainer}>
			{isLoading ? (
				<SkeletonThread numberSkeleton={12} />
			) : isEmpty ? (
				<EmptyThread onPress={handleNavigateCreateForm} />
			) : (
				<View>
					<SearchThreadsBar onTextChanged={debouncedSetSearchText} />
					<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: size.s_50, paddingTop: size.s_10 }}>
						{getJoinedThreadsWithinLast30Days?.length > 0 && (
							<GroupThread
								title={
									getJoinedThreadsWithinLast30Days?.length > 1
										? `${getJoinedThreadsWithinLast30Days?.length} ${t('joinedThreads')}`
										: `${getJoinedThreadsWithinLast30Days?.length} ${t('joinedThread')}`
								}
							>
								{getJoinedThreadsWithinLast30Days?.map((thread: ThreadsEntity) => (
									<ThreadItem thread={thread} key={`${thread.id}-joined-threads`} />
								))}
							</GroupThread>
						)}
						{getActiveThreads?.length > 0 && (
							<GroupThread
								title={
									getActiveThreads?.length > 1
										? `${getActiveThreads?.length} ${t('otherActiveThreads')}`
										: `${getActiveThreads?.length} ${t('otherActiveThread')}`
								}
							>
								{getActiveThreads?.map((thread: ThreadsEntity) => (
									<ThreadItem thread={thread} key={`${thread.id}-other-active-threads`} />
								))}
							</GroupThread>
						)}
						{getThreadsOlderThan30Days?.length > 0 && (
							<GroupThread
								title={
									getThreadsOlderThan30Days?.length > 1
										? `${getThreadsOlderThan30Days?.length} ${t('olderThreads')}`
										: `${getThreadsOlderThan30Days?.length} ${t('olderThread')}`
								}
							>
								{getThreadsOlderThan30Days?.map((thread: ThreadsEntity) => (
									<ThreadItem thread={thread} key={`${thread.id}-older-threads`} />
								))}
							</GroupThread>
						)}
					</ScrollView>
				</View>
			)}
		</View>
	);
}
