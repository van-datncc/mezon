import {
	IChannelMember,
	IMessageWithUser,
	TIME_COMBINE,
	checkSameDay,
	getTimeDifferenceInSeconds,
} from '@mezon/utils';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import * as Icons from '../Icons/index';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import MessageAvatar from './MessageAvatar';
import { useMessageParser } from './useMessageParser';
import MessageHead from './MessageHead';
import MessageContent from './MessageContent';

export type MessageWithUserProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	mentions?: Array<ApiMessageMention>;
	attachments?: Array<ApiMessageAttachment>;
	references?: Array<ApiMessageRef>;
	user?: IChannelMember | null;
};

function MessageWithUser({ message, preMessage, user }: MessageWithUserProps) {

	const { messageTime } = useMessageParser(message)

	// TODO: optimize more
	const isCombine = useMemo(() => {
		const timeDiff = getTimeDifferenceInSeconds(preMessage?.create_time as string, message?.create_time as string);
		return (
			timeDiff < TIME_COMBINE &&
			preMessage?.user?.id === message?.user?.id &&
			checkSameDay(preMessage?.create_time as string, message?.create_time as string)
		);
	}, [message, preMessage]);

	return (
		<>
			{!checkSameDay(preMessage?.create_time as string, message?.create_time as string) && (
				<div className="flex flex-row w-full px-4 items-center py-3 text-zinc-400 text-[12px] font-[600]">
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
					<span className="text-center px-3 whitespace-nowrap">{messageTime}</span>
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
				</div>
			)}

			<div
				className={`flex py-0.5 h-15 group hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer relative ml-4 w-auto mr-4 ${isCombine ? '' : 'mt-3'}`}
			>
				<div className="justify-start gap-4 inline-flex w-full relative">
					<MessageAvatar user={user} message={message} isCombine={isCombine} />
					<div className="flex-col w-full flex justify-center items-start relative gap-1">
						<MessageHead message={message} user={user} isCombine={isCombine} />
						<div className="justify-start items-center inline-flex w-full">
							<div className="flex flex-col gap-1 text-[#CCCCCC] font-['Manrope'] whitespace-pre-wrap text-[15px] w-widthMessageTextChat">
								<MessageContent message={message} user={user} isCombine={isCombine} />
							</div>
						</div>
					</div>
				</div>
				{message && (
					<div
						className={`absolute top-[100] right-2  flex-row items-center gap-x-1 text-xs text-gray-600 ${isCombine ? 'hidden' : 'flex'}`}
					>
						<Icons.Sent />
					</div>
				)}
			</div>
		</>
	);
}

MessageWithUser.Skeleton = () => {
	return (
		<div className="flex py-0.5 min-w-min mx-3 h-15 mt-3 hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer  flex-shrink-1">
			<Skeleton circle={true} width={38} height={38} />
		</div>
	);
};

export default MessageWithUser;
