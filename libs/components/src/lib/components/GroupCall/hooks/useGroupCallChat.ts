import { useChatSending } from '@mezon/core';
import { IMessageSendPayload, IMessageTypeCallLog } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useCallback } from 'react';

export interface GroupCallChatHookReturn {
	sendStartCallMessage: (isVideo: boolean) => void;
	sendEndCallMessage: (isVideo: boolean) => void;
}

interface GroupCallChatHookParams {
	currentGroup: any;
}

export const useGroupCallChat = ({ currentGroup }: GroupCallChatHookParams): GroupCallChatHookReturn => {
	const mode = currentGroup?.type === ChannelType.CHANNEL_TYPE_DM ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP;
	const { sendMessage } = useChatSending({ channelOrDirect: currentGroup, mode });

	const sendStartCallMessage = useCallback(
		(isVideo: boolean) => {
			const callLogContent: IMessageSendPayload = {
				t: '',
				callLog: {
					isVideo,
					callLogType: IMessageTypeCallLog.STARTCALL
				}
			};
			sendMessage(callLogContent);
		},
		[sendMessage]
	);

	const sendEndCallMessage = useCallback(
		(isVideo: boolean) => {
			const endCallLogContent: IMessageSendPayload = {
				t: new Date().toDateString(),
				callLog: {
					isVideo,
					callLogType: IMessageTypeCallLog.REJECTCALL
				}
			};
			sendMessage(endCallLogContent);
		},
		[sendMessage]
	);

	return {
		sendStartCallMessage,
		sendEndCallMessage
	};
};
