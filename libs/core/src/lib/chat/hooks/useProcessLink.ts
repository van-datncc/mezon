import { handleUrlInput } from '@mezon/transport';
import { ETypeLinkMedia, IMessageSendPayload } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention } from 'mezon-js/api.gen';
import { useCallback, useMemo } from 'react';

type UseProcessLinkOptions = {
	updateImageLinkMessage: (
		clanId: string,
		channelId: string,
		mode: number,
		content: IMessageSendPayload,
		messageId: string,
		mentions: ApiMessageMention[],
		attachments?: ApiMessageAttachment[],
	) => Promise<void>;
};

export function useProcessLink({ updateImageLinkMessage }: UseProcessLinkOptions) {
	const processLink = useCallback(
		async (
			clanId: string,
			channelId: string,
			mode: number,
			contentPayload?: IMessageSendPayload,
			mentionPayload?: ApiMessageMention[],
			attachmentPayload?: ApiMessageAttachment[],
			newMessageIdUpdateImage?: string,
		) => {
			console.log('clanId :', clanId);
			console.log('channelId :', channelId);
			console.log('mode :', mode);
			if (!contentPayload?.lk) return;

			try {
				const resultPromises = contentPayload.lk.map((item) =>
					handleUrlInput(item.lk as string).then((result) => {
						if (result.filetype && result.filetype.startsWith(ETypeLinkMedia.IMAGE_PREFIX)) {
							return result as ApiMessageAttachment;
						}
						return null;
					}),
				);

				const results = await Promise.all(resultPromises);
				const filteredImageAttachments = results.filter((result): result is ApiMessageAttachment => result !== null);

				if (filteredImageAttachments.length > 0) {
					await updateImageLinkMessage(
						clanId,
						channelId,
						mode,
						contentPayload,
						newMessageIdUpdateImage ?? '',
						mentionPayload ?? [],
						filteredImageAttachments,
					);
				}
			} catch (error) {
				console.error('Error processing content payload:', error);
			}
		},
		[updateImageLinkMessage],
	);

	return useMemo(
		() => ({
			processLink,
		}),
		[processLink],
	);
}
