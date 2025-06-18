import { useTheme } from '@mezon/mobile-ui';
import { EStateFriend, selectFriendById, useAppSelector } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import ChannelMessages from '../../home/homedrawer/ChannelMessages';
import { ChatBox } from '../../home/homedrawer/ChatBox';
import PanelKeyboard from '../../home/homedrawer/PanelKeyboard';
import { IModeKeyboardPicker } from '../../home/homedrawer/components/BottomKeyboardPicker';
import { style } from './styles';

interface IChatMessageWrapperProps {
	directMessageId: string;
	isModeDM: boolean;
	currentClanId: string;
	targetUserId?: string;
}
export const ChatMessageWrapper = memo(({ directMessageId, isModeDM, currentClanId, targetUserId }: IChatMessageWrapperProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const panelKeyboardRef = useRef(null);
	const infoFriend = useAppSelector((state) => selectFriendById(state, targetUserId || ''));
	const isBlocked = useMemo(() => {
		return infoFriend?.state === EStateFriend.BLOCK;
	}, [infoFriend?.state]);

	const onShowKeyboardBottomSheet = useCallback((isShow: boolean, type?: IModeKeyboardPicker) => {
		if (panelKeyboardRef?.current) {
			panelKeyboardRef.current?.onShowKeyboardBottomSheet(isShow, type);
		}
	}, []);

	return (
		<KeyboardAvoidingView
			style={styles.content}
			behavior={'padding'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
		>
			<View style={{ flex: 1 }}>
				<ChannelMessages
					channelId={directMessageId}
					clanId={'0'}
					mode={Number(isModeDM ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP)}
					isPublic={false}
					isDM={true}
				/>
			</View>
			<ChatBox
				channelId={directMessageId}
				mode={Number(isModeDM ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP)}
				onShowKeyboardBottomSheet={onShowKeyboardBottomSheet}
				hiddenIcon={{
					threadIcon: true
				}}
				isPublic={false}
				isFriendTargetBlocked={isBlocked}
			/>
			<PanelKeyboard
				ref={panelKeyboardRef}
				directMessageId={directMessageId || ''}
				currentChannelId={directMessageId}
				currentClanId={currentClanId}
			/>
		</KeyboardAvoidingView>
	);
});
