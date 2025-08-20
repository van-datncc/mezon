import { useEmojiSuggestionContext, useGifsStickersEmoji, useReference } from '@mezon/core';
import {
  ChannelsEntity,
  channelMembersActions,
  emojiSuggestionActions,
  getStore,
  quickMenuActions,
  referencesActions,
  selectAddEmojiState,
  selectAllAccount,
  selectAllChannels,
  selectAllHashtagDm,
  selectAllRolesClan,
  selectAnonymousMode,
  selectAttachmentByChannelId,
  selectCloseMenu,
  selectCurrentTopicId,
  selectDataReferences,
  selectEmojiObjSuggestion,
  selectHasKeyE2ee,
  selectIdMessageRefEdit,
  selectOpenEditMessageState,
  selectOpenThreadMessageState,
  selectQuickMenuByChannelId,
  selectReactionRightState,
  selectStatusMenu,
  selectTheme,
  threadsActions,
  useAppDispatch,
  useAppSelector
} from '@mezon/store';
import {
  CHANNEL_INPUT_ID,
  CREATING_TOPIC,
  ChannelMembersEntity,
  EBacktickType,
  GENERAL_INPUT_ID,
  IEmojiOnMessage,
  IHashtagOnMessage,
  ILongPressType,
  IMarkdownOnMessage,
  IMentionOnMessage,
  IMessageWithUser,
  MIN_THRESHOLD_CHARS,
  MentionReactInputProps,
  QUICK_MENU_TYPE,
  RequestInput,
  SubPanelName,
  TITLE_MENTION_HERE,
  ThreadStatus,
  addMention,
  adjustPos,
  blankReferenceObj,
  checkIsThread,
  convertMentionOnfile,
  extractCanvasIdsFromText,
  filterEmptyArrays,
  filterMentionsWithAtSign,
  formatMentionsToString,
  getDisplayMention,
  parseHtmlAsFormattedText,
  processBoldEntities,
  processMarkdownEntities,
  searchMentionsHashtag,
  threadError,
  updateMentionPositions
} from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { ReactElement, RefObject, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MentionItem } from 'react-mentions';
import { useSelector } from 'react-redux';
import Mention from './Mention';
import MentionsInput, { type FormattedText, type MentionsInputHandle } from './MentionsInput';
import { ChatBoxToolbarWrapper } from './components';
import {
	useClickUpToEditMessage,
	useEmojiPicker,
	useFocusEditor,
	useFocusManager
} from './hooks';
import processMention from './processMention';
import { getCanvasTitles } from './utils/canvas';

const slashCommands = [
	{
		id: 'ephemeral',
		display: 'ephemeral',
		description: 'Send an ephemeral message (only visible to selected user)'
	}
];


/**
 * Custom hook to search and filter emojis based on user input
 */

// update type later
export interface MentionReactBaseProps extends MentionReactInputProps {
	mentionWidth: string;
	handleSearchHashtag?: (search: string, callback: (data: any) => void) => void;
	addMemberToThread?: (channel: ChannelsEntity, users: string[]) => void;
	joinningToThread?: (channel: ChannelsEntity, users: string[]) => void;
	threadCurrentChannel?: ChannelsEntity;
	currentChannel?: ChannelsEntity;
	setOpenThreadMessageState?: (state: boolean) => void;
	checkAttachment?: boolean;
	draftRequest?: RequestInput | null;
	updateDraft?: any;
	openThreadMessageState?: boolean;
	isShowCreateThread?: boolean;
	nameValueThread: string;
	valueThread?: IMessageWithUser | null;
	isPrivate: number;
	membersOfChild?: ChannelMembersEntity[] | null;
	membersOfParent?: ChannelMembersEntity[] | null;
	dataReferences?: ApiMessageRef;
	dataReferencesTopic?: ApiMessageRef;
	currentDmGroupId?: string;
}

type ChannelsMentionProps = {
	id: string;
	display: string;
	subText: string;
};

export const MentionReactBase = memo((props: MentionReactBaseProps): ReactElement => {
	const editorRef = useRef<MentionsInputHandle | null>(null);
	const editorElementRef = useRef<HTMLDivElement | null>(null); // For legacy hooks compatibility
	const containerRef = useRef<HTMLDivElement | null>(null);
	const {
		currentChannel,
		addMemberToThread,
		joinningToThread,
		threadCurrentChannel,
		isPrivate,
		nameValueThread,
		valueThread,
		draftRequest,
		updateDraft
	} = props;

	const dispatch = useAppDispatch();
	const openThreadMessageState = useSelector(selectOpenThreadMessageState);
	const anonymousMode = useSelector(selectAnonymousMode);
	const [mentionEveryone, setMentionEveryone] = useState(false);
	const addEmojiState = useSelector(selectAddEmojiState);
	const emojiPicked = useSelector(selectEmojiObjSuggestion);
	// const { queryEmojis } = useEmojiQuery();

	const { emojis } = useEmojiSuggestionContext();

	const [isEphemeralMode, setIsEphemeralMode] = useState(false);
	const [ephemeralTargetUserId, setEphemeralTargetUserId] = useState<string | null>(null);
	const [ephemeralTargetUserDisplay, setEphemeralTargetUserDisplay] = useState<string | null>(null);

	const reactionRightState = useSelector(selectReactionRightState);
	const isNotChannel = props.isThread || props.isTopic;
	const inputElementId = isNotChannel ? GENERAL_INPUT_ID : CHANNEL_INPUT_ID;
	const isShowEmojiPicker = !props.isThread;

	const currTopicId = useSelector(selectCurrentTopicId);
	const dataReferences = useAppSelector((state) => selectDataReferences(state, props.currentChannelId ?? ''));
	const dataReferencesTopic = useAppSelector((state) => selectDataReferences(state, currTopicId ?? ''));

	const scopeId = props.isTopic ? currTopicId || CREATING_TOPIC : props.currentChannelId!;

	const attachmentFiltered = useAppSelector((state) => selectAttachmentByChannelId(state, scopeId || ''));

	const isDm = props.mode === ChannelStreamMode.STREAM_MODE_DM;

	const appearanceTheme = useSelector(selectTheme);
	const userProfile = useSelector(selectAllAccount);
	const idMessageRefEdit = useSelector(selectIdMessageRefEdit);
	const { setOpenThreadMessageState, checkAttachment } = useReference(scopeId || '');
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const [valueHighlight, setValueHightlight] = useState<string>('');
	const [titleModalMention, setTitleModalMention] = useState('');
	const [displayPlaintext, setDisplayPlaintext] = useState<string>('');
	const [displayMarkup, setDisplayMarkup] = useState<string>('');
	const [mentionUpdated, setMentionUpdated] = useState<IMentionOnMessage[]>([]);
	const [isPasteMulti, setIsPasteMulti] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState(false);



	useEffect(() => {
		if (editorRef.current) {
			editorElementRef.current = editorRef.current.getElement();
		}
	}, [editorRef.current]);

	const { focusEditorIfMatch } = useFocusEditor({
		editorRef: editorElementRef,
		isTopic: props.isTopic
	});

	const { setSubPanelActive } = useGifsStickersEmoji();

	useFocusManager({
		editorRef: editorElementRef as RefObject<HTMLDivElement>,
		isTopic: props.isTopic || false,
		isMenuClosed: useSelector(selectCloseMenu),
		isStatusMenuOpen: useSelector(selectStatusMenu),
		messageRefId: dataReferences.message_ref_id,
		isEmojiPickerActive: !!emojiPicked?.shortName,
		isReactionRightActive: reactionRightState,
		isEditMessageOpen: useSelector(selectOpenEditMessageState),
		editMessageId: idMessageRefEdit,
		currentChannelId: props.currentChannelId,
		currentDmGroupId: props.currentDmGroupId,
		hasAttachments: attachmentFiltered?.files?.length > 0
	});



	const handleSendWithFormattedText = useCallback(
		(formattedText: FormattedText, anonymousMessage?: boolean) => {
			const checkedRequest: RequestInput = {
				content: formattedText.text,
				valueTextInput: formattedText.text,
				mentionRaw: [],
				entities: formattedText.entities || []
			};

			return handleSendInternal(checkedRequest, anonymousMessage);
		},
		[
			props,
			nameValueThread,
			threadCurrentChannel,
			dataReferences,
			dispatch,
			isPrivate,
			mentionEveryone,
			addMemberToThread,
			currentChannel,
			setOpenThreadMessageState,
			updateDraft,
			setSubPanelActive
		]
	);

	const handleSend = useCallback(
		(anonymousMessage?: boolean) => {
			const emptyRequest: RequestInput = {
				content: '',
				valueTextInput: '',
				mentionRaw: [],
				entities: []
			};
			const checkedRequest = draftRequest ? draftRequest : emptyRequest;

			return handleSendInternal(checkedRequest, anonymousMessage);
		},
		[
			draftRequest,
			props,
			nameValueThread,
			threadCurrentChannel,
			dataReferences,
			dispatch,
			isPrivate,
			mentionEveryone,
			addMemberToThread,
			currentChannel,
			setOpenThreadMessageState,
			updateDraft,
			setSubPanelActive
		]
	);

	const processEntitiesDirectly = useCallback((entities: any[], content: string, rolesClan: any[]) => {
		const mentions: IMentionOnMessage[] = [];
		const hashtags: IHashtagOnMessage[] = [];
		const emojis: IEmojiOnMessage[] = [];
		const markdown: IMarkdownOnMessage[] = [];


		entities.forEach((entity: any) => {
			const { type, offset, length, userId, documentId, language } = entity;
			const s = offset;
			const e = offset + length;
			const display = content.substring(offset, offset + length);

			switch (type) {
				case 'MessageEntityMentionName':
					if (userId) {
						const isRole = rolesClan.some((role) => role.roleId === userId);
						mentions.push({
							role_id: isRole ? userId : undefined,
							user_id: !isRole ? userId : undefined,
							s,
							e,
							display
						});
					}
					break;

				case 'MessageEntityHashtag':
					hashtags.push({
						s,
						e,
						channelid: display.replace('#', '')
					});
					break;

				case 'MessageEntityCustomEmoji':
					if (documentId) {
						emojis.push({
							s,
							e,
							emojiid: documentId
						});
					}
					break;

				case 'MessageEntityBold':
					markdown.push({ s, e, type: EBacktickType.BOLD });
					break;

				case 'MessageEntityItalic':
					markdown.push({ s, e, type: EBacktickType.SINGLE });
					break;

				case 'MessageEntityUnderline':
					markdown.push({ s, e, type: EBacktickType.CODE });
					break;

				case 'MessageEntityStrike':
					markdown.push({ s, e, type: EBacktickType.SINGLE });
					break;

				case 'MessageEntityCode':
					markdown.push({ s, e, type: EBacktickType.CODE });
					break;

				case 'MessageEntityPre':
					markdown.push({
						s,
						e,
						type: EBacktickType.PRE
					});
					break;

				case 'MessageEntitySpoiler':
					markdown.push({ s, e, type: EBacktickType.SINGLE });
					break;

				case 'MessageEntityBlockquote':
					markdown.push({ s, e, type: EBacktickType.SINGLE });
					break;

				case 'MessageEntityTextUrl':
					markdown.push({
						s,
						e,
						type: EBacktickType.LINK
					});
					break;

				case 'MessageEntityUrl':
					markdown.push({
						s,
						e,
						type: EBacktickType.LINK
					});
					break;


				default:
					break;
			}
		});


		return { mentions, hashtags, emojis, markdown };
	}, []);

	const handleSendInternal = useCallback(
		(checkedRequest: RequestInput, anonymousMessage?: boolean) => {
			//TODO: break logic send width thread box, channel, topic box, dm
			if (props.isThread && !nameValueThread?.trim() && !props.isTopic && !threadCurrentChannel) {
				dispatch(threadsActions.setNameThreadError(threadError.name));
				return;
			}

			const store = getStore();
			const rolesClan = selectAllRolesClan(store.getState());

			if (checkedRequest.entities && checkedRequest.entities.length > 0) {

				const { mentions: mentionList, hashtags: hashtagList, emojis: emojiList, markdown: markdownList } =
					processEntitiesDirectly(checkedRequest.entities, checkedRequest.content, rolesClan);

				let usersNotExistingInThread: string[] = [];
				if (props.membersOfChild && props.membersOfParent) {
					mentionList.forEach(mention => {
						if (mention.user_id) {
							const existsInChild = props.membersOfChild?.some(member => member.user?.id === mention.user_id);
							const existsInParent = props.membersOfParent?.some(member => member.user?.id === mention.user_id);

							if (!existsInChild && existsInParent) {
								usersNotExistingInThread.push(mention.user_id);
							}
						}
					});
				}

				const text = checkedRequest.content;
				const hasToken = mentionList.length > 0 || hashtagList.length > 0 || emojiList.length > 0;

				const payload: {
					t: string;
					hg: IHashtagOnMessage[];
					ej: IEmojiOnMessage[];
					mk: IMarkdownOnMessage[];
					cvtt?: Record<string, string>;
				} = {
					t: text,
					hg: hashtagList as IHashtagOnMessage[],
					ej: emojiList as IEmojiOnMessage[],
					mk: markdownList
				};

				const canvasLinks = extractCanvasIdsFromText(text || '');
				const canvasTitles = getCanvasTitles(canvasLinks);
				if (Object.keys(canvasTitles).length > 0) {
					payload.cvtt = canvasTitles;
				}

				const addMentionToPayload = addMention(payload, mentionList);
				const removeEmptyOnPayload = filterEmptyArrays(addMentionToPayload);

				const encoder = new TextEncoder();
				const payloadJson = JSON.stringify(removeEmptyOnPayload);
				const utf8Bytes = encoder.encode(payloadJson);

				if (utf8Bytes.length > MIN_THRESHOLD_CHARS && props.handleConvertToFile) {
					setIsPasteMulti(true);
					props.handleConvertToFile(payload.t ?? '');
					updateDraft({
						valueTextInput: '',
						content: '',
						mentionRaw: [],
						entities: []
					});
					return;
				}

				const attachmentData = attachmentFiltered?.files || [];

				if (checkIsThread(currentChannel as ChannelsEntity) && usersNotExistingInThread.length > 0 && addMemberToThread) {
					addMemberToThread(currentChannel!, usersNotExistingInThread);
				}

				if (checkIsThread(currentChannel as ChannelsEntity) && currentChannel?.active === ThreadStatus.activePublic && joinningToThread) {
					dispatch(threadsActions.updateActiveCodeThread({ channelId: currentChannel.channel_id ?? '', activeCode: ThreadStatus.joined }));
					joinningToThread(currentChannel, [userProfile?.user?.id ?? '']);
				}

				// Send the message with optimized payload
				if (isReplyOnChannel) {
					props.onSend(
						filterEmptyArrays(payload),
						mentionList,
						attachmentData,
						[dataReferences],
						{ nameValueThread, isPrivate },
						anonymousMessage,
						mentionEveryone,
						undefined,
						undefined,
						ephemeralTargetUserId || undefined
					);
					setMentionEveryone(false);
					dispatch(referencesActions.resetAfterReply(props.currentChannelId ?? ''));
				} else if (isSendMessageOnThreadBox) {
					props.onSend(
						{ t: valueThread?.content.t || '' },
						valueThread?.mentions,
						valueThread?.attachments,
						valueThread?.references,
						{ nameValueThread: nameValueThread ?? valueThread?.content.t, isPrivate },
						anonymousMessage,
						mentionEveryone,
						undefined,
						undefined,
						ephemeralTargetUserId || undefined
					);
				} else if (isReplyOnTopic) {
					props.onSend(
						filterEmptyArrays(payload),
						mentionList,
						attachmentData,
						[dataReferencesTopic],
						{ nameValueThread, isPrivate },
						anonymousMessage,
						mentionEveryone,
						undefined,
						undefined,
						ephemeralTargetUserId || undefined
					);
					setMentionEveryone(false);
					dispatch(referencesActions.setDataReferences({
						channelId: currTopicId ?? '',
						dataReferences: blankReferenceObj
					}));
				} else {
					props.onSend(
						filterEmptyArrays(payload),
						mentionList,
						attachmentData,
						undefined,
						{ nameValueThread, isPrivate },
						anonymousMessage,
						mentionEveryone,
						undefined,
						undefined,
						ephemeralTargetUserId || undefined
					);
					setMentionEveryone(false);
				}

				updateDraft({
					valueTextInput: '',
					content: '',
					mentionRaw: [],
					entities: []
				});

				dispatch(emojiSuggestionActions.setSuggestionEmojiObjPicked({
					shortName: '',
					id: '',
					isReset: true
				}));

				dispatch(referencesActions.setAtachmentAfterUpload({
					channelId: props.currentChannelId ?? '',
					files: []
				}));

				setMentionUpdated([]);
				setDisplayPlaintext('');
				setDisplayMarkup('');
				setIsPasteMulti(false);
				setSubPanelActive(SubPanelName.NONE);

				if (ephemeralTargetUserId) {
					setEphemeralTargetUserId(null);
					setEphemeralTargetUserDisplay(null);
				}

				return;
			}

			const mentionsFromEntities = (checkedRequest.entities || [])
				.filter((entity: any) => entity.type === 'MessageEntityMentionName')
				.map((entity: any) => {
					const mentionText = checkedRequest.content.substring(entity.offset, entity.offset + entity.length);
					return {
						id: entity.userId || '',
						display: mentionText,
						plainTextIndex: entity.offset,
						index: entity.offset,
						childIndex: 0,
						length: entity.length
					};
				});

			const mentionsToProcess = mentionsFromEntities.length > 0 ? mentionsFromEntities : (checkedRequest?.mentionRaw || []);

			const { mentionList, hashtagList, emojiList, usersNotExistingInThread } = processMention(
				mentionsToProcess,
				rolesClan,
				props.membersOfChild as ChannelMembersEntity[],
				props.membersOfParent as ChannelMembersEntity[],
				dataReferences?.message_sender_id || ''
			);

			const hasToken = mentionList.length > 0 || hashtagList.length > 0 || emojiList.length > 0; // no remove trim() if message has token


			const { content: text, entities } = checkedRequest;
			const mk: IMarkdownOnMessage[] = processMarkdownEntities(text, entities);

			const boldMarkdownArr = processBoldEntities(mentionsToProcess, mk);

			const { adjustedMentionsPos, adjustedHashtagPos, adjustedEmojiPos } = adjustPos(mk, mentionList, hashtagList, emojiList, text);
			const payload: {
				t: string;
				hg: IHashtagOnMessage[];
				ej: IEmojiOnMessage[];
				mk: IMarkdownOnMessage[];
				cvtt?: Record<string, string>;
			} = {
				t: text,
				hg: adjustedHashtagPos as IHashtagOnMessage[],
				ej: adjustedEmojiPos as IEmojiOnMessage[],
				mk: [...mk, ...boldMarkdownArr]
			};

			const canvasLinks = extractCanvasIdsFromText(text || '');
			const canvasTitles = getCanvasTitles(canvasLinks);
			if (Object.keys(canvasTitles).length > 0) {
				payload.cvtt = canvasTitles;
			}

			const addMentionToPayload = addMention(payload, adjustedMentionsPos);
			const removeEmptyOnPayload = filterEmptyArrays(addMentionToPayload);
			const encoder = new TextEncoder();
			const payloadJson = JSON.stringify(removeEmptyOnPayload);
			const utf8Bytes = encoder.encode(payloadJson);

			if (utf8Bytes.length > MIN_THRESHOLD_CHARS && props.handleConvertToFile) {
				setIsPasteMulti(true);
				props.handleConvertToFile(payload.t ?? '');
				updateDraft({
					valueTextInput: displayMarkup,
					content: displayPlaintext,
					mentionRaw: [],
					entities: []
				});

				return;
			}

			if ((!text && !checkAttachment) || ((draftRequest?.valueTextInput || '').trim() === '' && !checkAttachment)) {
				return;
			}
			if (props.isTopic && !text && checkAttachment) {
				payload.t = '';
			}
			if (
				draftRequest?.valueTextInput &&
				typeof draftRequest?.valueTextInput === 'string' &&
				!(draftRequest?.valueTextInput || '').trim() &&
				!checkAttachment &&
				mentionData?.length === 0
			) {
				if (!nameValueThread?.trim() && props.isThread && !threadCurrentChannel) {
					dispatch(threadsActions.setMessageThreadError(threadError.message));
					dispatch(threadsActions.setNameThreadError(threadError.name));
					return;
				}
				if (props.isThread && !threadCurrentChannel) {
					dispatch(threadsActions.setMessageThreadError(threadError.message));
				}
				return;
			}
			if (!nameValueThread?.trim() && props.isThread && !props.isTopic && !threadCurrentChannel && !openThreadMessageState) {
				dispatch(threadsActions.setNameThreadError(threadError.name));
				return;
			}
			if (checkIsThread(currentChannel as ChannelsEntity) && usersNotExistingInThread.length > 0 && addMemberToThread) {
				addMemberToThread(currentChannel!, usersNotExistingInThread);
			}

			if (checkIsThread(currentChannel as ChannelsEntity) && currentChannel?.active === ThreadStatus.activePublic && joinningToThread) {
				dispatch(threadsActions.updateActiveCodeThread({ channelId: currentChannel.channel_id ?? '', activeCode: ThreadStatus.joined }));
				joinningToThread(currentChannel, [userProfile?.user?.id ?? '']);
			}

			if (isReplyOnChannel) {
				props.onSend(
					filterEmptyArrays(payload),
					isPasteMulti ? mentionUpdated : adjustedMentionsPos,
					attachmentData,
					[dataReferences],
					{ nameValueThread, isPrivate },
					anonymousMessage,
					mentionEveryone,
					undefined,
					undefined,
					ephemeralTargetUserId || undefined
				);

				setMentionEveryone(false);
				dispatch(referencesActions.resetAfterReply(props.currentChannelId ?? ''));
				dispatch(threadsActions.setNameValueThread({ channelId: props.currentChannelId as string, nameValue: '' }));
				setMentionData([]);
				dispatch(threadsActions.setIsPrivate(0));
			} else if (isSendMessageOnThreadBox) {
				props.onSend(
					{ t: valueThread?.content.t || '' },
					valueThread?.mentions,
					valueThread?.attachments,
					valueThread?.references,
					{ nameValueThread: nameValueThread ?? valueThread?.content.t, isPrivate },
					anonymousMessage,
					mentionEveryone,
					undefined,
					undefined,
					ephemeralTargetUserId || undefined
				);
				dispatch(
					referencesActions.setAtachmentAfterUpload({
						channelId: props.currentChannelId ?? '',
						files: []
					})
				);
				updateDraft({
					valueTextInput: '',
					content: '',
					mentionRaw: [],
					entities: []
				});
				setOpenThreadMessageState(false);
			} else if (isReplyOnTopic) {
				props.onSend(
					filterEmptyArrays(payload),
					adjustedMentionsPos,
					attachmentData,
					[dataReferencesTopic],
					{ nameValueThread, isPrivate },
					anonymousMessage,
					mentionEveryone,
					undefined,
					undefined,
					ephemeralTargetUserId || undefined
				);
				setMentionEveryone(false);
				dispatch(
					referencesActions.setDataReferences({
						channelId: currTopicId ?? '',
						dataReferences: blankReferenceObj
					})
				);
				dispatch(threadsActions.setNameValueThread({ channelId: currTopicId as string, nameValue: '' }));
				setMentionData([]);
				dispatch(threadsActions.setIsPrivate(0));
			} else {
				props.onSend(
					filterEmptyArrays(payload),
					isPasteMulti ? mentionUpdated : adjustedMentionsPos,
					attachmentData,
					undefined,
					{ nameValueThread, isPrivate },
					anonymousMessage,
					mentionEveryone,
					undefined,
					undefined,
					ephemeralTargetUserId || undefined
				);
				setMentionEveryone(false);
				dispatch(threadsActions.setNameValueThread({ channelId: props.currentChannelId as string, nameValue: '' }));
				setMentionData([]);
				dispatch(threadsActions.setIsPrivate(0));
			}

			if (ephemeralTargetUserId) {
				setEphemeralTargetUserId(null);
				setEphemeralTargetUserDisplay(null);
			}

			updateDraft({
				valueTextInput: '',
				content: '',
				mentionRaw: [],
				entities: []
			});

			dispatch(
				emojiSuggestionActions.setSuggestionEmojiObjPicked({
					shortName: '',
					id: '',
					isReset: true
				})
			);
			dispatch(
				referencesActions.setAtachmentAfterUpload({
					channelId: props.currentChannelId ?? '',
					files: []
				})
			);
			setMentionUpdated([]);
			setDisplayPlaintext('');
			setDisplayPlaintext('');
			setIsPasteMulti(false);
			setSubPanelActive(SubPanelName.NONE);
		},
		[
			mentionData,
			nameValueThread,
			props,
			threadCurrentChannel,
			openThreadMessageState,
			dataReferences,
			dispatch,
			isPrivate,
			mentionEveryone,
			addMemberToThread,
			currentChannel,
			setOpenThreadMessageState,
			updateDraft,
			setSubPanelActive
		]
	);

	// const { onKeyDown } = useKeyboardHandler({
	// 	editorRef: editorElementRef as RefObject<HTMLDivElement>,
	// 	draftRequest,
	// 	updateDraft,
	// 	handleUndoRedoShortcut,
	// 	handleSend,
	// 	anonymousMode,
	// 	isEphemeralMode,
	// 	setIsEphemeralMode,
	// 	setEphemeralTargetUserId,
	// 	setEphemeralTargetUserDisplay,
	// 	ephemeralTargetUserId
	// });

	const closeMenu = useSelector(selectCloseMenu);

	const attachmentData = useMemo(() => {
		if (!attachmentFiltered) {
			return [];
		} else {
			return attachmentFiltered.files;
		}
	}, [attachmentFiltered?.files]);

	const isReplyOnChannel = dataReferences.message_ref_id && !props.isTopic ? true : false;
	const isReplyOnTopic = dataReferencesTopic.message_ref_id && props.isTopic ? true : false;
	const isSendMessageOnThreadBox = openThreadMessageState && !props.isTopic ? true : false;

	const [pastedContent, setPastedContent] = useState<string>('');
	const prevValueRef = useRef('');
	const prevPlainTextRef = useRef('');

	useEffect(() => {
		if (draftRequest?.valueTextInput !== undefined) {
			prevValueRef.current = draftRequest.valueTextInput;
		}
	}, [draftRequest?.valueTextInput]);

	useEffect(() => {
		if (draftRequest?.content !== undefined) {
			prevPlainTextRef.current = draftRequest.content;
		}
	}, [draftRequest?.content]);

	const onChangeMentionInput = (html: string) => {
		const { text: newPlainTextValue, entities } = parseHtmlAsFormattedText(html);
		const newValue = html;
		const mentions: MentionItem[] = [];
		const previousValue = prevValueRef.current;
		const previousPlainText = prevPlainTextRef.current;
		const newMentions = updateMentionPositions(mentions, newValue, newPlainTextValue);

		dispatch(threadsActions.setMessageThreadError(''));

		const store = getStore();

		if (newPlainTextValue.startsWith('/ephemeral ')) {
			const command = newPlainTextValue.substring(11).trim();
			if (command) {
				const matchedUser = props.listMentions?.find(
					(user) =>
						user.display?.toLowerCase().includes(command.toLowerCase()) || user.username?.toLowerCase().includes(command.toLowerCase())
				);
				if (matchedUser) {
					setEphemeralTargetUserId(String(matchedUser.id));
					setEphemeralTargetUserDisplay(matchedUser.display || matchedUser.username || '');
					updateDraft({
						valueTextInput: '',
						content: '',
						mentionRaw: [],
						entities: []
					});
					return;
				}
			}
		}

		if (isEphemeralMode && newMentions.length > 0) {
			const selectedUser = newMentions[0];
			if (selectedUser) {
				setEphemeralTargetUserId(String(selectedUser.id));
				setEphemeralTargetUserDisplay(selectedUser.display || '');
				setIsEphemeralMode(false);
				updateDraft({
					valueTextInput: '',
					content: '',
					mentionRaw: [],
					entities: []
				});
				return;
			}
		}

		updateDraft({
			valueTextInput: newValue,
			content: newPlainTextValue,
			mentionRaw: newMentions || [],
			entities: entities || []
		});

		if (newMentions?.some((mention) => mention.display === TITLE_MENTION_HERE)) {
			setMentionEveryone(true);
		} else {
			setMentionEveryone(false);
		}
		if (typeof props.onTyping === 'function') {
			props.onTyping();
		}
		const onlyMention = filterMentionsWithAtSign(newMentions);
		const convertToMarkUpString = formatMentionsToString(onlyMention);
		const convertToPlainTextString = getDisplayMention(onlyMention);
		const rolesClan = selectAllRolesClan(store.getState());

		const mentionUpdated = convertMentionOnfile(rolesClan, convertToPlainTextString, onlyMention as MentionItem[]);
		setDisplayPlaintext(convertToPlainTextString);
		setDisplayMarkup(convertToMarkUpString);
		setMentionUpdated(mentionUpdated);

		if (!isPasteMulti) {
			setDisplayPlaintext(convertToPlainTextString);
			setDisplayMarkup(convertToMarkUpString);
			setMentionUpdated(mentionUpdated);
		} else {
			setDisplayPlaintext(newPlainTextValue);
			setDisplayMarkup(newValue);
			const { mentionList } = processMention(
				[...(draftRequest?.mentionRaw || [])],
				rolesClan,
				props.membersOfChild as ChannelMembersEntity[],
				props.membersOfParent as ChannelMembersEntity[],
				''
			);

			setMentionUpdated(mentionList);
			updateDraft({
				valueTextInput: newValue,
				content: newPlainTextValue,
				mentionRaw: newMentions || [],
				entities: entities || []
			});
			setIsPasteMulti(false);
		}

		if (
			props.handleConvertToFile !== undefined &&
			newPlainTextValue?.length > MIN_THRESHOLD_CHARS &&
			pastedContent?.length > MIN_THRESHOLD_CHARS
		) {
			props.handleConvertToFile(pastedContent);
			updateDraft({
				valueTextInput: previousValue || '',
				content: previousPlainText || '',
				mentionRaw: draftRequest?.mentionRaw || [],
				entities: draftRequest?.entities || []
			});
			setPastedContent('');
		}

		if (newPlainTextValue.endsWith('@')) {
			setTitleModalMention('Members');
		} else if (newPlainTextValue.endsWith('#')) {
			setTitleModalMention('Text channels');
		} else if (newPlainTextValue.endsWith(':')) {
			setTitleModalMention('Emoji matching');
		} else if (newPlainTextValue.endsWith('/')) {
			setTitleModalMention('Commands');
		}
	};

	const { insertEmojiDirectly } = useEmojiPicker({
		editorRef,
		emojiPicked,
		addEmojiState,
		dispatch,
		focusEditorIfMatch: (element: HTMLElement | null, targetInputId?: string) => {
			editorRef.current?.focus();
		},
		onDirectEmojiInsert: (emojiId, emojiShortname) => {
		}
	});

	const handleSearchUserMention = useCallback(
		(search: string, callback: any) => {
			if (!props.listMentions?.length && props.currentClanId && props.currentClanId !== '0') {
				dispatch(
					channelMembersActions.fetchChannelMembers({
						clanId: props.currentClanId as string,
						channelId: props.currentChannelId as string,
						channelType: ChannelType.CHANNEL_TYPE_CHANNEL
					})
				);
			}

			setValueHightlight(search);
			callback(
				searchMentionsHashtag(
					search,
					!isEphemeralMode ? props.listMentions || [] : props.listMentions?.filter((item) => item.display !== TITLE_MENTION_HERE) || []
				)
			);
		},
		[props.listMentions, isEphemeralMode]
	);

	const handleSearchHashtag = useCallback(
		(search: string, callback: any) => {
			setValueHightlight(search);
			const store = getStore();
			if (isDm) {
				const commonChannelDms = selectAllHashtagDm(store.getState());
				const mentions = commonChannelDms
					.map((item) => ({
						id: item?.channel_id ?? '',
						display: item?.channel_label ?? '',
						subText: item?.clan_name ?? ''
					}))
					.filter((mention) => mention.id || mention.display || mention.subText) as ChannelsMentionProps[];

				callback(searchMentionsHashtag(search, mentions ?? []));
			} else {
				const channels = selectAllChannels(store.getState());

				const listChannelsMention = channels
					.map((item) => ({
						id: item?.channel_id ?? '',
						display: item?.channel_label ?? '',
						subText: item?.category_name ?? ''
					}))
					.filter((mention) => mention.id || mention.display || mention.subText) as ChannelsMentionProps[];
				callback(searchMentionsHashtag(search, listChannelsMention ?? []));
			}
		},
		[isDm]
	);

	const generateCommandsList = useCallback(
		(search: string) => {
			const store = getStore();
			const channelQuickMenuItems = selectQuickMenuByChannelId(store.getState(), props.currentChannelId || '');
			const builtInCommands = slashCommands.filter((cmd) => cmd.display.toLowerCase().includes(search.toLowerCase()));

			const quickMenuCommands = channelQuickMenuItems
				.filter((item) => item.menu_name?.toLowerCase().includes(search.toLowerCase()) && item.menu_type === QUICK_MENU_TYPE.FLASH_MESSAGE)
				.map((item) => ({
					id: `quick_menu_${item.id}`,
					display: item.menu_name || '',
					description: item.action_msg || '',
					action_msg: item.action_msg || ''
				}));

			return [...builtInCommands, ...quickMenuCommands];
		},
		[props.currentChannelId]
	);

	const handleSearchSlashCommands = useCallback(
		async (search: string, callback: any) => {
			setValueHightlight(search);

			const store = getStore();
			const channelQuickMenuItems = selectQuickMenuByChannelId(store.getState(), props.currentChannelId || '');
			const hasExistingData = channelQuickMenuItems && channelQuickMenuItems.length > 0;

			if (hasExistingData) {
				callback(generateCommandsList(search));
				if (props.currentChannelId) {
					try {
						await dispatch(
							quickMenuActions.listQuickMenuAccess({ channelId: props.currentChannelId, menuType: QUICK_MENU_TYPE.FLASH_MESSAGE })
						);
						callback(generateCommandsList(search));
					} catch (error) {
						console.error('Error fetching fresh commands:', error);
					}
				}
			} else {
				callback([{ id: 'loading', display: 'loading', description: 'Loading commands...', isLoading: true }]);
				try {
					if (props.currentChannelId) {
						await dispatch(
							quickMenuActions.listQuickMenuAccess({ channelId: props.currentChannelId, menuType: QUICK_MENU_TYPE.FLASH_MESSAGE })
						);
					}
					callback(generateCommandsList(search));
				} catch (error) {
					console.error('Error fetching commands:', error);
					const builtInCommands = slashCommands.filter((cmd) => cmd.display.toLowerCase().includes(search.toLowerCase()));
					callback(builtInCommands);
				}
			}
		},
		[props.currentChannelId, generateCommandsList, dispatch]
	);

	const handleSlashCommandSelect = useCallback(
		(commandId: string, suggestion?: any) => {
			if (commandId === 'ephemeral') {
				setIsEphemeralMode(true);
				setTitleModalMention('Select user for ephemeral message');
				updateDraft({
					valueTextInput: '@',
					content: '@',
					mentionRaw: [],
					entities: []
				});
			} else if (commandId.startsWith('quick_menu_')) {
				const quickMenuItemId = commandId.replace('quick_menu_', '');
				const store = getStore();

				const channelQuickMenuItems = selectQuickMenuByChannelId(store.getState(), props.currentChannelId || '');

				const quickMenuItem = channelQuickMenuItems.find((item) => item.id === quickMenuItemId);

				if (quickMenuItem && quickMenuItem.action_msg) {
					updateDraft({
						valueTextInput: quickMenuItem.action_msg,
						content: quickMenuItem.action_msg,
						mentionRaw: [],
						entities: []
					});
				}
			}
		},
		[updateDraft, props.currentChannelId]
	);

	useClickUpToEditMessage({
		editorRef: editorElementRef as RefObject<HTMLDivElement>,
		currentChannelId: props.currentChannelId,
		userId: userProfile?.user?.id,
		draftRequest,
		dispatch
	});

	// const onPasteMentions = usePasteMentions({
	// 	draftRequest,
	// 	updateDraft,
	// 	editorRef: editorRef as RefObject<HTMLDivElement>,
	// 	membersOfChild: props.membersOfChild,
	// 	membersOfParent: props.membersOfParent
	// });

	const handleShowModalE2ee = useCallback((): void => {
		const store = getStore();
		const hasKeyE2ee = selectHasKeyE2ee(store.getState());
		// This function is just checking if E2EE key exists, no return needed
	}, []);

	const handleFocus = () => setIsFocused(true);
	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (!event.target.value) {
			setIsFocused(false);
		}
	};

	return (
		<div className={`contain-layout relative bg-theme-surface rounded-lg ${props?.isThread && 'border-theme-primary'}`} ref={containerRef}>
			<div className="relative">
				<span
					className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-theme-primary   pointer-events-none z-10 truncate transition-opacity duration-300 ${draftRequest?.valueTextInput ? 'hidden' : 'opacity-100'
						} sm:opacity-100 max-sm:opacity-100`}
					style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: 'calc(100% - 120px)',
						paddingRight: '8px'
					}}
				>
					{ephemeralTargetUserId ? `Ephemeral message to ${ephemeralTargetUserDisplay}...` : 'Write your thoughts here...'}
				</span>
				<MentionsInput
					id={CHANNEL_INPUT_ID}
					ref={editorRef}
					value={draftRequest?.valueTextInput ?? ''}
					onChange={onChangeMentionInput}
					placeholder={ephemeralTargetUserId ? `Ephemeral message to ${ephemeralTargetUserDisplay}...` : 'Write your thoughts here...'}
					className={`mentions min-h-11 text-theme-message rounded-lg`}
					style={{
						padding: props.isThread && !threadCurrentChannel ? '10px' : '9px 120px 9px 9px',
						border: 'none',
						maxHeight: '350px',
						overflow: 'auto',
						borderRadius: '8px'
					}}
					onSend={(formattedText: FormattedText) => {
						handleSendWithFormattedText(formattedText, anonymousMode);
					}}
					onHandlePaste={props.handlePaste}
					enableUndoRedo={true}
					maxHistorySize={50}
					hasFilesToSend={attachmentData.length > 0}
				>
					<Mention
						trigger="@"
						data={props.listMentions as any || []}
						renderSuggestion={(suggestion: any, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) => {
							return (
								<div
									className={`bg-ping-member mention-item flex items-center px-3 py-2 cursor-pointer rounded-lg ${focused ? 'bg-[var(--bg-item-hover)] text-theme-primary' : ''}`}
								>
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center">
											<div className="w-8 h-8 mr-3 flex-shrink-0">
												{suggestion.avatarUrl ? (
													<img
														src={suggestion.avatarUrl}
														alt={suggestion.username || suggestion.display}
														className="w-8 h-8 rounded-full object-cover"
													/>
												) : (
													<div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
														{(suggestion.displayName || suggestion.display || suggestion.username || '?').charAt(0).toUpperCase()}
													</div>
												)}
											</div>
											<div className="flex flex-col min-w-0">
												<span className="font-medium text-sm truncate">
													{suggestion.displayName || suggestion.display}
												</span>
											</div>
										</div>
										{suggestion.username && (
											<div className="text-xs opacity-75 ml-2 flex-shrink-0">
												{suggestion.username}
											</div>
										)}
									</div>
								</div>
							);
						}}
						markup="@[__display__](__id__)"
						displayPrefix="@"
					/>
					<Mention
						trigger="#"
						displayPrefix="#"
						data={[]}
						renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
							<div
								key={suggestion.id}
								className={`bg-ping-member mention-item tag-item ${focused ? "selected" : ""}`}
							>
								<span className="tag-icon">#</span>
								<div className="mention-item-name">{highlightedDisplay}</div>
							</div>
						)}
						markup="#[__display__](__id__)"
					/>
					<Mention
						trigger=":"
						markup="::[__display__](__id__)"
						data={emojis}
						displayTransform={(id: any, display: any) => {
							return `${display}`;
						}}
						renderSuggestion={(suggestion: any, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) => {
							return (
								<div
									className={`bg-ping-member mention-item flex items-center px-3 py-2 cursor-pointer rounded-lg ${focused ? 'bg-[var(--bg-item-hover)] text-white' : ''}`}
								>
									<div className="flex items-center w-full">
										{suggestion?.src && (
											<img
												src={suggestion.src}
												alt={suggestion.display}
												className="w-6 h-6 mr-3 flex-shrink-0"
												style={{ width: '24px', height: '24px' }}
											/>
										)}
										<div className="flex flex-col min-w-0">
											<span className="font-medium text-sm truncate">:{suggestion.display}:</span>
										</div>
									</div>
								</div>
							);
						}}
						appendSpaceOnAdd={true}
					/>
				</MentionsInput>
			</div>
			<ChatBoxToolbarWrapper
				isShowEmojiPicker={isShowEmojiPicker}
				hasPermissionEdit={props.hasPermissionEdit || true}
				voiceLongPress={props.voiceLongPress || ({} as ILongPressType)}
				isRecording={!!props.isRecording}
				mode={props.mode || ChannelStreamMode.STREAM_MODE_CHANNEL}
				isTopic={props.isTopic || false}
				onEmojiSelect={insertEmojiDirectly}
			/>
			{draftRequest?.content && draftRequest.content.length > MIN_THRESHOLD_CHARS && (
				<div className="w-16 text-red-300 bottom-0 right-0 absolute">{MIN_THRESHOLD_CHARS - draftRequest.content.length}</div>
			)}
		</div>
	);
});

MentionReactBase.displayName = 'MentionReactBase';
