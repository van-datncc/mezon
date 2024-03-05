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
import { useCallback, useEffect, useMemo, useState } from 'react';
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

type SenderInfo = {
	id: string;
	count: number;
	isReacted: boolean;
	emojiIdList: string[];
};

type EmojiData = {
	emoji: string;
	senders: SenderInfo[];
};
function MessageWithUser({ message, preMessage, mentions, attachments, references, reactions }: MessageWithUserProps) {
	const { userId } = useAuth();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const membersMap = useSelector(selectMembersMap(currentChannelId));
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

	const [emojiData, setEmojiData] = useState<emojiOptions[]>([]);
	const [dataEmojiFetch] = useState<any>(message.reactions);

	console.log('dataEmojiFetch', dataEmojiFetch);
	const calculateEmojiCount = useCallback(() => {
		return (
			dataEmojiFetch &&
			Object.values(
				dataEmojiFetch.reduce((count: any, currentEmoji: any) => {
					const { id, emoji, sender_id } = currentEmoji;
					const key = emoji;

					if (!count[key]) {
						count[key] = {
							emoji,
							count: 0,
							senderIdList: [],
							emojiIdList: [],
						};
					}

					count[key].count += 1;
					count[key].senderIdList.push(sender_id);
					count[key].emojiIdList.push(id);

					return count;
				}, {}),
			)
		);
	}, [dataEmojiFetch]);

	const processData = () => {
		const result: any = [];

		dataEmojiFetch.forEach((item: any) => {
			const existingEmoji = result.find((emojiItem: any) => emojiItem.emoji === item.emoji);

			if (existingEmoji) {
				const existingSender = existingEmoji.senders.find((senderItem: any) => senderItem.id === item.sender_id);

				if (existingSender) {
					// If the sender already exists for the emoji
					existingSender.count += 1;
					existingSender.emojiIdList.push(item.id);
				} else {
					// If the sender doesn't exist for the emoji
					existingEmoji.senders.push({
						id: item.sender_id,
						count: 1,
						isReacted: false,
						emojiIdList: [item.id],
					});
				}
			} else {
				// If the emoji doesn't exist in the result array
				result.push({
					emoji: item.emoji,
					senders: [
						{
							id: item.sender_id,
							count: 1,
							isReacted: false,
							emojiIdList: [item.id],
						},
					],
				});
			}
		});

		return result;
	};

	console.log(processData());

	useEffect(() => {
		setEmojiData(processData());
	}, [message]);

	const [changingCount, setChangingCount] = useState<number>(0);
	const handleReactMessage = async (channelId: string, messageId: string, emoji: string) => {
		const existingEmoji = emojiData.find((e: EmojiData) => e.emoji === emoji);
		if (existingEmoji) {
			const updatedEmojiData = emojiData.map((e: EmojiData) =>
				e.emoji === emoji
					? {
							...e,
							count: e.count + 1,
							isReacted: true,
						}
					: e,
			);
			setEmojiData(updatedEmojiData);
			await reactionMessageAction(channelId, messageId, emoji, false);
		} else {
			setEmojiData((prevEmojiData: EmojiData[]) => [
				...prevEmojiData,
				{
					emoji,
					count: 1,
					isReacted: true,
				},
			]);
			await reactionMessageAction(channelId, messageId, emoji, false);
		}
		setChangingCount((prevChangingCount) => prevChangingCount + 1);
	};

	console.log('emmm', emojiData);

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
							{emojiData &&
								emojiData
									// .filter((emoji: emojiOptions) => emoji.count > 0)
									.map((emoji: EmojiData, index: number) => {
										return (
											<div
												key={index}
												// className={`relative  ${isReacted ? 'bg-[#373A54] border-blue-600 border' : ' bg-[#313338] '}  rounded-md  w-12 gap-1 h-5 flex flex-row justify-center items-center`}
												onClick={() => handleReactMessage(currentChannelId ?? '', message.id, emoji.emoji)}
											>
												<span>{emoji.emoji}</span>
												<span className="font-manrope flex flex-row items-center justify-center pt-[2px] relative">
													<p className="text-[13px]">{emoji.senders.map((item: SenderInfo) => item.count)}</p>
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
				{/* <div className="w-32  relative">
					<div className="absolute right-16 top-[-0.5rem] z-50">
						<Icons.Smile />
					</div>
				</div> */}
				{
					<div className="flex flex-row right-8 relative">
						<div onClick={() => handleReactMessage(currentChannelId ?? '', message.id, '🤣')}>🤣</div>
						<div onClick={() => handleReactMessage(currentChannelId ?? '', message.id, '🥰')}>🥰</div>
						<div onClick={() => handleReactMessage(currentChannelId ?? '', message.id, '🤩')}>🤩</div>
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

// const input = [
// 	{
// 		emoji: '🤣',
// 		sender_id: '2640ec35-9de3-44c1-8481-07615e66d240,2640ec35-9de3-44c1-8481-07615e66d242',
// 		emojiIdList: ['08ab23c5-97c3-4bb6-9901-93847ee06feb'],
// 	},
// 	{
// 		emoji: '🥰',
// 		sender_id: '2640ec35-9de3-44c1-8481-07615e66d240,2640ec35-9de3-44c1-8481-07615e66d240',
// 		emojiIdList: ['156a7dd5-3bd8-4734-96cf-038297823fae'],
// 	},
// 	{
// 		emoji: '🤩',
// 		sender_id: '2640ec35-9de3-44c1-8481-07615e66d240, 2640ec35-9de3-44c1-8481-07615e66d241',
// 		emojiIdList: ['ec545b74-5a5d-42e5-a54d-8519a47d034d'],
// 	},
// ];

// xử lý mảng này để được kết quả có định dạng:

// [
// 	emoji: '🤣',
// 	sender:[
// 		{id: "2640ec35-9de3-44c1-8481-07615e66d240",
// 		count: 1 // số lần lặp lại của id đó
// 		isReacted: false}
// 	]

// 	emojiIdList: ['08ab23c5-97c3-4bb6-9901-93847ee06feb'],

// ]
