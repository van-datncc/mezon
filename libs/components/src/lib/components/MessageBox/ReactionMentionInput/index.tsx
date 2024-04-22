import { EmojiListSuggestion } from '@mezon/components';
import { useChatMessages, useClickUpToEdit, useEmojiSuggestion, useGifsStickersEmoji } from '@mezon/core';
import { IMessageSendPayload, KEY_KEYBOARD, MentionDataProps, ThreadValue, UserMentionsOpt, focusToElement, threadError } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { KeyboardEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Mention, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';
import textFieldEdit from 'text-field-edit';

import { useReference, useThreads } from '@mezon/core';
import { referencesActions, threadsActions, useAppDispatch } from '@mezon/store';
import { ChannelMembersEntity, ILineMention, UsersClanEntity, regexToDetectGifLink, uniqueUsers } from '@mezon/utils';

import { useChannelMembers, useClans } from '@mezon/core';
import { ChannelsEntity, channelUsersActions, selectCurrentChannel } from '@mezon/store';
import { useSelector } from 'react-redux';
import { ThreadNameTextField } from '../../../components';
import PrivateThread from '../../ChannelTopbar/TopBarComponents/Threads/CreateThread/PrivateThread';
import { useMessageLine } from '../../MessageWithUser/useMessageLine';
import mentionsInputStyle from './RmentionInputStyle';
import mentionStyle from './RmentionStyle';

export type MentionReactInputProps = {
	onSend: (
		content: IMessageSendPayload,
		mentions?: Array<ApiMessageMention>,
		attachments?: Array<ApiMessageAttachment>,
		references?: Array<ApiMessageRef>,
		value?: ThreadValue,
	) => void;
	onTyping?: () => void;
	onCreateThread?: (key: string) => void;
	listMentions?: MentionDataProps[] | undefined;
	isThread?: boolean;
	handlePaste?: any;
	currentChannelId?: string;
};

function MentionReactInput(props: MentionReactInputProps): ReactElement {
	const [valueTextInput, setValueTextInput] = useState('');
	const dispatch = useAppDispatch();
	const { referenceMessage, dataReferences, setReferenceMessage, setDataReferences } = useReference();
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const { attachmentDataRef, setAttachmentData } = useReference();
	const [content, setContent] = useState('');
	const [nameThread, setNameThread] = useState('');

	const { currentThread, messageThreadError, isPrivate } = useThreads();
	const currentChannel = useSelector(selectCurrentChannel);
	const { mentions } = useMessageLine(content);
	const { usersClan } = useClans();
	const { rawMembers } = useChannelMembers({ channelId: currentChannel?.channel_id as string });
	const { lastMessageByUserId } = useChatMessages({ channelId: currentChannel?.channel_id as string });

	useEffect(() => {
		if (referenceMessage && referenceMessage.attachments) {
			dispatch(
				referencesActions.setDataReferences([
					{
						message_id: '',
						message_ref_id: referenceMessage.id,
						ref_type: 0,
						message_sender_id: referenceMessage.sender_id,
						content: JSON.stringify(referenceMessage.content),
						has_attachment: referenceMessage.attachments?.length > 0 ? true : false,
					},
				]),
			);
		}
	}, [referenceMessage]);

	const onKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>): Promise<void> => {
		const { keyCode, shiftKey } = event;

		switch (keyCode) {
			case KEY_KEYBOARD.ENTER: {
				if (shiftKey) {
					return;
				} else {
					event.preventDefault();
					handleSend();
					return;
				}
			}
			default: {
				return;
			}
		}
	};

	const handleSend = useCallback(() => {
		if (!valueTextInput.trim() && attachmentDataRef.length === 0 && mentionData.length === 0) {
			if (!nameThread.trim() && props.isThread && !currentThread) {
				dispatch(threadsActions.setMessageThreadError(threadError.message));
				dispatch(threadsActions.setNameThreadError(threadError.name));
				return;
			}
			if (props.isThread && !currentThread) {
				dispatch(threadsActions.setMessageThreadError(threadError.message));
			}
			return;
		}

		if (!nameThread.trim() && props.isThread && !currentThread) {
			dispatch(threadsActions.setNameThreadError(threadError.name));
			return;
		}

		if (referenceMessage !== null && dataReferences.length > 0) {
			props.onSend({ t: content }, mentionData, attachmentDataRef, dataReferences, { nameThread, isPrivate });
			addMemberToChannel(currentChannel, mentions, usersClan, rawMembers);
			setValueTextInput('');
			setAttachmentData([]);
			setReferenceMessage(null);
			setDataReferences([]);
			setNameThread('');
			setContent('');
			dispatch(threadsActions.setIsPrivate(0));
		} else {
			props.onSend({ t: content }, mentionData, attachmentDataRef, undefined, { nameThread, isPrivate });
			addMemberToChannel(currentChannel, mentions, usersClan, rawMembers);
			setValueTextInput('');
			setAttachmentData([]);
			setNameThread('');
			setContent('');
			dispatch(threadsActions.setIsPrivate(0));
		}
	}, [
		valueTextInput,
		attachmentDataRef,
		mentionData,
		nameThread,
		currentChannel,
		currentThread,
		mentions,
		isPrivate,
		content,
		referenceMessage,
		dataReferences,
	]);

	const addMemberToChannel = async (
		currentChannel: ChannelsEntity | null,
		mentions: ILineMention[],
		userClans: UsersClanEntity[],
		members: ChannelMembersEntity[],
	) => {
		const userIds = uniqueUsers(mentions, userClans, members);
		const body = {
			channelId: currentChannel?.channel_id as string,
			channelType: currentChannel?.type,
			userIds: userIds as string[],
		};
		if (userIds.length > 0) {
			await dispatch(channelUsersActions.addChannelUsers(body));
		}
	};

	const mentionedUsers: UserMentionsOpt[] = [];

	const onChangeMentionInput: OnChangeHandlerFunc = (event, newValue, newPlainTextValue, mentions) => {
		const linkGifDirect = newValue?.match(regexToDetectGifLink);
		if (linkGifDirect && linkGifDirect?.length > 0) {
			const newAttachmentDataRef = linkGifDirect
				.filter((item) => item !== null)
				.map((item: string) => ({
					filetype: 'image/gif',
					url: item,
				}));

			setAttachmentData(newAttachmentDataRef);
		}

		dispatch(threadsActions.setMessageThreadError(''));
		setValueTextInput(newValue);
		if (typeof props.onTyping === 'function') {
			props.onTyping();
		}
		setValueTextInput(newValue);
		setContent(newPlainTextValue);
		if (mentions.length > 0) {
			for (const mention of mentions) {
				mentionedUsers.push({
					user_id: mention.id.toString() ?? '',
					username: mention.display ?? '',
				});
			}
			setMentionData(mentionedUsers);
		}
	};

	const {
		isEmojiListShowed,
		emojiPicked,
		keyCodeFromKeyBoard,
		setIsEmojiListShowed,
		textToSearchEmojiSuggestion,
		setTextToSearchEmojiSuggesion,
		pressAnyButtonState,
	} = useEmojiSuggestion();

	const editorRef = useRef<HTMLInputElement | null>(null);
	const emojiListRef = useRef<HTMLDivElement>(null);
	const { subPanelActive } = useGifsStickersEmoji();
	const { openReplyMessageState } = useReference();

	useEffect(() => {
		if (keyCodeFromKeyBoard || !isEmojiListShowed || subPanelActive || (referenceMessage && openReplyMessageState)) {
			return focusToElement(editorRef);
		}
	}, [pressAnyButtonState, keyCodeFromKeyBoard, isEmojiListShowed, subPanelActive, referenceMessage, openReplyMessageState]);

	useEffect(() => {
		handleEventAfterEmojiPicked();
	}, [emojiPicked]);

	useEffect(() => {
		if (content) {
			setTextToSearchEmojiSuggesion(content);
		}
		if (content === '') {
			setIsEmojiListShowed(false);
		}
	}, [content]);

	const input = document.querySelector('#editorReactMention') as HTMLElement | null;
	function handleEventAfterEmojiPicked() {
		if (!emojiPicked || !input) {
			return;
		}
		const syntaxEmoji = findSyntaxEmoji(content) ?? '';
		if (syntaxEmoji === '') {
			textFieldEdit.insert(input, emojiPicked);
		} else {
			const replaceSyntaxByEmoji = content.replace(syntaxEmoji, emojiPicked);
			setValueTextInput(replaceSyntaxByEmoji);
			setContent(replaceSyntaxByEmoji);
			focusToElement(editorRef);
		}
	}

	function findSyntaxEmoji(contentText: string): string | null {
		const regexEmoji = /:[^\s]+(?=$|[\p{Emoji}])/gu;
		const emojiArray = Array.from(contentText.matchAll(regexEmoji), (match) => match[0]);
		if (emojiArray.length > 0) {
			return emojiArray[0];
		}
		return null;
	}
	const handleChangeNameThread = (nameThread: string) => {
		setNameThread(nameThread);
	};

	const clickUpToEditMessage = () => {
		const idRefMessage = lastMessageByUserId?.id;
		if (idRefMessage) {
			dispatch(referencesActions.setIdMessageToJump(idRefMessage));
			dispatch(referencesActions.setOpenEditMessageState(true));
			dispatch(referencesActions.setOpenReplyMessageState(false));
			dispatch(referencesActions.setReferenceMessage(lastMessageByUserId));
		}
	};

	useClickUpToEdit(editorRef, clickUpToEditMessage);

	return (
		<div className="relative">
			<EmojiListSuggestion ref={emojiListRef} valueInput={textToSearchEmojiSuggestion ?? ''} />
			{props.isThread && !currentThread && (
				<div>
					<ThreadNameTextField
						onChange={handleChangeNameThread}
						onKeyDown={onKeyDown}
						value={nameThread}
						label="Thread Name"
						placeholder="Enter Thread Name"
						className="h-10 p-[10px] bg-black text-base outline-none rounded-md placeholder:text-sm"
					/>
					<PrivateThread title="Private Thread" label="Only people you invite and moderators can see" />
				</div>
			)}
			{props.isThread && messageThreadError && !currentThread && <span className="text-xs text-[#B91C1C] mt-1 ml-1">{messageThreadError}</span>}
			<MentionsInput
				onPaste={props.handlePaste}
				id="editorReactMention"
				inputRef={editorRef}
				placeholder="Write your thoughs here..."
				value={valueTextInput}
				onChange={onChangeMentionInput}
				style={mentionsInputStyle}
				allowSpaceInQuery={true}
				onKeyDown={onKeyDown}
				forceSuggestionsAboveCursor={true}
			>
				<Mention
					appendSpaceOnAdd={true}
					style={mentionStyle}
					data={props.listMentions ?? []}
					trigger="@"
					displayTransform={(id: any, display: any) => {
						return `@${display}`;
					}}
					renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
						return (
							<div className="flex flex-row items-center gap-2 ">
								<img
									src={(suggestion as any).avatarUrl}
									alt={suggestion.display}
									style={{ width: '30px', height: '30px', borderRadius: '50%' }}
								/>
								<span>{highlightedDisplay}</span>
							</div>
						);
					}}
				/>
			</MentionsInput>
		</div>
	);
}

export default MentionReactInput;
