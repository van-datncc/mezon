import { useDirectMessages } from '@mezon/core';
import { RootState } from '@mezon/store';
import { IMessageSendPayload } from '@mezon/utils';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {MessageBox} from '@mezon/components';
import { ApiMessageMention, ApiMessageAttachment, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

interface DirectIdProps {
	directParamId: string;
}
export function DirectMessageBox({ directParamId }: DirectIdProps) {
	const { sendDirectMessage } = useDirectMessages({ channelId: directParamId });
	// TODO: move selector to store
	const sessionUser = useSelector((state: RootState) => state.auth.session);
	const handleSend = useCallback(
		(content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>, 
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>) => {
			if (sessionUser) {
				sendDirectMessage(content, mentions, attachments, references);
			} else {
				console.error('Session is not available');
			}
		},
		[sendDirectMessage, sessionUser],
	);

	return (
		<div>
			<MessageBox onSend={handleSend} />
		</div>
	);
}

DirectMessageBox.Skeleton = () => {
	return (
		<div>
			<MessageBox.Skeleton />
		</div>
	);
};

export default DirectMessageBox;
