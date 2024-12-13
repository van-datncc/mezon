import { Block, useTheme } from '@mezon/mobile-ui';
import {
	messagesActions,
	selectCurrentChannel,
	selectCurrentClanId,
	selectCurrentTopicId,
	selectValueTopic,
	topicsActions,
	useAppDispatch
} from '@mezon/store-mobile';
import { checkIsThread, isPublicChannel } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import ShareLocationConfirmModal from '../../../../../components/ShareLocationConfirmModal';
import ChannelMessagesWrapper from '../../ChannelMessagesWrapper';
import { ChatBox } from '../../ChatBox';
import PanelKeyboard from '../../PanelKeyboard';
import { IModeKeyboardPicker } from '../BottomKeyboardPicker';
import TopicHeader from './TopicHeader/TopicHeader';
import { style } from './styles';

export default function TopicDiscussion() {
	const { themeValue } = useTheme();
	const currentTopicId = useSelector(selectCurrentTopicId);
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannel = useSelector(selectCurrentChannel);
	const panelKeyboardRef = useRef(null);
	const dispatch = useAppDispatch();
	const valueTopic = useSelector(selectValueTopic);

	const styles = style(themeValue);
	useEffect(() => {
		const fetchMsgResult = async () => {
			await dispatch(
				messagesActions.fetchMessages({
					channelId: currentChannel?.channel_id,
					clanId: currentClanId,
					topicId: currentTopicId || ''
				})
			);
		};
		if (currentTopicId !== '') {
			fetchMsgResult();
		}

		return () => {
			dispatch(topicsActions.setCurrentTopicId(''));
			dispatch(topicsActions.setIsShowCreateTopic({ channelId: valueTopic?.channel_id as string, isShowCreateTopic: false }));
		};
	}, [currentChannel?.channel_id, currentClanId, currentTopicId, dispatch, valueTopic]);

	const onShowKeyboardBottomSheet = useCallback((isShow: boolean, type?: IModeKeyboardPicker) => {
		if (panelKeyboardRef?.current) {
			panelKeyboardRef.current?.onShowKeyboardBottomSheet(isShow, type);
		}
	}, []);

	return (
		<Block width={'100%'} height={'100%'}>
			<TopicHeader></TopicHeader>
			<KeyboardAvoidingView style={styles.channelView} behavior={'padding'} keyboardVerticalOffset={Platform.OS === 'ios' ? 54 : 0}>
				<ChannelMessagesWrapper
					channelId={currentTopicId}
					clanId={currentClanId}
					isPublic={isPublicChannel(currentChannel)}
					mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
				/>
				<ChatBox
					channelId={currentChannel?.channel_id}
					mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
					onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
				/>
				<PanelKeyboard ref={panelKeyboardRef} currentChannelId={currentChannel?.channel_id} currentClanId={currentChannel?.clan_id} />
				<ShareLocationConfirmModal
					channelId={currentChannel?.channel_id}
					mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
				/>
			</KeyboardAvoidingView>
		</Block>
	);
}
