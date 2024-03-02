import { selectCurrentChannelId, selectMembersMap } from '@mezon/store';
import {
	IMessageWithUser,
	TIME_COMBINE,
	checkSameDay,
	convertDateString,
	convertTimeHour,
	convertTimeString,
	getTimeDifferenceInSeconds,
} from '@mezon/utils';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons/index';
import MessageImage from './MessageImage';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import MessageLinkFile from './MessageLinkFile';

export type MessageWithUserProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	mentions?: Array<ApiMessageMention>;
	attachments?: Array<ApiMessageAttachment>;
	references?: Array<ApiMessageRef>;
};

function MessageWithUser({ message, preMessage, mentions, attachments, references }: MessageWithUserProps) {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const membersMap = useSelector(selectMembersMap(currentChannelId));

	const content = useMemo(() => {
		return message.content;
	}, [message]);

	const isCombine = useMemo(() => {
		const timeDiff = getTimeDifferenceInSeconds(preMessage?.create_time as string, message?.create_time as string);
		return (
			timeDiff < TIME_COMBINE &&
			preMessage?.user?.id === message?.user?.id &&
			checkSameDay(preMessage?.create_time as string, message?.create_time as string)
		);
	}, [message, preMessage]);

	const renderMultilineContent = () => {
		if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('image') !== -1) {
			// TODO: render multiple attachment
			return <MessageImage attachmentData={attachments[0]} />;
		}
		if (attachments && attachments.length > 0 && attachments[0].filetype !== 'image') {
			return <MessageLinkFile attachmentData={attachments[0]} />;
		}
		const lines = content.t?.split('\n');
		const mentionRegex = /(@\S+?)\s/g;
		return lines?.map((line: string, index: number) => {
			const matches = line.match(mentionRegex);
			if (matches) {
				let lastIndex = 0;
				const elements = matches.map((match, i) => {
					const startIndex = line.indexOf(match, lastIndex);
					const endIndex = startIndex + match.length;
					const nonMatchText = line.substring(lastIndex, startIndex);
					lastIndex = endIndex;
					return (
						<span key={i}>
							{nonMatchText && <span>{nonMatchText}</span>}
							<span className="text-blue-500">{line.substring(startIndex, endIndex)}</span>
						</span>
					);
				});
				elements.push(<span key={matches.length}>{line.substring(lastIndex)}</span>);
				return <div key={index}>{elements}</div>;
			}

			return (
				<div key={index} className="max-w-[40vw] lg:max-w-[30vw] xl:max-w-[50vw] lg:w-full min-w-full break-words ">
					{line}
				</div>
			);
		});
	};
	return (
		<>
			{!checkSameDay(preMessage?.create_time as string, message?.create_time as string) && (
				<div className="flex flex-row w-full px-4 items-center py-3 text-zinc-400 text-[12px] font-[600]">
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
					<span className="text-center px-3 whitespace-nowrap">{convertDateString(message?.create_time as string)}</span>
					<div className="w-full border-b-[1px] border-[#40444b] opacity-50 text-center"></div>
				</div>
			)}

			<div
				className={`flex py-0.5 h-15 group hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer relative ml-4 w-auto mr-4 ${isCombine ? '' : 'mt-3'}`}
			>
				<div className="justify-start gap-4 inline-flex w-full relative">
					{isCombine ? (
						<div className="w-[38px] flex items-center justify-center min-w-[38px]">
							<div className="hidden group-hover:text-zinc-400 group-hover:text-[10px] group-hover:block">
								{convertTimeHour(message?.create_time as string)}
							</div>
						</div>
					) : (
						<div>
							{membersMap.get(message.sender_id)?.avatar ? (
								<img
									className="w-[38px] h-[38px] rounded-full object-cover min-w-[38px] min-h-[38px]"
									src={membersMap.get(message.sender_id)?.avatar || ''}
									alt={membersMap.get(message.sender_id)?.avatar || ''}
								/>
							) : (
								<div className="w-[38px] h-[38px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
									{membersMap.get(message.sender_id)?.name.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					)}
					<div className="flex-col w-full flex justify-center items-start relative gap-1">
						{!isCombine && (
							<div className="flex-row items-center w-full gap-4 flex">
								<div className="font-['Manrope'] text-sm text-white font-[600] text-[15px] tracking-wider">
									{membersMap.get(message.sender_id)?.name}
								</div>
								<div className=" text-zinc-400 font-['Manrope'] text-[10px]">{convertTimeString(message?.create_time as string)}</div>
							</div>
						)}
						<div className="justify-start items-center inline-flex w-full">
							<div className="flex flex-col gap-1 text-[#CCCCCC] font-['Manrope'] whitespace-pre-wrap text-[15px] w-widthMessageTextChat">
								{renderMultilineContent()}
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
