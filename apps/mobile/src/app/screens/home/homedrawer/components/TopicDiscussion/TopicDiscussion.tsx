import { useTheme } from '@mezon/mobile-ui';
import { messagesActions, selectCurrentChannel, selectCurrentClanId, selectCurrentTopicId, topicsActions, useAppDispatch } from '@mezon/store-mobile';
import { checkIsThread, isPublicChannel } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
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
	const navigation = useNavigation<any>();
	const [isFetchMessageDone, setIsFetchMessageDone] = useState(false);

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
			setIsFetchMessageDone(true);
		};
		if (currentTopicId !== '') {
			fetchMsgResult();
		}
	}, [currentChannel?.channel_id, currentClanId, currentTopicId, dispatch]);

	useEffect(() => {
		return () => {
			dispatch(topicsActions.setCurrentTopicId(''));
			dispatch(topicsActions.setIsShowCreateTopic({ channelId: currentChannel?.channel_id as string, isShowCreateTopic: false }));
		};
	}, [currentChannel?.channel_id, dispatch]);

	const onShowKeyboardBottomSheet = useCallback((isShow: boolean, type?: IModeKeyboardPicker) => {
		if (panelKeyboardRef?.current) {
			panelKeyboardRef.current?.onShowKeyboardBottomSheet(isShow, type);
		}
	}, []);

	const onHandlerStateChange = useCallback(
		(event: { nativeEvent: { translationX: any; velocityX: any } }) => {
			const { translationX, velocityX } = event.nativeEvent;
			if (translationX > 50 && velocityX > 300) {
				navigation.goBack();
			}
		},
		[navigation]
	);

	const onGoBack = useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<SafeAreaView edges={['top']} style={styles.channelView}>
			<TopicHeader
				mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
				handleBack={onGoBack}
			/>
			<KeyboardAvoidingView style={styles.channelView} behavior={'padding'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
				<PanGestureHandler failOffsetY={[-5, 5]} onHandlerStateChange={onHandlerStateChange}>
					<View style={{ flex: 1 }}>
						{isFetchMessageDone && (
							<ChannelMessagesWrapper
								channelId={currentTopicId}
								clanId={currentClanId}
								isPublic={isPublicChannel(currentChannel)}
								mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
							/>
						)}
					</View>
				</PanGestureHandler>
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
		</SafeAreaView>
	);
}
