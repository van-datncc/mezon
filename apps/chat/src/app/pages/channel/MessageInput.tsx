import { CustomModalMentions, SuggestItem, UserMentionList } from '@mezon/components';
import { useChannels, useEmojiSuggestion, useEscapeKey } from '@mezon/core';
import { selectAllDirectChannelVoids, selectChannelDraftMessage, selectTheme, useAppSelector } from '@mezon/store';
import {
	IEmojiOnMessage,
	IHashtagOnMessage,
	ILinkOnMessage,
	ILinkVoiceRoomOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage,
	IMessageSendPayload,
	IMessageWithUser,
	MentionDataProps,
	ThemeApp,
	searchMentionsHashtag,
} from '@mezon/utils';
import useProcessMention from 'libs/components/src/lib/components/MessageBox/ReactionMentionInput/useProcessMention';
import useProcessedContent from 'libs/components/src/lib/components/MessageBox/ReactionMentionInput/useProcessedContent';
import { ChannelStreamMode } from 'mezon-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mention, MentionItem, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';
import { useSelector } from 'react-redux';
import lightMentionsInputStyle from './LightRmentionInputStyle';
import ModalDeleteMess from './ModalDeleteMess';
import darkMentionsInputStyle from './RmentionInputStyle';
import mentionStyle from './RmentionStyle';
import { useEditMessage } from './useEditMessage';

type MessageInputProps = {
	messageId: string;
	channelId: string;
	mode: number;
	channelLabel: string;
	message: IMessageWithUser;
};

type ChannelsMentionProps = {
	id: string;
	display: string;
	subText: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ messageId, channelId, mode, channelLabel, message }) => {
	const { openEditMessageState, idMessageRefEdit, handleCancelEdit, handleSend, setChannelDraftMessage } = useEditMessage(
		channelId,
		channelLabel,
		mode,
		message,
	);
	const { emojis } = useEmojiSuggestion();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const appearanceTheme = useSelector(selectTheme);
	const mentionListData = UserMentionList({ channelID: channelId, channelMode: mode });
	const channelDraftMessage = useAppSelector((state) => selectChannelDraftMessage(state, channelId));

	const [mentionRaw, setMentionRaw] = useState<MentionItem[]>([]);
	const [contentRaw, setContentRaw] = useState<IMessageSendPayload>(message.content as IMessageSendPayload);
	const { mentionList, simplifiedMentionList, hashtagList, emojiList } = useProcessMention(contentRaw.t as string, mentionRaw);
	const { linkList, markdownList, voiceLinkRoomList } = useProcessedContent(contentRaw.t as string);

	const processedContentPayload: IMessageSendPayload = useMemo(() => {
		return {
			t: message?.content.t,
			mentions: message?.content.mentions,
			hashtags: message?.content.hashtags,
			emojis: message?.content.emojis,
			links: message?.content.links,
			markdowns: message?.content.markdowns,
			voicelinks: message?.content.voicelinks,
		};
	}, [message.content, messageId]);

	const formatPayloadContent = createFormattedString(processedContentPayload);

	useEffect(() => {
		if (processedContentPayload) {
			console.log('processedContentPayload :', processedContentPayload);

			setChannelDraftMessage(channelId, messageId, processedContentPayload);
		}
	}, [processedContentPayload]);

	// const [convertedContent, setConvertedContent] = useState(combinedContent);

	// useEffect(() => {
	// 	setConvertedContent(combinedContent);
	// }, [channelDraftMessage.draftContent, mentionList, hashtagList, emojiList, linkList, markdownList, voiceLinkRoomList]);

	const [initialDraftContent, setInitialDraftContent] = useState<string>(message.content);
	const [openModalDelMess, setOpenModalDelMess] = useState(false);

	const { listChannels } = useChannels();

	const listChannelsMention = useMemo(() => {
		if (mode !== 3 && mode !== 4) {
			return listChannels.map((item) => {
				return {
					id: item?.channel_id ?? '',
					display: item?.channel_label ?? '',
					subText: item?.category_name ?? '',
				};
			});
		} else {
			return [];
		}
	}, [mode, listChannels]);

	useEffect(() => {
		if (openEditMessageState && message.id === idMessageRefEdit) {
			textareaRef.current?.focus();
		}
	}, [openEditMessageState, message.id, idMessageRefEdit]);

	const handleFocus = () => {
		if (textareaRef.current) {
			const length = textareaRef.current.value.length;
			textareaRef.current.setSelectionRange(length, length);
		}
	};

	const queryEmojis = (query: string, callback: (data: any[]) => void) => {
		if (query.length === 0) return;
		const matches = emojis
			.filter((emoji) => emoji.shortname && emoji.shortname.indexOf(query.toLowerCase()) > -1)
			.slice(0, 20)
			.map((emojiDisplay) => ({ id: emojiDisplay?.shortname, display: emojiDisplay?.shortname }));
		callback(matches);
	};

	useEscapeKey(handleCancelEdit);

	// const onSend = (e: React.KeyboardEvent<Element>) => {
	// 	if (e.key === 'Enter' && !e.shiftKey) {
	// 		e.preventDefault();
	// 		e.stopPropagation();
	// 		if (channelDraftMessage.draftContent === '') {
	// 			setOpenModalDelMess(true);
	// 		} else {
	// 			handleSend(convertedContent, message.id);
	// 			handleCancelEdit();
	// 		}
	// 	}
	// 	if (e.key === 'Escape') {
	// 		e.preventDefault();
	// 		e.stopPropagation();
	// 		handleCancelEdit();
	// 	}
	// };

	const sortObjectKeys = (obj: any): any => {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}
		if (Array.isArray(obj)) {
			return obj.map(sortObjectKeys);
		}
		return Object.keys(obj)
			.sort()
			.reduce((accumulator, key) => {
				accumulator[key] = sortObjectKeys(obj[key]);
				return accumulator;
			}, {} as any);
	};

	// const sortedContentConverted = sortObjectKeys(convertedContent);
	const sortedInitialDraftContent = sortObjectKeys(initialDraftContent);

	// const handleSave = () => {
	// 	if (channelDraftMessage.draftContent === '') {
	// 		return setOpenModalDelMess(true);
	// 	} else if (JSON.stringify(sortedInitialDraftContent) === JSON.stringify(sortedContentConverted) && channelDraftMessage.draftContent !== '') {
	// 		return handleCancelEdit();
	// 	} else {
	// 		handleSend(convertedContent, message.id);
	// 	}
	// 	handleCancelEdit();
	// };

	const [titleMention, setTitleMention] = useState('');

	const handleChange: OnChangeHandlerFunc = (event, newValue, newPlainTextValue, mentions) => {
		setMentionRaw(mentions);
		// setContentRaw(newPlainTextValue);
		// setChannelDraftMessage(channelId, messageId, combinedContent);
		if (newPlainTextValue.endsWith('@')) {
			setTitleMention('Members');
		} else if (newPlainTextValue.endsWith('#')) {
			setTitleMention('Text channels');
		} else if (newPlainTextValue.endsWith(':')) {
			setTitleMention('Emoji matching');
		}
	};
	const commonChannelVoids = useSelector(selectAllDirectChannelVoids);

	const [valueHighlight, setValueHightlight] = useState<string>('');
	const listChannelVoidsMention: ChannelsMentionProps[] = useMemo(() => {
		if (mode === ChannelStreamMode.STREAM_MODE_DM) {
			return commonChannelVoids.map((item) => {
				return {
					id: item?.channel_id ?? '',
					display: item?.channel_label ?? '',
					subText: item?.clan_name ?? '',
				};
			}) as ChannelsMentionProps[];
		}
		return [];
	}, [mode, commonChannelVoids]);

	const handleSearchUserMention = (search: string, callback: any) => {
		setValueHightlight(search);
		callback(searchMentionsHashtag(search, mentionListData ?? []));
	};

	const handleSearchHashtag = (search: string, callback: any) => {
		setValueHightlight(search);
		if (mode === ChannelStreamMode.STREAM_MODE_DM) {
			callback(searchMentionsHashtag(search, listChannelVoidsMention ?? []));
		} else {
			callback(searchMentionsHashtag(search, listChannelsMention ?? []));
		}
	};

	return (
		<div className="inputEdit w-full flex ">
			<div className="w-full">
				<MentionsInput
					onFocus={handleFocus}
					inputRef={textareaRef}
					value={formatPayloadContent ?? '{}'}
					className={`w-full dark:bg-black bg-white border border-[#bebebe] dark:border-none rounded p-[10px] dark:text-white text-black customScrollLightMode mt-[5px] ${appearanceTheme === ThemeApp.Light && 'lightModeScrollBarMention'}`}
					// onKeyDown={onSend}
					onChange={handleChange}
					// rows={channelDraftMessage.draftContent?.split('\n').length}
					forceSuggestionsAboveCursor={true}
					style={appearanceTheme === ThemeApp.Light ? lightMentionsInputStyle : darkMentionsInputStyle}
					customSuggestionsContainer={(children: React.ReactNode) => {
						return <CustomModalMentions children={children} titleModalMention={titleMention} />;
					}}
				>
					<Mention
						appendSpaceOnAdd={true}
						data={handleSearchUserMention}
						trigger="@"
						displayTransform={(id: any, display: any) => {
							return display === '@here' ? `${display}` : `@${display}`;
						}}
						renderSuggestion={(suggestion: MentionDataProps) => {
							return (
								<SuggestItem
									valueHightLight={valueHighlight}
									avatarUrl={suggestion.avatarUrl}
									subText={
										suggestion.display === '@here'
											? 'Notify everyone who has permission to see this channel'
											: suggestion.username ?? ''
									}
									subTextStyle={(suggestion.display === '@here' ? 'normal-case' : 'lowercase') + ' text-xs'}
									showAvatar={suggestion.display !== '@here'}
									display={suggestion.display}
								/>
							);
						}}
						style={mentionStyle}
						className="dark:bg-[#3B416B] bg-bgLightModeButton"
					/>
					<Mention
						markup="#[__display__](__id__)"
						appendSpaceOnAdd={true}
						data={handleSearchHashtag}
						trigger="#"
						displayTransform={(id: any, display: any) => {
							return `#${display}`;
						}}
						style={mentionStyle}
						renderSuggestion={(suggestion) => (
							<SuggestItem
								valueHightLight={valueHighlight}
								display={suggestion.display ?? ''}
								symbol="#"
								subText={(suggestion as ChannelsMentionProps).subText}
								channelId={suggestion.id}
							/>
						)}
						className="dark:bg-[#3B416B] bg-bgLightModeButton"
					/>
					<Mention
						trigger=":"
						markup="[:__display__]"
						data={queryEmojis}
						displayTransform={(id: any, display: any) => {
							return `${display}`;
						}}
						renderSuggestion={(suggestion) => <SuggestItem display={suggestion.display ?? ''} symbol={(suggestion as any).emoji} />}
						className="dark:bg-[#3B416B] bg-bgLightModeButton"
						appendSpaceOnAdd={true}
					/>
				</MentionsInput>
				<div className="text-xs flex text-textLightTheme dark:text-textDarkTheme">
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
			{openModalDelMess && (
				<ModalDeleteMess
					channelId={channelId}
					channelLable={channelLabel}
					mess={message}
					closeModal={() => setOpenModalDelMess(false)}
					mode={mode}
				/>
			)}
		</div>
	);
};

export default React.memo(MessageInput);

type Element =
	| (IMentionOnMessage & { type: 'mentions' })
	| (IHashtagOnMessage & { type: 'hashtags' })
	| (IEmojiOnMessage & { type: 'emojis' })
	| (ILinkOnMessage & { type: 'links' })
	| (IMarkdownOnMessage & { type: 'markdowns' })
	| (ILinkVoiceRoomOnMessage & { type: 'voicelinks' });

const createFormattedString = (data: IMessageSendPayload): string => {
	let { t = '' } = data;
	const elements: Element[] = [];

	(Object.keys(data) as (keyof IMessageSendPayload)[]).forEach((key) => {
		const itemArray = data[key];

		if (Array.isArray(itemArray)) {
			itemArray.forEach((item) => {
				if (item) {
					const typedItem: Element = { ...item, type: key as any }; // Casting key as any
					elements.push(typedItem);
				}
			});
		}
	});

	elements.sort((a, b) => {
		const startA = a.startindex ?? 0;
		const startB = b.startindex ?? 0;
		return startA - startB;
	});
	let result = '';
	let lastIndex: number = 0;

	elements.forEach((element) => {
		const startindex = element.startindex ?? lastIndex;
		const endindex = element.endindex ?? startindex;

		result += t.slice(lastIndex, startindex);

		switch (element.type) {
			case 'mentions':
				result += `@[${element.username?.slice(1)}](${element.userid})`;
				break;
			case 'hashtags':
				result += `#[${element.channellabel?.slice(1)}](${element.channelid})`;
				break;
			case 'emojis':
				result += `[${element.shortname}]`;
				break;
			case 'links':
				result += `${element.link}`;
				break;
			case 'markdowns':
				result += `${element.markdown}`;
				break;
			case 'voicelinks':
				result += `${element.voicelink}`;
				break;
			default:
				break;
		}
		lastIndex = endindex;
	});

	result += t.slice(lastIndex);

	return result;
};
