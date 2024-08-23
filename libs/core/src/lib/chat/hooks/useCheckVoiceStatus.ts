import { selectNumberMemberVoiceChannel } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useCheckVoiceStatus = (channelId: string) => {
	const numberMembersVoice = useSelector(selectNumberMemberVoiceChannel(channelId));

	const checkVoiceStatus = useMemo(() => {
		if (!!channelId && !!numberMembersVoice) {
			return numberMembersVoice >= 2;
		}
		return false;
	}, [numberMembersVoice, channelId]);

	return checkVoiceStatus;
};
