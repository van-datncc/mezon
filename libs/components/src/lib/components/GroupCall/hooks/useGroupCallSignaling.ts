import { useMezon } from '@mezon/transport';
import { WEBRTC_SIGNALING_TYPES } from '@mezon/utils';
import { useCallback } from 'react';

export interface GroupCallSignalingHookReturn {
	sendGroupCallOffer: (participants: string[], callData: any, channelId: string, userId: string) => void;
	sendGroupCallAnswer: (participants: string[], callData: any, channelId: string, userId: string) => void;
	sendGroupCallCancel: (participants: string[], callData: any, channelId: string, userId: string) => void;
	sendGroupCallQuit: (participants: string[], callData: any, channelId: string, userId: string) => void;
	sendParticipantJoined: (participants: string[], joinedData: any, channelId: string, userId: string) => void;
	sendParticipantLeft: (participants: string[], leftData: any, channelId: string, userId: string) => void;
}

export const useGroupCallSignaling = (): GroupCallSignalingHookReturn => {
	const mezon = useMezon();

	const sendSignalingToParticipants = useCallback(
		(participants: string[], signalType: number, data: any, channelId: string, currentUserId: string) => {
			participants.forEach((userId) => {
				if (userId !== currentUserId) {
					mezon.socketRef.current?.forwardWebrtcSignaling(userId, signalType, JSON.stringify(data), channelId, currentUserId);
				}
			});
		},
		[mezon]
	);

	const sendGroupCallOffer = useCallback(
		(participants: string[], callData: any, channelId: string, userId: string) => {
			sendSignalingToParticipants(participants, WEBRTC_SIGNALING_TYPES.GROUP_CALL_OFFER, callData, channelId, userId);
		},
		[sendSignalingToParticipants]
	);

	const sendGroupCallAnswer = useCallback(
		(participants: string[], callData: any, channelId: string, userId: string) => {
			sendSignalingToParticipants(participants, WEBRTC_SIGNALING_TYPES.GROUP_CALL_ANSWER, callData, channelId, userId);
		},
		[sendSignalingToParticipants]
	);

	const sendGroupCallCancel = useCallback(
		(participants: string[], callData: any, channelId: string, userId: string) => {
			sendSignalingToParticipants(participants, WEBRTC_SIGNALING_TYPES.GROUP_CALL_CANCEL, callData, channelId, userId);
		},
		[sendSignalingToParticipants]
	);

	const sendGroupCallQuit = useCallback(
		(participants: string[], callData: any, channelId: string, userId: string) => {
			sendSignalingToParticipants(participants, WEBRTC_SIGNALING_TYPES.GROUP_CALL_QUIT, callData, channelId, userId);
		},
		[sendSignalingToParticipants]
	);

	const sendParticipantJoined = useCallback(
		(participants: string[], joinedData: any, channelId: string, userId: string) => {
			sendSignalingToParticipants(participants, WEBRTC_SIGNALING_TYPES.GROUP_CALL_PARTICIPANT_JOINED, joinedData, channelId, userId);
		},
		[sendSignalingToParticipants]
	);

	const sendParticipantLeft = useCallback(
		(participants: string[], leftData: any, channelId: string, userId: string) => {
			sendSignalingToParticipants(participants, WEBRTC_SIGNALING_TYPES.GROUP_CALL_PARTICIPANT_LEFT, leftData, channelId, userId);
		},
		[sendSignalingToParticipants]
	);

	return {
		sendGroupCallOffer,
		sendGroupCallAnswer,
		sendGroupCallCancel,
		sendGroupCallQuit,
		sendParticipantJoined,
		sendParticipantLeft
	};
};
