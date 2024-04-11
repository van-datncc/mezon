import { EmojiListSuggestion } from '@mezon/components';
import { useEmojiSuggestion, useGifsStickersEmoji } from '@mezon/core';
import { IMessageSendPayload, KEY_KEYBOARD, MentionDataProps, UserMentionsOpt, focusToElement, threadError } from '@mezon/utils';
import { KeyboardEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Mention, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';
import textFieldEdit from 'text-field-edit';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

import { useReference, useThreads } from '@mezon/core';
import { referencesActions, threadsActions, useAppDispatch } from '@mezon/store';
import { ThreadNameTextField } from '../../../components';
import mentionsInputStyle from './RmentionInputStyle';
import mentionStyle from './RmentionStyle';

export type MentionReactInputProps = {
	onSend: (
		content: IMessageSendPayload,
		mentions?: Array<ApiMessageMention>,
		attachments?: Array<ApiMessageAttachment>,
		references?: Array<ApiMessageRef>,
		value?: string,
	) => void;
	onTyping?: () => void;
	onCreateThread?: (key: string) => void;
	listMentions?: MentionDataProps[] | undefined;
	isThread?: boolean;
};

function MentionReactInput(props: MentionReactInputProps): ReactElement {
	const [valueTextInput, setValueTextInput] = useState('');
	const dispatch = useAppDispatch();
	const { referenceMessage, dataReferences, setReferenceMessage, setDataReferences } = useReference();
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const [attachmentData, setAttachmentData] = useState<ApiMessageAttachment[]>([]);
	const [content, setContent] = useState('');
	const { setKeyboardPressAnyButtonStatus } = useEmojiSuggestion();
	const [nameThread, setNameThread] = useState('');

	const { currentThread, messageThreadError } = useThreads();

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
		if (!valueTextInput.trim() && attachmentData.length === 0 && mentionData.length === 0) {
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
			props.onSend({ t: content }, mentionData, attachmentData, dataReferences, nameThread);
			setValueTextInput('');
			setAttachmentData([]);
			setReferenceMessage(null);
			setDataReferences([]);
			setNameThread('');
		} else {
			props.onSend({ t: content }, mentionData, attachmentData, undefined, nameThread);
			setValueTextInput('');
			setAttachmentData([]);
			setNameThread('');
		}
		setIsEmojiListShowed(false);
	}, [valueTextInput, attachmentData, mentionData, nameThread, currentThread, referenceMessage, dataReferences, props.onSend]);

	const mentionedUsers: UserMentionsOpt[] = [];

	const onChangeMentionInput: OnChangeHandlerFunc = (event, newValue, newPlainTextValue, mentions) => {
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
		setEmojiSuggestion,
		textToSearchEmojiSuggestion,
		setTextToSearchEmojiSuggesion,
		setKeyCodeFromKeyBoardState,
		pressAnyButtonState,
	} = useEmojiSuggestion();

	const editorRef = useRef<HTMLInputElement | null>(null);
	const emojiListRef = useRef<HTMLDivElement>(null);
	const { subPanelActive } = useGifsStickersEmoji();
	useEffect(() => {
		if (keyCodeFromKeyBoard || !isEmojiListShowed || subPanelActive) {
			return focusToElement(editorRef);
		}
	}, [pressAnyButtonState, keyCodeFromKeyBoard, isEmojiListShowed, subPanelActive]);

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

	return (
		<div className="relative">
			<EmojiListSuggestion ref={emojiListRef} valueInput={textToSearchEmojiSuggestion ?? ''} />
			{props.isThread && !currentThread && (
				<ThreadNameTextField
					onChange={handleChangeNameThread}
					onKeyDown={onKeyDown}
					value={nameThread}
					label="Thread Name"
					placeholder="Enter Thread Name"
					className="h-10 p-[10px] bg-black text-base outline-none rounded-md placeholder:text-sm"
				/>
			)}
			{props.isThread && messageThreadError && !currentThread && <span className="text-xs text-[#B91C1C] mt-1 ml-1">{messageThreadError}</span>}
			<MentionsInput
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
