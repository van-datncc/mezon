import { useAuth, useChatReactionMessage } from '@mezon/core';
import { selectCurrentChannelId, selectMembersMap, useAppDispatch } from '@mezon/store';
import {
	IMessageWithUser,
	TIME_COMBINE,
	checkSameDay,
	convertDateString,
	convertTimeHour,
	convertTimeString,
	getTimeDifferenceInSeconds,
} from '@mezon/utils';
import { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageReaction, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import * as Icons from '../Icons/index';
import MessageImage from './MessageImage';
import MessageLinkFile from './MessageLinkFile';

export type MessageWithUserProps = {
	message: IMessageWithUser;
	preMessage?: IMessageWithUser;
	mentions?: Array<ApiMessageMention>;
	attachments?: Array<ApiMessageAttachment>;
	references?: Array<ApiMessageRef>;
	reactions?: Array<ApiMessageReaction>;
};

type SenderInfoOptionals = {
	id: string;
	count: number;
	emojiIdList: string[];
};

type EmojiDataOptionals = {
	emoji: string;
	senders: SenderInfoOptionals[];
	channelId?: string;
	messageId?: string;
};

type EmojiItemOptionals = {
	id: string;
	sender_id: string;
	emoji: string;
};

function MessageWithUser({ message, preMessage, mentions, attachments, references, reactions }: MessageWithUserProps) {
	const { userId } = useAuth();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const membersMap = useSelector(selectMembersMap(currentChannelId));
	const { messageDataReactedFromSocket } = useChatReactionMessage({ currentChannelId });
	const { reactionMessageAction } = useChatReactionMessage({ currentChannelId });

	const content = useMemo(() => {
		return message.content;
	}, [message]);
	const dispatch = useAppDispatch();
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
		if (attachments && attachments.length > 0 && attachments[0].filetype?.indexOf('image') === -1) {
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

	const [emojiData, setEmojiData] = useState<EmojiDataOptionals[]>([]);
	const [dataEmojiFetch] = useState<any>(message.reactions);

	const processData = (dataEmoji: any) => {
		const result: EmojiDataOptionals[] = [];
		dataEmoji.forEach((item: EmojiItemOptionals) => {
			const existingEmoji = result.find((emojiItem: EmojiDataOptionals) => emojiItem.emoji === item.emoji);

			if (existingEmoji) {
				const existingSender = existingEmoji.senders.find((senderItem: SenderInfoOptionals) => senderItem.id === item.sender_id);
				if (existingSender) {
					existingSender.count += 1;
					existingSender.emojiIdList.push(item.id);
				} else {
					existingEmoji.senders.push({
						id: item.sender_id,
						count: 1,
						emojiIdList: [item.id],
					});
				}
			} else {
				result.push({
					emoji: item.emoji,
					senders: [
						{
							id: item.sender_id,
							count: 1,
							emojiIdList: [item.id],
						},
					],

					channelId: message.channel_id,
					messageId: message.message_id,
				});
			}
		});
		return result;
	};

	const [changingCount, setChangingCount] = useState<number>(0);

	const [update, setUpdate] = useState(false);
	const handleReactMessage = async (channelId: string, messageId: string, emoji: string, userId: string) => {
		setUpdate(!update);
		const existingEmojiIndex = emojiDataIncSocket?.findIndex((e: EmojiDataOptionals) => e.emoji === emoji) as number;
		if (existingEmojiIndex !== -1) {
			const userIndex = (emojiDataIncSocket &&
				emojiDataIncSocket[existingEmojiIndex].senders.findIndex((sender) => sender.id === userId)) as number;
			if (userIndex !== -1) {
				const updatedEmojiData = [...emojiData];
				updatedEmojiData[existingEmojiIndex].senders[userIndex].count += 1;
				setEmojiData(updatedEmojiData);
				await reactionMessageAction(channelId, messageId, emoji, false);
			} else {
				const updatedEmojiData = [...emojiData];
				updatedEmojiData[existingEmojiIndex].senders.push({
					id: userId,
					count: 1,
					emojiIdList: [],
				});

				setEmojiData(updatedEmojiData);
				await reactionMessageAction(channelId, messageId, emoji, false);
			}
		} else {
			setEmojiData((prevEmojiDataOptionals: EmojiDataOptionals[]) => [
				...prevEmojiDataOptionals,
				{
					emoji,
					count: 1,
					isReacted: true,
					senders: [
						{
							id: userId,
							count: 1,
							emojiIdList: [],
						},
					],
				},
			]);
			await reactionMessageAction(channelId, messageId, emoji, false);
		}

		setChangingCount((prevChangingCount) => prevChangingCount + 1);
	};

	const mergeEmojiData = (emojiData: EmojiDataOptionals[], emojiSocket: EmojiDataOptionals[]) => {
		emojiSocket?.forEach((socketEmoji) => {
			const existingEmojiIndex = emojiData.findIndex((dataEmoji) => dataEmoji.emoji === socketEmoji.emoji);
			if (existingEmojiIndex !== -1) {
				const existingSenderIndex = emojiData[existingEmojiIndex].senders.findIndex((sender) => sender.id === socketEmoji.senders[0].id);

				if (existingSenderIndex !== -1) {
					emojiData[existingEmojiIndex].senders[existingSenderIndex].count += socketEmoji.senders[0].count;
				} else {
					emojiData[existingEmojiIndex].senders.push(socketEmoji.senders[0]);
				}
			} else {
				emojiData.push(socketEmoji);
			}
		});
		return emojiData;
	};

	const [messReactConvert, setMessReactConvert] = useState<any>();
	const [emojiDataIncSocket, setEmojiDataIncSocket] = useState<EmojiDataOptionals[]>(processData(dataEmojiFetch));

	useEffect(() => {
		const transformData = () => {
			if (messageDataReactedFromSocket) {
				const transformedData = [
					{
						emoji: messageDataReactedFromSocket.emoji,
						senders: [
							{
								id: messageDataReactedFromSocket.userId,
								count: 1,
								emojiIdList: [''],
							},
						],
						channelId: messageDataReactedFromSocket.channelId,
						messageId: messageDataReactedFromSocket.messageId,
					},
				];
				setMessReactConvert(transformedData);
			}
		};
		transformData();
		setEmojiDataIncSocket(mergeEmojiData(emojiData, messReactConvert));
		console.log('emojiDataIncSocket', emojiDataIncSocket);
	}, [messageDataReactedFromSocket]);

	useEffect(() => {
		setEmojiData(processData(dataEmojiFetch));
	}, [message, update]);

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
				className={`flex py-0.5 h-15 group hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer ml-4 relative w-auto mr-4 ${isCombine ? '' : 'mt-3'}`}
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
					<div className="flex-col w-full flex items-start relative gap-1 ">
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
						<div className="flex justify-start flex-row w-full gap-2">
							{emojiDataIncSocket &&
								emojiDataIncSocket.map((emoji: EmojiDataOptionals, index: number) => {
									const userSender = emoji.senders.find((sender) => sender.id === userId);
									return (
										<div
											key={index}
											className={`relative ${userSender && userSender.count > 0 ? 'bg-[#373A54] border-blue-600 border' : 'bg-[#313338]'} rounded-md w-12 gap-1 h-5 flex flex-row justify-center items-center`}
											onClick={() => handleReactMessage(currentChannelId ?? '', message.id, emoji.emoji, userId ?? '')}
										>
											<span>{emoji.emoji}</span>
											<span className="font-manrope flex flex-row items-center justify-center pt-[2px] relative">
												<p className="text-[13px]">
													{emoji.senders.reduce((sum, item: SenderInfoOptionals) => sum + item.count, 0)}
												</p>
											</span>
										</div>
									);
								})}
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

				{
					<div className="flex flex-row right-8 relative">
						<div onClick={() => handleReactMessage(currentChannelId ?? '', message.id, '🤣', userId ?? '')}>🤣</div>
						<div onClick={() => handleReactMessage(currentChannelId ?? '', message.id, '🥰', userId ?? '')}>🥰</div>
						<div onClick={() => handleReactMessage(currentChannelId ?? '', message.id, '🤩', userId ?? '')}>🤩</div>
					</div>
				}
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
