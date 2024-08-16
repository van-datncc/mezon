import { handleUrlInput } from '@mezon/transport';
import { ETypeLinkMedia, IMessageSendPayload, MessageTypeUpdateLink } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention } from 'mezon-js/api.gen';
import { useEffect } from 'react';

type EditSendMessage = (
	content: IMessageSendPayload,
	messageId: string,
	mentions: ApiMessageMention[],
	attachments?: ApiMessageAttachment[],
) => Promise<void>;

export function useProcessLinks(newMessageUpdateImage: MessageTypeUpdateLink, editSendMessage: EditSendMessage) {
	useEffect(() => {
		const linksOnMessage = newMessageUpdateImage?.content?.lk;
		if (!linksOnMessage || linksOnMessage.length === 0) return;

		const resultPromises = linksOnMessage.map((item) => {
			return handleUrlInput(item.lk as string).then((result) => {
				if (result.filetype && result.filetype.startsWith(ETypeLinkMedia.IMAGE_PREFIX)) {
					return result as ApiMessageAttachment;
				}
				return null;
			});
		});

		Promise.all(resultPromises)
			.then((results) => {
				const filteredImageAttachments = results.filter((result): result is ApiMessageAttachment => result !== null);
				if (filteredImageAttachments.length > 0) {
					editSendMessage(
						{ ...newMessageUpdateImage.content },
						newMessageUpdateImage.id ?? '',
						newMessageUpdateImage.mentions ?? [],
						filteredImageAttachments,
					);
				}
			})
			.catch((error) => {
				console.error('Error processing URLs:', error);
			});
	}, [newMessageUpdateImage.id]);
}
