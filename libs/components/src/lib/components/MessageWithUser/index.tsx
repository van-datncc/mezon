import { IMessageWithUser, TIME_COMBINE } from '@mezon/utils';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import * as Icons from '../Icons/index';

export type MessageWithUserProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
};

function MessageWithUser({ message, preMessage }: MessageWithUserProps) {
	const timeDiff = useMemo(() => {
		if (!preMessage || !message) return 0;

		const dateCreatePreMess = new Date(preMessage?.date as string);
		const dateCreateCurrentMess = new Date(message?.date as string);
		return Math.abs(dateCreateCurrentMess.getTime() - dateCreatePreMess.getTime()) / 1000;
	}, [message, preMessage]);

	const content = useMemo(() => {
		if (typeof message.content === 'string') {
			return message.content;
		}

		if (typeof message.content === 'object') {
			if (typeof message.content.content === 'string') {
				return message.content.content;
			}

			if (typeof message.content.content === 'object') {
				return (message.content.content as unknown as any).content;
			}
		}
		return '';
	}, [message]);

	const isCombine = useMemo(() => {
		return timeDiff < TIME_COMBINE && preMessage?.user?.id === message?.user?.id;
	}, [timeDiff, message, preMessage]);

	const renderMultilineContent = () => {
		const lines = content.replace(/<br>/g, '\n').split('<br>');
		return lines.map((line: string, index: number) => {
			const match = line.match(/(@\S+)/);
			if (match) {
				const startIndex = match.index || 0;
				const endIndex = startIndex + match[0].length;
				return (
					<div key={index}>
						<span>{line.substring(0, startIndex)}</span>
						<span className="text-blue-500">{line.substring(startIndex, endIndex)}</span>
						<span>{line.substring(endIndex)}</span>
					</div>
				);
			}
			return (
				<div key={index} className="w-full">
					{line}
				</div>
			);
		});
	};

	return (
		<div
			className={`flex py-0.5 h-15 hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer relative ml-4 w-auto mr-4 ${isCombine ? '' : 'mt-3'}`}
		>
			<div className="justify-start gap-4 inline-flex w-full relative">
				{isCombine ? (
					<div className="w-[38px] h-[0] mr-[5px]"></div>
				) : (
					<div>
						{message.user?.avatarSm ? (
							<img
								className="w-[38px] h-[38px] rounded-full object-cover min-w-[38px] min-h-[38px]"
								src={message.user?.avatarSm || ''}
								alt={message.user?.username || ''}
							/>
						) : (
							<div className="w-[38px] h-[38px] bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
								{message.user?.username.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
				)}
				<div className="flex-col w-full flex justify-center items-start relative gap-1">
					{!isCombine && (
						<div className="flex-row items-center w-full gap-4 flex">
							<div className="font-['Manrope'] text-sm text-white font-[600] text-[15px] tracking-wider">
								{message.user?.username}
							</div>
							<div className=" text-zinc-400 font-['Manrope'] text-[10px]">{message?.date}</div>
						</div>
					)}
					<div className="justify-start items-center inline-flex">
						<div className="flex flex-col gap-1 text-[#CCCCCC] font-['Manrope'] whitespace-pre-wrap text-[15px]  w-widthMessageTextChat">
							{renderMultilineContent()}
						</div>
						<div className=" text-zinc-400 font-['Manrope'] text-[10px]">{message?.date}</div>
					</div>
				<div className="justify-start items-center inline-flex">
					<div className="flex flex-col gap-1 text-[#CCCCCC] font-['Manrope'] whitespace-pre-wrap text-[15px] text-wrap break-words w-widthMessageWithUser pr-10">
						{renderMultilineContent()}
					</div>
				</div>
			</div>
		</div>
		{message && (
			<div className="absolute top-[100] right-2 flex flex-row items-center gap-x-1 text-xs text-gray-600">
				<Icons.Sent />
			</div>
		)}
		</div>
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
