import { useChatSending } from '@mezon/core';
import { audioCallActions, RootState, selectDmGroupCurrent, selectIsInCall, toastActions, useAppDispatch } from '@mezon/store';
import { IMessageCallLog, IMessageSendPayload, IMessageTypeCallLog } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

type CallLogMessageProps = {
	userId: string;
	userName: string;
	messageId: string;
	channelId: string;
	senderId: string;
	callLog: IMessageCallLog;
};

const iconMap: { [key: string]: { icon: string; text: string; bgClass: string } } = {
	[`${IMessageTypeCallLog.TIMEOUTCALL}_SENDER`]: {
		icon: '📞',
		text: 'Outgoing call',
		bgClass: 'from-blue-500 to-indigo-600'
	},
	[`${IMessageTypeCallLog.TIMEOUTCALL}_RECEIVER`]: {
		icon: '📲',
		text: 'Missed call',
		bgClass: 'from-red-500 to-orange-600'
	},
	[`${IMessageTypeCallLog.FINISHCALL}_SENDER`]: {
		icon: '❌',
		text: 'Outgoing call',
		bgClass: 'from-yellow-500 to-red-500'
	},
	[`${IMessageTypeCallLog.FINISHCALL}_RECEIVER`]: {
		icon: '❌',
		text: 'Ingoing call',
		bgClass: 'from-yellow-500 to-red-500'
	},
	[`${IMessageTypeCallLog.REJECTCALL}_SENDER`]: {
		icon: '❌',
		text: 'Recipient refused',
		bgClass: 'from-yellow-500 to-red-500'
	},
	[`${IMessageTypeCallLog.REJECTCALL}_RECEIVER`]: {
		icon: '❌',
		text: 'You have declined',
		bgClass: 'from-yellow-500 to-red-500'
	}
};

export default function CallLogMessage({ userId, userName, messageId, channelId, senderId, callLog }: CallLogMessageProps) {
	const dispatch = useAppDispatch();
	const currentDmGroup = useSelector(selectDmGroupCurrent(channelId ?? ''));
	const sessionUser = useSelector((state: RootState) => state.auth.session);
	const mode = currentDmGroup?.type === ChannelType.CHANNEL_TYPE_DM ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP;
	const { sendMessage } = useChatSending({ channelOrDirect: currentDmGroup, mode: mode });
	const isInCall = useSelector(selectIsInCall);
	const key = `${callLog.callLogType}_${senderId === userId ? 'SENDER' : 'RECEIVER'}`;

	const { icon, text, bgClass } = iconMap[key] || {
		icon: '',
		text: `${userName} started a ${callLog.isVideo ? 'video' : 'audio'} call`,
		bgClass: ''
	};

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>
		) => {
			if (sessionUser) {
				sendMessage(content, mentions, attachments, references);
			} else {
				console.error('Session is not available');
			}
		},
		[sendMessage, sessionUser]
	);

	const handleStartCall = () => {
		if (!isInCall) {
			handleSend({ t: ``, callLog: { isVideo: callLog.isVideo, callLogType: IMessageTypeCallLog.STARTCALL } }, [], [], []);
			dispatch(audioCallActions.startDmCall({ groupId: channelId, isVideo: callLog.isVideo }));
			dispatch(audioCallActions.setGroupCallId(channelId));
			dispatch(audioCallActions.setIsBusyTone(false));
		} else {
			dispatch(toastActions.addToast({ message: 'You are on another call', type: 'warning', autoClose: 3000 }));
		}
	};

	return (
		<div className="max-w-[520px] w-fit dark:bg-bgSecondary bg-bgLightSecondary rounded-lg overflow-hidden text-left relative mt-2 text-textLightTheme dark:text-textDarkTheme shadow-lg">
			<div className="w-full">
				<div className="w-full border-b border-black">
					<div className={`flex items-center justify-between px-5 py-3 bg-gradient-to-r ${bgClass} rounded-t-lg`}>
						<span className="text-white text-xl">{icon}</span>
						<span className="text-white font-semibold">{text}</span>
					</div>

					<div className="flex flex-col px-5 pt-2 pb-4 space-y-2">
						<div className="text-sm text-gray-600 dark:text-gray-300">0 phút 0 giây</div>
					</div>
				</div>
				<button onClick={handleStartCall} className="flex justify-center items-center w-full text-center px-5 py-3">
					Call Back
				</button>
			</div>
		</div>
	);
}
