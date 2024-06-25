import { IChannelMember, IMessageWithUser, notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useMemo } from 'react';
import MessageImage from './MessageImage';
import MessageLine from './MessageLine';
import MessageLinkFile from './MessageLinkFile';
import MessageVideo from './MessageVideo';
import { useMessageParser } from './useMessageParser';

type IMessageContentProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine?: boolean;
	newMessage?: string;
	isSending?: boolean;
	isError?: boolean;
};

const classifyAttachments = (attachments: ApiMessageAttachment[]) => {
	const videos: ApiMessageAttachment[] = [];
	const images: ApiMessageAttachment[] = [];
	const documents: ApiMessageAttachment[] = [];

	attachments.forEach((attachment) => {
		if (attachment.filetype?.indexOf('video/mp4') !== -1 && !attachment.url?.includes('tenor.com')) {
			videos.push(attachment);
		} else if (attachment.filetype?.indexOf('image/png') !== -1 || attachment.filetype?.indexOf('image/jpeg') !== -1) {
			images.push(attachment);
		} else {
			documents.push(attachment);
		}
	});

	return { videos, images, documents };
};

const Attachments: React.FC<{ attachments: ApiMessageAttachment[]; messageId: string }> = ({ attachments, messageId }) => {
	const { videos, images, documents } = useMemo(() => classifyAttachments(attachments), [attachments]);

	return (
		<>
			{videos.length > 0 && (
				<div className="flex flex-row justify-start flex-wrap w-full gap-2 mt-5">
					{videos.map((video, index) => (
						<div key={`${video.url}_${index}`} className="w-fit gap-y-2">
							<MessageVideo attachmentData={video} />
						</div>
					))}
				</div>
			)}

			{images.length > 0 && (
				<div className="flex flex-row justify-start flex-wrap w-full gap-x-2">
					{images.map((image, index) => {
						const checkImage = notImplementForGifOrStickerSendFromPanel(image);
						return (
							<div key={`${index}_${image.url}`} className={`${checkImage ? '' : 'w-48 h-auto'}  `}>
								<MessageImage messageIdRightClick={messageId} attachmentData={image} />
							</div>
						);
					})}
				</div>
			)}

			{documents.length > 0 &&
				documents.map((document, index) => <MessageLinkFile key={`${index}_${document.url}`} attachmentData={document} />)}
		</>
	);
};

const MessageText = ({ message, lines, isEdited }: { message: IMessageWithUser; lines: string; isEdited?: boolean }) => (
	<div className="flex w-full">
		<div id={message.id} className="w-full">
			<MessageLine line={lines} />
		</div>
		{isEdited && (
			<p className="ml-[5px] opacity-50 text-[9px] self-center font-semibold dark:text-textDarkTheme text-textLightTheme w-[50px]">(edited)</p>
		)}
	</div>
);

const MessageContent = ({ user, message, isCombine, isSending, isError }: IMessageContentProps) => {
	const { attachments, lines, hasAttachments, isEdited } = useMessageParser(message);

	return (
		<>
			{hasAttachments && <Attachments messageId={message.id} attachments={attachments ?? []} />}
			<MessageText message={message} lines={lines as string} isEdited={isEdited} />
		</>
	);
};

export default MessageContent;
