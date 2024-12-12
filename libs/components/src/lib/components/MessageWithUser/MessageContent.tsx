import { addMention, convertTimeString, ETypeLinkMedia, IExtendedMessage, IMessageWithUser, isValidEmojiData, TypeMessage } from '@mezon/utils';
import { safeJSONParse } from 'mezon-js';
import { useCallback } from 'react';
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
	const lines = message?.content?.t;
	const contentUpdatedMention = addMention(message.content, message?.mentions as any);

	const isOnlyContainEmoji = isValidEmojiData(contentUpdatedMention);

	const lineValue = (() => {
		if (lines === undefined && typeof message.content === 'string') {
			return safeJSONParse(message.content).t;
		} else {
			return lines;
		}
	})();

	const handleCopyMessage = useCallback(
		(event: React.ClipboardEvent<HTMLDivElement>, startIndex: number, endIndex: number) => {
			if (message?.content && message?.mentions) {
				const key = 'text/mezon-mentions';
				const copyData = {
					message: message,
					startIndex: startIndex,
					endIndex: endIndex
				};
				const value = JSON.stringify(copyData);

				event.preventDefault();

				event.clipboardData.setData(key, value);
			}
		},
		[message]
	);

	return (
		<MessageText
			isOnlyContainEmoji={isOnlyContainEmoji}
			isSearchMessage={isSearchMessage}
			content={contentUpdatedMention}
			message={message}
			lines={lineValue as string}
			mode={mode}
			onCopy={handleCopyMessage}
		/>
	);
};

export default MessageContent;

const MessageText = ({
	message,
	lines,
	mode,
	content,
	isOnlyContainEmoji,
	isSearchMessage,
	onCopy
}: {
	message: IMessageWithUser;
	lines: string;
	mode?: number;
	content?: IExtendedMessage;
	isSearchMessage?: boolean;
	isOnlyContainEmoji?: boolean;
	onCopy?: (event: React.ClipboardEvent<HTMLDivElement>, startIndex: number, endIndex: number) => void;
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
								onCopy={onCopy}
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
