import {
	fetchMessages,
	selectCurrentChannelId,
	selectCurrentClanId,
	selectMessageByMessageId,
	selectTheme,
	topicsActions,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ETypeLinkMedia, IExtendedMessage, IMessageWithUser, TypeMessage, addMention, convertTimeString, isValidEmojiData } from '@mezon/utils';
import { safeJSONParse } from 'mezon-js';
import { useSelector } from 'react-redux';
import { MessageLine } from './MessageLine';
import { MessageLineSystem } from './MessageLineSystem';

type IMessageContentProps = {
	message: IMessageWithUser;
	isCombine?: boolean;
	newMessage?: string;
	isSending?: boolean;
	isError?: boolean;
	mode?: number;
	content?: IExtendedMessage;
	isSearchMessage?: boolean;
};

const MessageContent = ({ message, mode, isSearchMessage }: IMessageContentProps) => {
	const dispatch = useAppDispatch();
	const lines = message?.content?.t;
	const contentUpdatedMention = addMention(message.content, message?.mentions as any);
	const currentClanId = useSelector(selectCurrentClanId);
	const isOnlyContainEmoji = isValidEmojiData(contentUpdatedMention);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentMessage = useAppSelector((state) => selectMessageByMessageId(state, currentChannelId, message.id || ''));
	const lineValue = (() => {
		if (lines === undefined && typeof message.content === 'string') {
			return safeJSONParse(message.content).t;
		} else {
			return lines;
		}
	})();
	const theme = useAppSelector(selectTheme);

	const handleOpenTopic = () => {
		dispatch(topicsActions.setIsShowCreateTopic({ channelId: message.channel_id as string, isShowCreateTopic: true }));
		dispatch(topicsActions.setCurrentTopicId(message?.content?.tp || ''));
		fetchMessages({ channelId: message?.content?.tp as string, clanId: currentClanId as string, noCache: true });
	};

	return (
		<div>
			<MessageText
				isOnlyContainEmoji={isOnlyContainEmoji}
				isSearchMessage={isSearchMessage}
				content={contentUpdatedMention}
				message={message}
				lines={lineValue as string}
				mode={mode}
			/>
			{currentMessage?.code === TypeMessage.Topic && (
				<div
					className="border border-colorTextLightMode dark:border-contentTertiary dark:text-contentTertiary text-colorTextLightMode rounded-lg my-1 p-2 w-[70%] flex justify-between items-center bg-textPrimary dark:bg-bgSearchHover cursor-pointer hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"
					onClick={handleOpenTopic}
				>
					<p className={'text-sm h-fit'}>view topic</p>
					<Icons.ArrowRight
						defaultFill={theme === 'dark' ? '#AEAEAE' : '#535353'}
						defaultSize={'w-4 h-4 min-w-4 hover:text-white text-borderDividerLight'}
					/>
				</div>
			)}
		</div>
	);
};

export default MessageContent;

const MessageText = ({
	message,
	lines,
	mode,
	content,
	isOnlyContainEmoji,
	isSearchMessage
}: {
	message: IMessageWithUser;
	lines: string;
	mode?: number;
	content?: IExtendedMessage;
	isSearchMessage?: boolean;
	isOnlyContainEmoji?: boolean;
}) => {
	const attachmentOnMessage = message.attachments;

	const contentToMessage = message.content?.t;

	const checkOneLinkImage =
		attachmentOnMessage?.length === 1 &&
		attachmentOnMessage[0].filetype?.startsWith(ETypeLinkMedia.IMAGE_PREFIX) &&
		attachmentOnMessage[0].url === contentToMessage?.trim();
	const showEditted = !message.hide_editted;
	const messageTime = convertTimeString(message?.create_time as string);
	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{lines?.length > 0 ? (
				<div className="flex w-full">
					<div className="w-full flex gap-4">
						{message.code === TypeMessage.CreatePin ? (
							<MessageLineSystem
								message={message}
								isHideLinkOneImage={checkOneLinkImage}
								isTokenClickAble={true}
								isSearchMessage={isSearchMessage}
								isJumMessageEnabled={false}
								content={content}
								mode={mode}
							/>
						) : (
							<MessageLine
								isEditted={showEditted}
								isHideLinkOneImage={checkOneLinkImage}
								isTokenClickAble={true}
								isSearchMessage={isSearchMessage}
								isOnlyContainEmoji={isOnlyContainEmoji}
								isJumMessageEnabled={false}
								content={content}
								mode={mode}
								code={message.code}
							/>
						)}
						{(message.code === TypeMessage.Welcome ||
							message.code === TypeMessage.CreateThread ||
							message.code === TypeMessage.CreatePin) && (
							<div className="dark:text-zinc-400 text-colorTextLightMode text-[10px] cursor-default">{messageTime}</div>
						)}
					</div>
				</div>
			) : null}
		</>
	);
};
