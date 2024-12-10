// eslint-disable-next-line @nx/enforce-module-boundaries
import { ChannelsEntity, selectChannelsEntities } from '@mezon/store';
import { EBacktickType, ETokenMessage, IExtendedMessage, TypeMessage, convertMarkdown } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChannelHashtag, EmojiMarkup, MarkdownContent, MentionUser, PlainText, useMessageContextMenu } from '../../components';

type MessageLineProps = {
	mode?: number;
	content?: IExtendedMessage;
	onClickToMessage?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	isOnlyContainEmoji?: boolean;
	isSearchMessage?: boolean;
	isHideLinkOneImage?: boolean;
	isJumMessageEnabled: boolean;
	isTokenClickAble: boolean;
	isEditted: boolean;
	isInPinMsg?: boolean;
	code?: number;
	onCopy?: (event: React.ClipboardEvent<HTMLDivElement>, startIndex: number, endIndex: number) => void;
};

const MessageLineComponent = ({
	mode,
	content,
	isJumMessageEnabled,
	onClickToMessage,
	isOnlyContainEmoji,
	isSearchMessage,
	isTokenClickAble,
	isHideLinkOneImage,
	isEditted,
	isInPinMsg,
	code,
	onCopy
}: MessageLineProps) => {
	const allChannels = useSelector(selectChannelsEntities);
	const allChannelVoice = Object.values(allChannels).flat();
	return (
		<div
			onClick={
				isJumMessageEnabled
					? onClickToMessage
					: () => {
							// eslint-disable-next-line @typescript-eslint/no-empty-function
						}
			}
			className={`${!isJumMessageEnabled ? '' : 'cursor-pointer'} `}
		>
			<RenderContent
				isHideLinkOneImage={isHideLinkOneImage}
				isTokenClickAble={isTokenClickAble}
				isOnlyContainEmoji={isOnlyContainEmoji}
				isJumMessageEnabled={isJumMessageEnabled}
				data={content as IExtendedMessage}
				mode={mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL}
				allChannelVoice={allChannelVoice}
				isSearchMessage={isSearchMessage}
				isEditted={isEditted}
				isInPinMsg={isInPinMsg}
				code={code}
				onCopy={onCopy}
			/>
		</div>
	);
};

export const MessageLine = memo(MessageLineComponent);

interface RenderContentProps {
	data: IExtendedMessage;
	mode: number;
	allChannelVoice?: ChannelsEntity[];
	isOnlyContainEmoji?: boolean;
	isSearchMessage?: boolean;
	isHideLinkOneImage?: boolean;
	isTokenClickAble: boolean;
	isJumMessageEnabled: boolean;
	parentWidth?: number;
	isEditted: boolean;
	isInPinMsg?: boolean;
	code?: number;
	onCopy?: (event: React.ClipboardEvent<HTMLDivElement>, startIndex: number, endIndex: number) => void;
}

export interface ElementToken {
	s?: number;
	e?: number;
	kindOf: ETokenMessage;
	user_id?: string;
	role_id?: string;
	channelid?: string;
	emojiid?: string;
	type?: EBacktickType;
}

const RenderContent = memo(
	({
		data,
		mode,
		allChannelVoice,
		isSearchMessage,
		isJumMessageEnabled,
		parentWidth,
		isOnlyContainEmoji,
		isTokenClickAble,
		isHideLinkOneImage,
		isEditted,
		isInPinMsg,
		code,
		onCopy
	}: RenderContentProps) => {
		const { t, mentions = [], hg = [], ej = [], mk = [], lk = [], vk = [] } = data;
		const hgm = Array.isArray(hg) ? hg.map((item) => ({ ...item, kindOf: ETokenMessage.HASHTAGS })) : [];
		const ejm = Array.isArray(ej) ? ej.map((item) => ({ ...item, kindOf: ETokenMessage.EMOJIS })) : [];
		const mkm = Array.isArray(mk) ? mk.map((item) => ({ ...item, kindOf: ETokenMessage.MARKDOWNS })) : [];
		const lkm = Array.isArray(lk) ? lk.map((item) => ({ ...item, kindOf: ETokenMessage.LINKS })) : [];
		const vkm = Array.isArray(vk) ? vk.map((item) => ({ ...item, kindOf: ETokenMessage.VOICE_LINKS })) : [];
		const elements: ElementToken[] = [
			...mentions.map((item) => ({ ...item, kindOf: ETokenMessage.MENTIONS })),
			...hgm,
			...ejm,
			...mkm,
			...lkm,
			...vkm
		].sort((a, b) => (a.s ?? 0) - (b.s ?? 0));
		const { allUserIdsInChannel, allRolesInClan } = useMessageContextMenu();

		let lastindex = 0;
		const content = useMemo(() => {
			const formattedContent: React.ReactNode[] = [];

			elements.forEach((element, index) => {
				const s = element.s ?? 0;
				const e = element.e ?? 0;

				const contentInElement = t?.substring(s, e);

				if (lastindex < s) {
					formattedContent.push(
						<PlainText isSearchMessage={isSearchMessage} key={`plain-${lastindex}`} text={t?.slice(lastindex, s) ?? ''} />
					);
				}

				if (element.kindOf === ETokenMessage.HASHTAGS) {
					formattedContent.push(
						<ChannelHashtag
							isTokenClickAble={isTokenClickAble}
							isJumMessageEnabled={isJumMessageEnabled}
							key={`hashtag-${index}-${s}-${element.channelid}`}
							channelHastagId={`<#${element.channelid}>`}
						/>
					);
				}

				if (element.kindOf === ETokenMessage.MENTIONS && element.user_id) {
					if (allUserIdsInChannel.indexOf(element.user_id) !== -1 || contentInElement === '@here') {
						formattedContent.push(
							<MentionUser
								isTokenClickAble={isTokenClickAble}
								isJumMessageEnabled={isJumMessageEnabled}
								key={`mentionUser-${index}-${s}-${contentInElement}-${element.user_id}-${element.role_id}`}
								tagUserName={contentInElement ?? ''}
								tagUserId={element.user_id}
								mode={mode}
							/>
						);
					} else {
						formattedContent.push(
							<PlainText
								isSearchMessage={false}
								key={`userDeleted-${index}-${s}-${contentInElement}-${element.user_id}-${element.role_id}`}
								text={contentInElement ?? ''}
							/>
						);
					}
				}
				if (element.kindOf === ETokenMessage.MENTIONS && element.role_id) {
					if (allRolesInClan.indexOf(element.role_id) !== -1) {
						formattedContent.push(
							<MentionUser
								isTokenClickAble={isTokenClickAble}
								isJumMessageEnabled={isJumMessageEnabled}
								key={`roleMention-${index}-${s}-${contentInElement}-${element.user_id}-${element.role_id}`}
								tagRoleName={contentInElement ?? ''}
								tagRoleId={element.role_id}
								mode={mode}
							/>
						);
					} else {
						formattedContent.push(
							<PlainText
								isSearchMessage={false}
								key={`roleDeleted-${index}-${s}-${contentInElement}-${element.user_id}-${element.role_id}`}
								text={contentInElement ?? ''}
							/>
						);
					}
				}
				if (element.kindOf === ETokenMessage.EMOJIS) {
					formattedContent.push(
						<EmojiMarkup
							isOne={Number(t?.length) - 1 === Number(element?.e) - Number(element.s)}
							key={`emoji-${index}-${s}-${element.emojiid}`}
							emojiSyntax={contentInElement ?? ''}
							onlyEmoji={isOnlyContainEmoji ?? false}
							emojiId={element.emojiid ?? ''}
						/>
					);
				}

				if (element.kindOf === ETokenMessage.LINKS && !isHideLinkOneImage) {
					formattedContent.push(
						<MarkdownContent
							isLink={true}
							isTokenClickAble={isTokenClickAble}
							isJumMessageEnabled={isJumMessageEnabled}
							key={`link-${index}-${s}-${contentInElement}`}
							content={contentInElement}
						/>
					);
				}

				if (element.kindOf === ETokenMessage.VOICE_LINKS) {
					const meetingCode = contentInElement?.split('/').pop();
					const voiceChannelFound = allChannelVoice?.find((channel) => channel.meeting_code === meetingCode) || null;
					voiceChannelFound
						? formattedContent.push(
								<ChannelHashtag
									isTokenClickAble={isTokenClickAble}
									isJumMessageEnabled={isJumMessageEnabled}
									key={`voicelink-${index}-${s}-${voiceChannelFound?.channel_id}`}
									channelHastagId={`<#${voiceChannelFound?.channel_id}>`}
								/>
							)
						: formattedContent.push(
								<MarkdownContent
									isLink={true}
									isTokenClickAble={isTokenClickAble}
									isJumMessageEnabled={isJumMessageEnabled}
									key={`voicelink-${index}-${s}-${contentInElement}`}
									content={contentInElement}
								/>
							);
				}

				if (element.kindOf === ETokenMessage.MARKDOWNS) {
					let content = contentInElement ?? '';

					if (isJumMessageEnabled) {
						content = content.replace(/\n/g, '');

						if (element.type === EBacktickType.TRIPLE) {
							content = content.replace(/```/g, '`');
						}
					} else {
						content = convertMarkdown(content);
					}
					formattedContent.push(
						<MarkdownContent
							isBacktick={true}
							isTokenClickAble={isTokenClickAble}
							isJumMessageEnabled={isJumMessageEnabled}
							key={`markdown-${index}-${s}-${contentInElement}`}
							content={content}
							isInPinMsg={isInPinMsg}
							typeOfBacktick={element.type}
						/>
					);
				}

				lastindex = e;
			});

			if (t && lastindex < t?.length) {
				formattedContent.push(<PlainText isSearchMessage={isSearchMessage} key={`plain-${lastindex}-end`} text={t.slice(lastindex)} />);
			}

			if (isEditted) {
				formattedContent.push(
					<p
						key={`edited-status-${lastindex}-end`}
						className="ml-[5px] inline opacity-50 text-[9px] self-center font-semibold dark:text-textDarkTheme text-textLightTheme w-[50px]"
					>
						(edited)
					</p>
				);
			}

			return formattedContent;
		}, [elements, t, mode]);

		const divRef = useRef<HTMLDivElement>(null);
		const [selectionIndex, setSelectionIndex] = useState({ startIndex: 0, endIndex: 0 });

		// Calculate the index position within the div
		const getIndex = (node: Node, offset: number) => {
			let currentNode = node;
			let totalOffset = offset;

			// Traverse up the DOM tree to calculate the index
			while (currentNode && currentNode !== divRef.current) {
				// Traverse previous siblings to account for their text content
				while (currentNode.previousSibling) {
					currentNode = currentNode.previousSibling;
					totalOffset += currentNode.textContent?.length ?? 0;
				}
				currentNode = currentNode.parentNode as Node;
			}
			return totalOffset;
		};

		// Determine the selection's start and end index
		const handleMouseUp = () => {
			const selection = window.getSelection();

			// Ensure selection exists and is within the div
			if (selection && selection.rangeCount > 0 && divRef.current) {
				const range = selection.getRangeAt(0);
				const { startContainer, endContainer, startOffset, endOffset } = range;

				// Check if selection is within the target div
				if (divRef.current.contains(startContainer) && divRef.current.contains(endContainer)) {
					const startIndex = getIndex(startContainer, startOffset);
					const endIndex = getIndex(endContainer, endOffset);
					setSelectionIndex({ startIndex, endIndex });
				}
			}
		};

		const handleMouseLeave = () => {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0 && divRef.current && selection.toString().length) {
				handleMouseUp();
			}
		};

		const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
			const isSelectionHasMention = mentions.find((mention) => {
				return (mention.s || 0) >= selectionIndex.startIndex && (mention.e as number) <= selectionIndex.endIndex;
			});
			if (isSelectionHasMention) {
				if (onCopy) {
					onCopy(event, selectionIndex.startIndex, selectionIndex.endIndex);
				}
				return;
			}
		};

		return (
			<div
				ref={divRef}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
				onCopy={handleCopy}
				style={
					isJumMessageEnabled
						? {
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}
						: {
								whiteSpace: 'break-spaces',
								overflowWrap: 'break-word'
							}
				}
				className={`${isJumMessageEnabled ? 'whitespace-pre-line gap-1 hover:text-[#060607] hover:dark:text-[#E6F3F5] text-[#4E5057] dark:text-[#B4BAC0] flex items-center  cursor-pointer' : 'text-[#4E5057] dark:text-[#DFDFE0]'}`}
			>
				{code === TypeMessage.MessageBuzz ? <span className="text-red-500">{content}</span> : <span>{content}</span>}
			</div>
		);
	}
);
