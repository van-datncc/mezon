import { ChatContext, useChatReaction } from '@mezon/core';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { isPublicChannel } from '@mezon/utils';
import React, { useCallback, useContext, useEffect } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IReactionMessageProps } from './components';

const ChannelMessageReactionListener = React.memo(() => {
	const { reactionMessageDispatch } = useChatReaction({ isMobile: true });
	const currentChannel = useSelector(selectCurrentChannel);
	const { socketRef } = useMezon();
	const { handleReconnect } = useContext(ChatContext);
	const onReactionMessage = useCallback(
		async (data: IReactionMessageProps) => {
			if (!socketRef?.current?.isOpen()) {
				handleReconnect('');
			}
			await reactionMessageDispatch(
				data?.id ?? '',
				data?.messageId ?? '',
				data?.emojiId ?? '',
				data?.emoji?.trim() ?? '',
				data?.countToRemove ?? 0,
				data?.senderId ?? '',
				data?.actionDelete ?? false,
				isPublicChannel(currentChannel)
			);
		},
		[currentChannel, reactionMessageDispatch, socketRef, handleReconnect]
	);

	useEffect(() => {
		const eventOnReaction = DeviceEventEmitter.addListener(ActionEmitEvent.ON_REACTION_MESSAGE_ITEM, onReactionMessage);

		return () => {
			eventOnReaction.remove();
		};
	}, [onReactionMessage]);

	return <View />;
});

export default ChannelMessageReactionListener;
