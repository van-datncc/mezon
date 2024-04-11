import { IMessageSendPayload, MentionDataProps, ThreadValue, UserMentionsOpt, threadError } from '@mezon/utils';
import { KeyboardEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

import { useReference, useThreads } from '@mezon/core';
import { referencesActions, threadsActions, useAppDispatch } from '@mezon/store';
import { Mention, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';
import { ThreadNameTextField } from '../../../components';
import PrivateThread from '../../ChannelTopbar/TopBarComponents/Threads/CreateThread/PrivateThread';
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
};

function MentionReactInput(props: MentionReactInputProps): ReactElement {
	const [valueTextInput, setValueTextInput] = useState('');
	const dispatch = useAppDispatch();
	const { referenceMessage, dataReferences, setReferenceMessage, setDataReferences } = useReference();
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const [attachmentData, setAttachmentData] = useState<ApiMessageAttachment[]>([]);
	const [content, setContent] = useState('');
	const [nameThread, setNameThread] = useState('');

	const { currentThread, messageThreadError, isPrivate } = useThreads();

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

	const KEY = { TAB: 9, ENTER: 13, ESC: 27, UP: 38, DOWN: 40, RIGHT: 39, LEFT: 27 };
	const onKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>): Promise<void> => {
		const { keyCode, shiftKey } = event;
		switch (keyCode) {
			case KEY.ENTER: {
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
			props.onSend({ t: content }, mentionData, attachmentData, dataReferences, { nameThread, isPrivate });
			setValueTextInput('');
			setAttachmentData([]);
			setReferenceMessage(null);
			setDataReferences([]);
			setNameThread('');
			dispatch(threadsActions.setIsPrivate(0));
		} else {
			props.onSend({ t: content }, mentionData, attachmentData, undefined, { nameThread, isPrivate });
			setValueTextInput('');
			setAttachmentData([]);
			setNameThread('');
			dispatch(threadsActions.setIsPrivate(0));
		}
	}, [valueTextInput, attachmentData, mentionData, nameThread, currentThread, isPrivate, referenceMessage, dataReferences]);

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

	const handleChangeNameThread = (nameThread: string) => {
		setNameThread(nameThread);
	};

	return (
		<div className="relative">
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
				placeholder="Write your thoughs here..."
				value={valueTextInput}
				onChange={onChangeMentionInput}
				style={mentionsInputStyle}
				allowSpaceInQuery={true}
				onKeyDown={onKeyDown}
				forceSuggestionsAboveCursor={true}
			>
				<Mention
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
				<Mention style={mentionStyle} data={props.listMentions ?? []} trigger="#" />
			</MentionsInput>
		</div>
	);
}

export default MentionReactInput;

// STILL DOING

// const { sessionRef, clientRef } = useMezon();
// const dispatch = useAppDispatch();

// const { onSend, onTyping, listMentions, currentChannelId, currentClanId } = props;
// const [editorState, setEditorState] = useState(EditorState.createEmpty());

// const [clearEditor, setClearEditor] = useState(false);
// const [content, setContent] = useState<string>('');
// const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
// const [attachmentData, setAttachmentData] = useState<ApiMessageAttachment[]>([]);
// const [showPlaceHolder, setShowPlaceHolder] = useState(false);
// const imagePlugin = createImagePlugin({ imageComponent: ImageComponent });
// const mentionPlugin = useRef(
// 	createMentionPlugin({
// 		entityMutability: 'IMMUTABLE',
// 		theme: editorStyles,
// 		mentionPrefix: '@',
// 		supportWhitespace: true,
// 		mentionTrigger: '@',
// 	}),
// );

// // const plugins = [mentionPlugin.current, imagePlugin];
// // //clear Editor after navigate channel
// // useEffect(() => {
// // 	setEditorState(EditorState.createEmpty());
// // }, [currentChannelId, currentClanId]);

// const onChange = useCallback(
// 	(editorState: EditorState) => {
// 		if (typeof onTyping === 'function') {
// 			onTyping();
// 		}
// 		setClearEditor(false);
// 		setEditorState(editorState);
// 		const contentState = editorState.getCurrentContent();
// 		const raw = convertToRaw(contentState);
// 		// get message
// 		const messageRaw = raw.blocks;
// 		const messageContent = Object.values(messageRaw)
// 			.filter((item) => item.text.trim() !== '')
// 			.map((item) => item.text);
// 		const messageBreakline = messageContent.join('\n').replace(/,/g, '');

// 		onConvertToFiles(messageBreakline);

// 		handleUrlInput(messageBreakline)
// 			.then((attachment) => {
// 				handleFinishUpload(attachment);
// 			})
// 			.catch(() => {
// 				setContent(content + messageBreakline);
// 			});

// 		const mentionedUsers = [];
// 		for (const key in raw.entityMap) {
// 			const ent = raw.entityMap[key];
// 			if (ent.type === 'mention') {
// 				mentionedUsers.push({
// 					user_id: ent.data.mention.id,
// 					username: ent.data.mention.name,
// 				});
// 			}
// 		}
// 		setMentionData(mentionedUsers);
// 	},
// 	[attachmentData],
// );

// const onConvertToFiles = useCallback(
// 	(content: string) => {
// 		if (content.length > 2000) {
// 			const fileContent = new Blob([content], { type: 'text/plain' });
// 			const now = Date.now();
// 			const filename = now + '.txt';
// 			const file = new File([fileContent], filename, { type: 'text/plain' });
// 			const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;

// 			const session = sessionRef.current;
// 			const client = clientRef.current;

// 			if (!client || !session || !currentChannelId) {
// 				throw new Error('Client is not initialized');
// 			}
// 			handleUploadFile(client, session, fullfilename, file)
// 				.then((attachment) => {
// 					handleFinishUpload(attachment);
// 					return 'handled';
// 				})
// 				.catch((err) => {
// 					return 'not-handled';
// 				});
// 			return;
// 		}
// 	},
// 	[attachmentData],
// );

// const handleFinishUpload = useCallback(
// 	(attachment: ApiMessageAttachment) => {
// 		let urlFile = attachment.url;
// 		if (attachment.filetype?.indexOf('pdf') !== -1) {
// 			urlFile = '/assets/images/pdficon.png';
// 		} else if (attachment.filetype?.indexOf('text') !== -1) {
// 			urlFile = '/assets/images/text.png';
// 		} else if (attachment.filetype?.indexOf('vnd.openxmlformats-officedocument.presentationml.presentation') !== -1) {
// 			urlFile = '/assets/images/pptfile.png';
// 		} else if (attachment.filetype?.indexOf('mp4') !== -1) {
// 			urlFile = '/assets/images/video.png';
// 		}

// 		const contentState = editorState.getCurrentContent();
// 		const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {
// 			src: urlFile,
// 			height: '20px',
// 			width: 'auto',
// 			onRemove: () => handleEditorRemove(),
// 		});
// 		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

// 		const newEditorState = EditorState.push(editorState, contentStateWithEntity, 'insert-fragment');
// 		const newEditorStateWithImage = EditorState.forceSelection(
// 			newEditorState,
// 			newEditorState.getSelection().merge({
// 				anchorOffset: 0,
// 				focusOffset: 0,
// 			}),
// 		);
// 		const newStateWithImage = AtomicBlockUtils.insertAtomicBlock(newEditorStateWithImage, entityKey, ' ');
// 		setEditorState(newStateWithImage);

// 		attachmentData.push(attachment);
// 		setAttachmentData(attachmentData);
// 	},
// 	[attachmentData, content, editorState],
// );

// const onPastedFiles = useCallback(
// 	(files: Blob[]) => {
// 		const now = Date.now();
// 		const filename = now + '.png';
// 		const file = new File(files, filename, { type: 'image/png' });
// 		const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;

// 		const session = sessionRef.current;
// 		const client = clientRef.current;

// 		if (!client || !session || !currentChannelId) {
// 			throw new Error('Client is not initialized');
// 		}
// 		handleUploadFile(client, session, fullfilename, file)
// 			.then((attachment) => {
// 				handleFinishUpload(attachment);
// 				return 'handled';
// 			})
// 			.catch((err) => {
// 				return 'not-handled';
// 			});

// 		return 'not-handled';
// 	},
// 	[attachmentData, clientRef, content, currentChannelId, currentClanId, editorState, sessionRef],
// );

// const handleEditorRemove = () => {
// 	const currentContentState = editorState.getCurrentContent();
// 	const newContentState = Modifier.applyEntity(currentContentState, editorState.getSelection(), null);
// 	const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
// 	setEditorState(newEditorState);
// };

// const referenceMessage = useSelector(selectReferenceMessage);
// const dataReferencesRefMess = useSelector(selectDataReferences);
// useEffect(() => {
// 	if (referenceMessage && referenceMessage.attachments) {
// 		dispatch(
// 			referencesActions.setDataReferences([
// 				{
// 					message_id: '',
// 					message_ref_id: referenceMessage.id,
// 					ref_type: 0,
// 					message_sender_id: referenceMessage.sender_id,
// 					content: JSON.stringify(referenceMessage.content),
// 					has_attachment: referenceMessage.attachments?.length > 0 ? true : false,
// 				},
// 			]),
// 		);
// 	}
// }, [referenceMessage]);

// const handleSend = useCallback(() => {
// 	if (!content.trim() && attachmentData.length === 0 && mentionData.length === 0) {
// 		return;
// 	}

// 	if (referenceMessage !== null && dataReferencesRefMess.length > 0) {
// 		onSend({ t: content }, mentionData, attachmentData, dataReferencesRefMess);
// 		setContent('');
// 		setAttachmentData([]);
// 		setClearEditor(true);
// 		setEditorState(() => EditorState.createEmpty());
// 		dispatch(referencesActions.setReferenceMessage(null));
// 		dispatch(referencesActions.setDataReferences(null));
// 	} else {
// 		onSend({ t: content }, mentionData, attachmentData);
// 		setContent('');
// 		setAttachmentData([]);
// 		setClearEditor(true);
// 		setEditorState(() => EditorState.createEmpty());
// 	}
// 	clearSuggestionEmojiAfterSendMessage();
// }, [content, onSend, mentionData, attachmentData]);

// function keyBindingFn(e: React.KeyboardEvent<Element>) {
// 	if (e.key === 'Enter' && !e.shiftKey) {
// 		return 'onsend';
// 	}
// }

// function handleKeyCommand(command: string) {
// 	if (command === 'onsend') {
// 		handleSend();
// 		return 'handled';
// 	}
// 	return 'not-handled';
// }

// const editorRef = useRef<Editor | null>(null);

// // const onFocusEditorState = () => {
// // 	setTimeout(() => {
// // 		editorRef.current!.focus();
// // 	}, 0);
// // };

// const moveSelectionToEnd = useCallback(() => {
// 	setTimeout(() => {
// 		editorRef.current!.focus();
// 	}, 0);
// 	const editorContent = editorState.getCurrentContent();
// 	const editorSelection = editorState.getSelection();
// 	const updatedSelection = editorSelection.merge({
// 		anchorKey: editorContent.getLastBlock().getKey(),
// 		anchorOffset: editorContent.getLastBlock().getText().length,
// 		focusKey: editorContent.getLastBlock().getKey(),
// 		focusOffset: editorContent.getLastBlock().getText().length,
// 	});
// 	const updatedEditorState = EditorState.forceSelection(editorState, updatedSelection);
// 	setEditorState(updatedEditorState);
// }, [editorState]);

// useEffect(() => {
// 	if (content.length === 0) {
// 		setShowPlaceHolder(true);
// 	} else setShowPlaceHolder(false);

// 	if (content.length >= 1) {
// 		moveSelectionToEnd();
// 	}
// }, [clearEditor, content]);

// // useEffect(() => {
// // 	const editorElement = document.querySelectorAll('[data-offset-key]');
// // 	editorElement[2].classList.add('break-all');
// // }, []);

// // please no delete
// const editorDiv = document.getElementById('editor');
// const editorHeight = editorDiv?.clientHeight;
// document.documentElement.style.setProperty('--editor-height', (editorHeight && editorHeight - 10) + 'px');
// document.documentElement.style.setProperty('--bottom-emoji', (editorHeight && editorHeight + 25) + 'px');
// //

// const editorElement = document.getElementById('editor');
// useEffect(() => {
// 	const hasFigure = editorElement?.querySelector('figure');
// 	const firstChildHasBr = editorElement?.querySelector('br');
// 	if (hasFigure) {
// 		if (firstChildHasBr) {
// 			firstChildHasBr.style.display = 'none';
// 		}
// 	}
// }, [editorState]);

// const emojiListRef = useRef<HTMLDivElement>(null);
// const {
// 	isEmojiListShowed,
// 	emojiPicked,
// 	isFocusEditor,
// 	setIsEmojiListShowed,
// 	setEmojiSuggestion,
// 	textToSearchEmojiSuggestion,
// 	setTextToSearchEmojiSuggesion,
// 	setIsFocusEditorStatus,
// } = useEmojiSuggestion();

// useEffect(() => {
// 	clickEmojiSuggestion();
// }, [emojiPicked]);

// useEffect(() => {
// 	if (content) {
// 		setTextToSearchEmojiSuggesion(content);
// 	}
// }, [content]);

// // useEffect(() => {
// // 	if (isEmojiListShowed) {
// // 		emojiListRef.current && emojiListRef.current.focus();
// // 	} else {
// // 		onFocusEditorState();
// // 	}
// // }, [isEmojiListShowed, textToSearchEmojiSuggestion]);

// const clearSuggestionEmojiAfterSendMessage = () => {
// 	setIsEmojiListShowed(false);
// 	setEmojiSuggestion('');
// 	setTextToSearchEmojiSuggesion('');
// 	setIsFocusEditorStatus(false);
// 	setEditorState(() => EditorState.createEmpty());
// };

// // useEffect(() => {
// // 	if (isFocusEditor) {
// // 		onFocusEditorState();
// // 	}
// // }, [isFocusEditor]);

// function clickEmojiSuggestion() {
// 	if (!emojiPicked) {
// 		return;
// 	}
// 	const currentContentState = editorState.getCurrentContent();
// 	const selectionState = editorState.getSelection();
// 	const contentText = currentContentState.getPlainText();
// 	const syntaxEmoji = findSyntaxEmoji(contentText) ?? '';
// 	const updatedContentText = contentText.replace(syntaxEmoji, emojiPicked);
// 	const newContentState = ContentState.createFromText(updatedContentText);
// 	let newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
// 	const updatedEditorState = EditorState.forceSelection(newEditorState, selectionState);
// 	setEditorState(updatedEditorState);
// 	// onFocusEditorState();
// }

// function findSyntaxEmoji(contentText: string): string | null {
// 	const regexEmoji = /:[^\s]+(?=$|[\p{Emoji}])/gu;
// 	const emojiArray = Array.from(contentText.matchAll(regexEmoji), (match) => match[0]);
// 	if (emojiArray.length > 0) {
// 		return emojiArray[0];
// 	}
// 	return null;
// }
