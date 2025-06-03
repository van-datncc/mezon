import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { ExpireLinkValue } from '../../constants';
import { FriendList } from './FriendList';

interface IInviteToChannelProp {
	isUnknownChannel: boolean;
	isDMThread?: boolean;
	channelId?: string;
}

const InviteToChannel = ({ isUnknownChannel, isDMThread = false, channelId = '' }: IInviteToChannelProp) => {
	const refRBSheet = useRef<BottomSheetModal>(null);
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardVisible(true);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardVisible(false);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const openEditLinkModal = useCallback(() => {
		refRBSheet?.current?.close();
	}, []);

	return (
		<FriendList
			isUnknownChannel={isUnknownChannel}
			expiredTimeSelected={ExpireLinkValue.SevenDays}
			isDMThread={isDMThread}
			isKeyboardVisible={isKeyboardVisible}
			openEditLinkModal={openEditLinkModal}
			channelId={channelId}
		/>
	);
};

export default React.memo(InviteToChannel);
