import { useThreads } from '@mezon/core';
import { size, useTheme } from '@mezon/mobile-ui';
import {
	ChannelsEntity,
	ThreadsEntity,
	selectActiveThreads,
	selectCurrentChannel,
	selectJoinedThreadsWithinLast30Days,
	selectShowEmptyStatus,
	selectThreadsOlderThan30Days,
	threadsActions,
	useAppDispatch
} from '@mezon/store-mobile';
import { checkIsThread, normalizeString } from '@mezon/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN, MenuThreadScreenProps } from '../../navigation/ScreenTypes';
import EmptyThread from './EmptyThread';
import GroupThread from './GroupThread';
import { SearchThreadsBar } from './SearchThread';
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

	useEffect(() => {
		const fetchThreads = async () => {
			const body = {
				channelId: isThread ? (currentChannel?.parrent_id ?? '') : (currentChannel?.channel_id ?? ''),
				clanId: currentChannel?.clan_id ?? '',
				noCache: true
			};
			await dispatch(threadsActions.fetchThreads(body));
		};

		fetchThreads();
	}, [currentChannel, dispatch, isThread]);

	const isEmpty = useSelector(selectShowEmptyStatus());
	const getActiveThreads = useSelector(selectActiveThreads(''));
	const getJoinedThreadsWithinLast30Days = useSelector(selectJoinedThreadsWithinLast30Days(''));
	const getThreadsOlderThan30Days = useSelector(selectThreadsOlderThan30Days(''));

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

	const ActiveThreadFilter = useMemo(() => {
		if (!getActiveThreads?.length) {
			return [];
		}
		return getActiveThreads?.filter((thread) => normalizeString(thread.channel_label).includes(normalizeString(searchText)));
	}, [getActiveThreads, searchText]);

	const JoinedThreadFilter = useMemo(() => {
		if (!getJoinedThreadsWithinLast30Days?.length) {
			return [];
		}
		return getJoinedThreadsWithinLast30Days?.filter((thread) => normalizeString(thread.channel_label).includes(normalizeString(searchText)));
	}, [getJoinedThreadsWithinLast30Days, searchText]);

	const OlderThreadFilter = useMemo(() => {
		if (!getThreadsOlderThan30Days?.length) {
			return [];
		}
		return getThreadsOlderThan30Days?.filter((thread) => normalizeString(thread.channel_label).includes(normalizeString(searchText)));
	}, [getThreadsOlderThan30Days, searchText]);

	const debouncedSetSearchText = useCallback((value) => {
		setSearchText(value);
	}, []);

	return (
		// TODO: MezonMenu??
		<View style={styles.createChannelContainer}>
			<SearchThreadsBar onTextChanged={debouncedSetSearchText} />
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: size.s_50, paddingTop: size.s_10 }}>
				{JoinedThreadFilter?.length > 0 && (
					<GroupThread
						title={
							JoinedThreadFilter?.length > 1
								? `${JoinedThreadFilter?.length} ${t('joinedThreads')}`
								: `${JoinedThreadFilter?.length} ${t('joinedThread')}`
						}
					>
						{JoinedThreadFilter?.map((thread: ThreadsEntity) => <ThreadItem thread={thread} key={`${thread.id}-joined-threads`} />)}
					</GroupThread>
				)}
				{ActiveThreadFilter?.length > 0 && (
					<GroupThread
						title={
							ActiveThreadFilter?.length > 1
								? `${getActiveThreads?.length} ${t('otherActiveThreads')}`
								: `${getActiveThreads?.length} ${t('otherActiveThread')}`
						}
					>
						{getActiveThreads?.map((thread: ThreadsEntity) => <ThreadItem thread={thread} key={`${thread.id}-other-active-threads`} />)}
					</GroupThread>
				)}
				{OlderThreadFilter?.length > 0 && (
					<GroupThread
						title={
							OlderThreadFilter?.length > 1
								? `${OlderThreadFilter?.length} ${t('olderThreads')}`
								: `${OlderThreadFilter?.length} ${t('olderThread')}`
						}
					>
						{OlderThreadFilter?.map((thread: ThreadsEntity) => <ThreadItem thread={thread} key={`${thread.id}-older-threads`} />)}
					</GroupThread>
				)}
			</ScrollView>
			{isEmpty && <EmptyThread onPress={handleNavigateCreateForm} />}
		</View>
	);
}
