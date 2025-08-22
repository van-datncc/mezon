import { useChannelMembers, useEditMessage, useEmojiSuggestionContext } from '@mezon/core';
import {
  MessagesEntity,
  pinMessageActions,
  selectAllChannels,
  selectAllHashtagDm,
  selectAllRolesClan,
  selectCurrentChannelId,
  useAppDispatch
} from '@mezon/store';
import {
  EBacktickType,
  IMarkdownOnMessage,
  RECENT_EMOJI_CATEGORY,
  addMention,
  convertMessageToHtml,
  filterEmptyArrays,
  processEntitiesDirectly,
  searchMentionsHashtag
} from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ModalDeleteMess from '../../components/DeleteMessageModal/ModalDeleteMess';
import Mention from '../../components/MessageBox/ReactionMentionInput/Mention';
import MentionsInput, { type FormattedText, type MentionsInputHandle } from '../../components/MessageBox/ReactionMentionInput/MentionsInput';
import { UserMentionList } from '../../components/UserMentionList';

type MessageInputProps = {
	messageId: string;
	channelId: string;
	mode: number;
	channelLabel: string;
	message: MessagesEntity;
	isTopic: boolean;
};

type ChannelsMentionProps = {
	id: string;
	display: string;
	subText: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ messageId, channelId, mode, channelLabel, message, isTopic }) => {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const { openEditMessageState, idMessageRefEdit, handleCancelEdit, handleSend } = useEditMessage(
		isTopic ? currentChannelId || '' : channelId,
		channelLabel,
		mode,
		message
	);
	const { emojis } = useEmojiSuggestionContext();
	const editorRef = useRef<MentionsInputHandle | null>(null);
	const mentionListData = UserMentionList({ channelID: channelId, channelMode: mode });
	const rolesClan = useSelector(selectAllRolesClan);
	const { membersOfChild, membersOfParent } = useChannelMembers({ channelId: channelId, mode: ChannelStreamMode.STREAM_MODE_CHANNEL ?? 0 });
	const [showModal, closeModal] = useModal(() => {
		return <ModalDeleteMess mess={message} closeModal={closeModal} mode={mode} />;
	}, [message?.id]);
	const dispatch = useAppDispatch();

	const queryEmojis = (query: string) => {
		if (!query || emojis.length === 0) return [];
		const q = query.toLowerCase();
		const matches: { id: string; display: string; src?: string }[] = [];

		for (const { id, shortname, category, src } of emojis) {
			if (category === RECENT_EMOJI_CATEGORY || !shortname || !shortname.includes(q)) continue;
			if (!id) continue;
			matches.push({ id, display: shortname, src });
			if (matches.length === 20) break;
		}

		return matches;
	};
	const channels = useSelector(selectAllChannels);

	const listChannelsMention = useMemo(() => {
		if (mode !== ChannelStreamMode.STREAM_MODE_GROUP && mode !== ChannelStreamMode.STREAM_MODE_DM) {
			return channels.map((item) => {
				return {
					id: item?.channel_id ?? '',
					display: item?.channel_label ?? '',
					subText: item?.category_name ?? ''
				};
			});
		} else {
			return [];
		}
	}, [mode, channels]);

	useEffect(() => {
		if (openEditMessageState && message.id === idMessageRefEdit) {
			editorRef.current?.focus();
		}
	}, [openEditMessageState, message.id, idMessageRefEdit]);



	const escapeHtmlForCodeBlocks = (text: string, markdownEntities: IMarkdownOnMessage[]): string => {
		if (!markdownEntities || markdownEntities.length === 0) return text;
		const codeBlocks = markdownEntities.filter(mk => mk.type === EBacktickType.PRE || mk.type === EBacktickType.CODE ); // Assuming type 1 = code, type 2 = pre
		if (codeBlocks.length === 0) return text;
		const sortedBlocks = [...codeBlocks].sort((a, b) => (b.s || 0) - (a.s || 0));

		let result = text;
		sortedBlocks.forEach(block => {
			const start = block.s || 0;
			const end = block.e || 0;
			const content = result.substring(start, end);
			const escapedContent = content
				.replace(/&(?!amp;|lt;|gt;|quot;|#39;|nbsp;)/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
				.replace(/  /g, '&nbsp;&nbsp;')
				.replace(/\n/g, '<br>');

			result = result.substring(0, start) + escapedContent + result.substring(end);
		});

		return result;
	};

	const initialFormattedValue = useMemo(() => {

		if (!message.content) return '';

		const extendedMessage = {
			t: message.content.t || '',
			mentions: message.mentions || [],
			hg: message.content.hg || [],
			ej: message.content.ej || [],
			mk: message.content.mk || []
		};
		const htmlContent = convertMessageToHtml(extendedMessage);
		return escapeHtmlForCodeBlocks(htmlContent, message.content.mk || []);
	}, [message.content, message.mentions]);

	const [inputValue, setInputValue] = useState(initialFormattedValue);

	useEffect(() => {
		setInputValue(initialFormattedValue);
	}, [initialFormattedValue]);

	const originalContent = useMemo(() => {
		return message.content?.t;
	}, [message.content?.t]);



	const handleSendWithFormattedText = async (formattedText: FormattedText) => {
		const { text: newPlainTextValue, entities } = formattedText;
		if (newPlainTextValue?.trim() === '') {
			showModal();
			return;
		}

		if (newPlainTextValue === originalContent) {
			handleCancelEdit();
			return;
		}

		if (entities && entities.length > 0) {
			const {
				mentions: mentionList,
				hashtags: hashtagList,
				emojis: emojiList,
				markdown: markdownList
			} = processEntitiesDirectly(entities, newPlainTextValue, rolesClan);


			const payload = {
				t: newPlainTextValue,
				hg: hashtagList,
				ej: emojiList,
				mk: markdownList,
				cid: message?.content?.cid
			};

			const addMentionToPayload = addMention(payload, mentionList);
			const removeEmptyOnPayload = filterEmptyArrays(addMentionToPayload);

			try {
				await handleSend(
					removeEmptyOnPayload,
					message.id,
					mentionList,
					isTopic ? channelId : message?.content?.tp || '',
					isTopic
				);

				dispatch(
					pinMessageActions.updatePinMessage({
						channelId: channelId,
						pinId: message.id,
						pinMessage: {
							...message,
							content: JSON.stringify(removeEmptyOnPayload)
						}
					})
				);
			} catch (error) {}
		} else {
			const payload = {
				t: newPlainTextValue,
				cid: message?.content?.cid
			};

			try {
				await handleSend(
					payload,
					message.id,
					[],
					isTopic ? channelId : message?.content?.tp || '',
					isTopic
				);

				dispatch(
					pinMessageActions.updatePinMessage({
						channelId: channelId,
						pinId: message.id,
						pinMessage: {
							...message,
							content: JSON.stringify(payload)
						}
					})
			);
			} catch (error) {}
		}

		handleCancelEdit();
	};


	const commonChannels = useSelector(selectAllHashtagDm);

	const commonChannelsMention: ChannelsMentionProps[] = useMemo(() => {
		if (mode === ChannelStreamMode.STREAM_MODE_DM) {
			return commonChannels.map((item) => {
				return {
					id: item?.channel_id ?? '',
					display: item?.channel_label ?? '',
					subText: item?.clan_name ?? ''
				};
			}) as ChannelsMentionProps[];
		}
		return [];
	}, [mode, commonChannels]);

	const handleSearchUserMention = (search: string) => {
		return searchMentionsHashtag(search, mentionListData ?? []) as any;
	};

	const handleSearchHashtag = (search: string) => {
		if (mode === ChannelStreamMode.STREAM_MODE_DM) {
			return searchMentionsHashtag(search, commonChannelsMention ?? []) as any;
		} else {
			return searchMentionsHashtag(search, listChannelsMention ?? []) as any;
		}
	};

	return (
		<div className="inputEdit w-full flex flex-col">
			<div className="w-full">
				<MentionsInput
					ref={editorRef}
					value={inputValue}
					setCaretToEnd={true}
					className={`w-full bg-theme-surface border-theme-primary rounded-lg p-[10px] text-theme-message customScrollLightMode mt-[5px]`}
					onSend={(formattedText: FormattedText) => {
						handleSendWithFormattedText(formattedText);
					}}
					onChange={(html: string) => {
						setInputValue(html);
					}}
					placeholder="Edit message..."
					style={{
						minHeight: '40px',
						maxHeight: '200px',
						overflow: 'auto'
					}}
				>
					<Mention
						trigger="@"
						title="MEMBERS"
						data={handleSearchUserMention}
						displayPrefix="@"
						markup="@[__display__](__id__)"
						appendSpaceOnAdd={true}
						renderSuggestion={(suggestion: any, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) => {
							return (
								<div
									className={`bg-ping-member mention-item flex items-center px-3 py-2 cursor-pointer rounded-lg ${
										focused ? 'bg-[var(--bg-item-hover)] text-white' : ''
									}`}
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
														{(suggestion.displayName || suggestion.display || suggestion.username || '?')
															.charAt(0)
															.toUpperCase()}
													</div>
												)}
											</div>
											<div className="flex flex-col min-w-0">
												<span className="font-medium text-sm truncate">{suggestion.displayName || suggestion.display}</span>
											</div>
										</div>
										{suggestion.username && <div className="text-xs opacity-75 ml-2 flex-shrink-0">{suggestion.username}</div>}
									</div>
								</div>
							);
						}}
					/>
					<Mention
						trigger="#"
						title="TEXT CHANNELS"
						data={handleSearchHashtag}
						displayPrefix="#"
						markup="#[__display__](__id__)"
						appendSpaceOnAdd={true}
						renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
							<div key={suggestion.id} className={`bg-ping-member mention-item flex items-center px-3 py-2 cursor-pointer rounded-lg ${
								focused ? 'bg-[var(--bg-item-hover)] text-white' : ''
							}`}>
								<span className="tag-icon">#</span>
								<div className="mention-item-name">{highlightedDisplay}</div>
							</div>
						)}
					/>
					<Mention
						trigger=":"
						title="EMOJI MATCHING"
						data={queryEmojis}
						markup="::[__display__](__id__)"
						appendSpaceOnAdd={true}
						renderSuggestion={(suggestion: any, search: string, highlightedDisplay: React.ReactNode, index: number, focused: boolean) => {
							return (
								<div
									className={`bg-ping-member mention-item flex items-center px-3 py-2 cursor-pointer rounded-lg ${
										focused ? 'bg-[var(--bg-item-hover)] text-white' : ''
									}`}
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
					/>
				</MentionsInput>
				<div className="text-xs flex text-theme-primary">
					<p className="pr-[3px]">escape to</p>
					<p
						className="pr-[3px] text-[#3297ff]"
						style={{ cursor: 'pointer' }}
						onClick={() => {
							handleCancelEdit();
						}}
					>
						cancel
					</p>
					<p className="pr-[3px]">• enter to</p>
					{/* <p className="text-[#3297ff]" style={{ cursor: 'pointer' }} onClick={handleSave}>
						save
					</p> */}
				</div>
			</div>
		</div>
	);
};

export default React.memo(MessageInput);
