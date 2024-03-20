import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useMemo } from 'react';
import MessageLine from './MesageLine';
import MessageImage from './MessageImage';
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
	const lineNew = useMemo(() => {
		const values = newMessage?.split('\n');
		return values;
	}, [newMessage]);
	const { attachments, lines } = useMessageParser(message);
	const renderAttachments = () => {
		if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('image') !== -1) {
			// TODO: render multiple attachments
			return <MessageImage attachmentData={attachments[0]} />;
		}

		if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('mp4') !== -1) {
			return <MessageVideo attachmentData={attachments[0]} />;
		}

		if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('image') === -1) {
			return <MessageLinkFile attachmentData={attachments[0]} />;
		}
	};
	return (
		<>
			{renderAttachments()}
			{newMessage !== '' ? (
				<div className="flex ">
					<div>
						{lineNew?.map((line: string, index: number) => {
							return <MessageLine line={line} key={index} />;
						})}
					</div>
					<p className="ml-[5px] opacity-50">(edit)</p>
				</div>
			) : (
				<div className="flex ">
					<div>
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
