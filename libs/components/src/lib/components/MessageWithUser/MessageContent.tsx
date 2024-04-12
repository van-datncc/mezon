import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { ApiMessageAttachment } from 'vendors/mezon-js/packages/mezon-js/api.gen';
import MessageImage from './MessageImage';
import MessageLine from './MessageLine';
import MessageLinkFile from './MessageLinkFile';
import MessageVideo from './MessageVideo';
import { useMessageParser } from './useMessageParser';

type IMessageContentProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine: boolean;
	newMessage?: string;
};

const MessageContent = ({ user, message, isCombine, newMessage }: IMessageContentProps) => {
	const { attachments, lines } = useMessageParser(message);
	const [videos, setVideos] = useState<ApiMessageAttachment[]>([]);
	const [images, setImages] = useState<ApiMessageAttachment[]>([]);
	const [documents, setDocuments] = useState<ApiMessageAttachment[]>([]);

	const classifyAttachments = (attachments: ApiMessageAttachment[]) => {
		const videos: ApiMessageAttachment[] = [];
		const images: ApiMessageAttachment[] = [];
		const documents: ApiMessageAttachment[] = [];

		attachments.forEach((attachment) => {
			if (attachment.filetype?.indexOf('video/mp4') !== -1) {
				videos.push(attachment);
			} else if (attachment.filetype?.indexOf('image/png') !== -1 || attachment.filetype?.indexOf('image/jpeg') !== -1) {
				images.push(attachment);
			} else {
				documents.push(attachment);
			}
		});

		return { videos, images, documents };
	};

	useEffect(() => {
		const { videos, images, documents } = classifyAttachments(attachments ?? []);
		setVideos(videos);
		setImages(images);
		setDocuments(documents);
	}, [attachments]);

	const renderVideos = () => {
		return (
			<div className="flex flex-row justify-start flex-wrap w-full gap-x-2 mt-2">
				{videos.map((video, index) => (
					<div key={index} className="w-fit">
						<MessageVideo attachmentData={video} />
					</div>
				))}
			</div>
		);
	};
	const renderImages = () => {
		return (
			<div className="flex flex-row justify-start flex-wrap w-full gap-x-2">
				{images.map((image, index) => (
					<div key={index} className="w-fit">
						<MessageImage attachmentData={image} />
					</div>
				))}
			</div>
		);
	};

	const renderDocuments = () => {
		return documents.map((document, index) => {
			return <MessageLinkFile key={index} attachmentData={document} />;
		});
	};

	return (
		<>
			{renderVideos()}
			{renderImages()}
			{renderDocuments()}
			{newMessage !== '' ? (
				<div className="flex ">
					<div id={message.id}>
						<MessageLine line={newMessage as string} />
					</div>
					<p className="ml-[5px] opacity-50">(edit)</p>
				</div>
			) : (
				<div className="flex ">
					<div id={message.id}>
						<MessageLine line={lines as string} />
					</div>
					{message.update_time ? (
						<div>{message.create_time < message.update_time ? <p className="ml-[5px] opacity-50">(edit)</p> : null}</div>
					) : null}
				</div>
			)}
		</>
	);
};

export default MessageContent;
