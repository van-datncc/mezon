import { IMessage } from '@mezon/utils';
import { useCallback, useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import * as Icons from '../Icons';
import MentionMessage from '../MentionMessage';
import { useAppParams, useChatChannel } from '@mezon/core';
import { MentionData } from '@draft-js-plugins/mention';
import mentions from '../MentionMessage/mentions';

import React, { MouseEvent, ReactElement, memo, useMemo } from 'react';
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter, MentionPluginTheme } from '@draft-js-plugins/mention';
import editorStyles from '../MentionMessage/CustomMentionEditor.module.css';
import mentionsStyles from '../MentionMessage/MentionsStyles.module.css';

export interface EntryComponentProps {
	className?: string;
	onMouseDown(event: MouseEvent): void;
	onMouseUp(event: MouseEvent): void;
	onMouseEnter(event: MouseEvent): void;
	role: string;
	id: string;
	'aria-selected'?: boolean | 'false' | 'true';
	theme?: MentionPluginTheme;
	mention: MentionData;
	isFocused: boolean;
	searchValue?: string;
}

function Entry(props: EntryComponentProps): ReactElement {
	const {
		mention,
		theme,
		searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
		isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
		...parentProps
	} = props;

	return (
		<div {...parentProps}>
			<div className="flex items-center rounded-xl py-2 px-2 gap-2">
				<div className="">
					<img src={mention.avatar} className="w-8 h-8 rounded-full" role="presentation" />
				</div>

				<div className="flex justify-between gap-1">
					<div className="">{mention.name}</div>
				</div>
			</div>
		</div>
	);
}

export type MessageBoxProps = {
	onSend: (mes: IMessagePayload) => void;
	onTyping?: () => void;
};

export type IMessagePayload = IMessage & {
	channelId: string;
};

function MessageBox(props: MessageBoxProps): ReactElement {
	const { channelId } = useAppParams();
	const { members } = useChatChannel(channelId ?? '');
	const getListMentions = () => {
		if (members[0].users.length > 0) {
			const userMentionRaw = members[0].users;
			const newUserMentionList: MentionData[] = userMentionRaw.map((item) => ({
				avatar: item?.user?.avatar_url ?? '',
				name: item?.user?.username ?? '',
				id: item?.id ?? null,
			}));
			console.log('newUserMentionList', newUserMentionList);
			return setListUserMention(newUserMentionList);
		}
	};

	const [listUserMention, setListUserMention] = useState<MentionData[]>([]);
	const onSearchChange = useCallback(
		({ value }: { value: string }) => {
			setSuggestions(defaultSuggestionsFilter(value, listUserMention));
		},
		[listUserMention],
	);
	useEffect(() => {
		getListMentions();
	}, []);
	const memoizedListUserMention = useMemo(() => listUserMention, [listUserMention]);
	console.log('memoizedListUserMention', memoizedListUserMention);

	const ref = useRef<Editor>(null);
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const [open, setOpen] = useState(false);
	const [suggestions, setSuggestions] = useState(listUserMention);

	const { MentionSuggestions, plugins } = useMemo(() => {
		const mentionPlugin = createMentionPlugin({
			entityMutability: 'IMMUTABLE',
			theme: mentionsStyles,
			mentionPrefix: '@',
			supportWhitespace: true,
		});
		const { MentionSuggestions } = mentionPlugin;
		const plugins = [mentionPlugin];
		return { plugins, MentionSuggestions };
	}, []);

	const onChange = useCallback((_editorState: EditorState) => {
		setEditorState(_editorState);
	}, []);

	const onOpenChange = useCallback((_open: boolean) => {
		setOpen(_open);
	}, []);

	const [content, setContent] = useState('');
	const { onSend, onTyping } = props;

	const handleSend = useCallback(() => {
		if (!content.trim()) {
			return;
		}
		onSend({
			content: { content },
			id: '',
			channel_id: '',
			body: { text: '' },
			channelId: '',
		});
		setContent('');
	}, [onSend, content]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				handleSend();
			}
		},
		[handleSend, content, setContent],
	);

	const sanitizeContent = (content: string): string => {
		return content.replace(/ style="[^"]*"/g, '');
	};

	// const handleInputChanged = useCallback(
	// 	(event: React.FormEvent<HTMLDivElement>) => {
	// 		const updatedContent = (event.currentTarget as HTMLDivElement).innerHTML;
	// 		const sanitizedContent = sanitizeContent(updatedContent);
	// 		setContent(sanitizedContent);
	// 	},
	// 	[handleKeyDown, content, setContent],
	// );

	// const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
	// 	event.preventDefault();
	// 	const clipboardData = event.clipboardData.getData('text/plain');
	// 	setContent(clipboardData);
	// };

	// const handleTyping = useCallback(() => {
	// 	if (typeof onTyping === 'function') {
	// 		onTyping();
	// 	}
	// }, [onTyping]);

	// const contentEditableRef = useRef<HTMLDivElement | null>(null);
	// useEffect(() => {
	// 	const range = document.createRange();
	// 	const selection = window.getSelection();
	// 	range.selectNodeContents(contentEditableRef.current as any);
	// 	range.collapse(false);
	// 	selection?.removeAllRanges();
	// 	selection?.addRange(range);
	// }, [content]);

	// const [placeholderVisible, setPlaceholderVisible] = useState(true);
	// useEffect(() => {
	// 	const hasContent = contentEditableRef?.current;
	// 	const contentLength = hasContent?.textContent?.trim().length;
	// 	if (contentLength && contentLength > 0) {
	// 		setPlaceholderVisible(!hasContent);
	// 	} else {
	// 		setPlaceholderVisible(true);
	// 	}
	// }, [content]);

	return (
		<div
			className={`${editorStyles.editor} relative`}
			// className="relative h-10 w-full"
			onClick={() => {
				ref.current!.focus();
			}}
		>
			<Editor editorKey={'editor'} editorState={editorState} onChange={onChange} plugins={plugins} ref={ref} />
			<div className="absolute w-full box-border bottom-20 max-w-[97%] bg-black rounded-md">
				<MentionSuggestions
					open={open}
					onOpenChange={onOpenChange}
					suggestions={listUserMention}
					onSearchChange={onSearchChange}
					onAddMention={() => {}}
					entryComponent={Entry}
					popoverContainer={({ children }: any) => <div>{children}</div>}
				/>
			</div>
		</div>

		// <div className="self-stretch relative h-fit px-4 mb-[8px] mt-[8px] flex-col justify-end items-start gap-2 flex overflow-hidden">
		// 	<form className="self-stretch p-4 bg-neutral-950  rounded-lg justify-start gap-3 inline-flex items-center ">
		// 		<div>
		// 			<div className="flex flex-row justify-end h-fit">
		// 				<Icons.AddCircle />
		// 			</div>
		// 		</div>

		// 		<div
		// 			// className={editorStyles.editor}
		// 			className="relative h-10 w-full"
		// 			onClick={() => {
		// 				ref.current!.focus();
		// 			}}
		// 		>
		// 			<Editor editorKey={'editor'} editorState={editorState} onChange={onChange} plugins={plugins} ref={ref} />
		// 			<div className="absolute z-50 w-full top-0 h-[500px]">
		// 				<MentionSuggestions
		// 					open={open}
		// 					onOpenChange={onOpenChange}
		// 					suggestions={listUserMention}
		// 					onSearchChange={onSearchChange}
		// 					onAddMention={() => {
		// 						// get the mention object selected
		// 					}}
		// 					entryComponent={Entry}
		// 					popoverContainer={({ children }) => <div>{children}</div>}
		// 				/>
		// 			</div>
		// 		</div>

		// 		<div className="grow self-stretch justify-start items-center gap-2 flex relative ml-1">
		// 			{/* {placeholderVisible && (
		// 				<div
		// 					className="absolute pointer-events-none select-none text-[#ABABAB]"
		// 					style={{ top: '50%', transform: 'translateY(-50%)' }}
		// 				>
		// 					Write your thoughts here...
		// 				</div>
		// 			)} */}
		// 			{/* <MentionMessage /> */}
		// 			{/* <div
		// 				contentEditable
		// 				ref={contentEditableRef}
		// 				className="grow flex-wrap text-white text-sm font-['Manrope'] placeholder-[#AEAEAE] h-fit border-none focus:border-none outline-none bg-transparent overflow-y-auto w-widChatBoxBreak resize-none"
		// 				id="message"
		// 				onInput={handleInputChanged}
		// 				onFocus={handleTyping}
		// 				onBlur={handleInputChanged}
		// 				onChange={handleInputChanged}
		// 				dangerouslySetInnerHTML={{ __html: content }}
		// 				onKeyDown={handleKeyDown}
		// 				// onPaste={handlePaste}
		// 			></div> */}

		// 			{/* <div
		// 				// className={editorStyles.editor}
		// 				className='relative h-10 w-full'
		// 				onClick={() => {
		// 					ref.current!.focus();
		// 				}}
		// 			>
		// 				<Editor editorKey={'editor'} editorState={editorState} onChange={onChange} plugins={plugins} ref={ref} />
		// 				<div className='absolute z-50 w-full top-0 h-[500px]'>
		// 					<MentionSuggestions
		// 						open={open}
		// 						onOpenChange={onOpenChange}
		// 						suggestions={listUserMention}
		// 						onSearchChange={onSearchChange}
		// 						onAddMention={() => {
		// 							// get the mention object selected
		// 						}}
		// 						entryComponent={Entry}
		// 						popoverContainer={({ children }) => <div>{children}</div>}
		// 					/>
		// 				</div>
		// 			</div> */}
		// 		</div>

		// 		<div>
		// 			<div className="flex flex-row gap-1">
		// 				<Icons.Gif />
		// 				<Icons.Help />
		// 			</div>
		// 		</div>
		// 	</form>

		// 	<div
		// 		// className={editorStyles.editor}
		// 		className="relative h-10 w-full"
		// 		onClick={() => {
		// 			ref.current!.focus();
		// 		}}
		// 	>
		// 		{/* <Editor editorKey={'editor'} editorState={editorState} onChange={onChange} plugins={plugins} ref={ref} /> */}
		// 		{/* <div className="absolute z-50 w-full top-0 h-[500px]">
		// 			<MentionSuggestions
		// 				open={open}
		// 				onOpenChange={onOpenChange}
		// 				suggestions={listUserMention}
		// 				onSearchChange={onSearchChange}
		// 				onAddMention={() => {
		// 					// get the mention object selected
		// 				}}
		// 				entryComponent={Entry}
		// 				popoverContainer={({ children }) => <div>{children}</div>}
		// 			/>
		// 		</div> */}
		// 	</div>
		// </div>
	);
}

MessageBox.Skeleton = () => {
	return (
		<div className="self-stretch h-fit px-4 mb-[8px] mt-[8px] flex-col justify-end items-start gap-2 flex overflow-hidden">
			<form className="self-stretch p-4 bg-neutral-950 rounded-lg justify-start gap-2 inline-flex items-center">
				<div className="flex flex-row h-full items-center">
					<div className="flex flex-row  justify-end h-fit">
						<Icons.AddCircle />
					</div>
				</div>

				<div className="grow self-stretch justify-start items-center gap-2 flex">
					<div
						contentEditable
						className="grow text-white text-sm font-['Manrope'] placeholder-[#AEAEAE] h-fit border-none focus:border-none outline-none bg-transparent overflow-y-auto resize-none "
					/>
				</div>
				<div className="flex flex-row h-full items-center gap-1">
					<Icons.Gif />
					<Icons.Help />
				</div>
			</form>
		</div>
	);
};

export default MessageBox;
