import { Block } from '@mezon/mobile-ui';
import { selectChannelById, selectCurrentStreamInfo, useAppSelector } from '@mezon/store-mobile';
import { checkIsThread, isPublicChannel } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChannelMessagesWrapper from '../../../ChannelMessagesWrapper';
import { ChatBox } from '../../../ChatBox';
import PanelKeyboard from '../../../PanelKeyboard';
import { IModeKeyboardPicker } from '../../BottomKeyboardPicker';

const ChatBoxStream = () => {
	const currentStreamInfo = useSelector(selectCurrentStreamInfo);
	const panelKeyboardRef = useRef(null);

	const currentChannel = useAppSelector((state) => selectChannelById(state, currentStreamInfo?.streamId || ''));
	const onShowKeyboardBottomSheet = useCallback((isShow: boolean, height: number, type?: IModeKeyboardPicker) => {
		if (panelKeyboardRef?.current) {
			panelKeyboardRef.current?.onShowKeyboardBottomSheet(isShow, height, type);
		}
	}, []);

	return (
		<Block height={'100%'} width={'100%'}>
			<ChannelMessagesWrapper
				channelId={currentChannel?.channel_id}
				clanId={currentChannel?.clan_id}
				isPublic={isPublicChannel(currentChannel)}
				mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
			/>
			<ChatBox
				hiddenIcon={{
					threadIcon: true
				}}
				channelId={currentChannel?.channel_id}
				mode={checkIsThread(currentChannel) ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL}
				onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
			/>
			<PanelKeyboard ref={panelKeyboardRef} currentChannelId={currentChannel.channel_id} currentClanId={currentChannel?.clan_id} />
		</Block>
	);
};

export const ChatBoxStreamComponent = React.memo(ChatBoxStream);
