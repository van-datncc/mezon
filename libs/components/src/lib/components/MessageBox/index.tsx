import { IMessage } from '@mezon/utils';
import { useCallback, useState, useRef } from 'react';
import * as Icons from '../Icons';
import { MentionData } from '@draft-js-plugins/mention';

import React, { MouseEvent, ReactElement, memo, useMemo } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter, MentionPluginTheme } from '@draft-js-plugins/mention';
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
	memberList?: MentionData[];
};

export type IMessagePayload = IMessage & {
	channelId: string;
};

function MessageBox(props: MessageBoxProps): ReactElement {
	const [listUserMention, setListUserMention] = useState<MentionData[]>(props.memberList ?? []);
	const onSearchChange = useCallback(
		({ value }: { value: string }) => {
			setSuggestions(defaultSuggestionsFilter(value, props.memberList ?? []));
		},
		[listUserMention],
	);
	const ref = useRef<Editor>(null);
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const [open, setOpen] = useState(false);

	const { MentionSuggestions, plugins } = useMemo(() => {
		const mentionPlugin = createMentionPlugin({
			entityMutability: 'IMMUTABLE',
			theme: mentionsStyles,
			mentionPrefix: '@',
			supportWhitespace: true,
			mentionTrigger: ['@', '('],
		});
		const { MentionSuggestions } = mentionPlugin;
		const plugins = [mentionPlugin];
		return { plugins, MentionSuggestions };
	}, []);
	const [suggestions, setSuggestions] = useState<MentionData[]>(props.memberList ?? []);
	const [userMentioned, setUserMentioned] = useState<string[]>([]);
	const { onSend, onTyping } = props;

	const onChange = useCallback(
		(editorState: EditorState) => {
			if (typeof onTyping === 'function') {
				onTyping();
			}
			setEditorState(editorState);
			const contentState = editorState.getCurrentContent();
			const content = convertToRaw(contentState).blocks[0].text;
			const mentionedRaw = convertToRaw(contentState).entityMap;
			const mentioned = Object.values(mentionedRaw).map((item) => item.data.mention.id);
			setContent(content);
			setUserMentioned(mentioned);
		},
		[onTyping],
	);

	const onOpenChange = useCallback((_open: boolean) => {
		setOpen(_open);
	}, []);

	const [content, setContent] = useState('');

	const handleSend = useCallback(() => {
		if (!content.trim()) {
			return;
		}
		onSend({
			content: { content: content, mentioned: userMentioned },
			id: '',
			channel_id: '',
			body: { text: '' },
			channelId: '',
		});
		setContent('');
		setEditorState(() => EditorState.createEmpty());
	}, [onSend, content]);

	function keyBindingFn(e: React.KeyboardEvent<Element>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			return 'onsend';
		}
	}

	function handleKeyCommand(command: string) {
		if (command === 'onsend') {
			handleSend();
			return 'handled';
		}
		return 'not-handled';
	}
	return (
		<div className="flex w-full items-center">
			<div className="flex flex-inline w-full items-center gap-2 box-content m-4 mr-4 mb-2 bg-black rounded-md pr-2">
				<div className="flex flex-row h-6 w-6 items-center justify-center ml-2">
					<Icons.AddCircle />
				</div>

				<div
					className={`w-[96%] relative bg-black gap-3`}
					onClick={() => {
						ref.current!.focus();
					}}
				>
					<div className="p-[10px] flex items-center">
						<Editor
							editorKey={'editor'}
							editorState={editorState}
							onChange={onChange}
							plugins={plugins}
							ref={ref}
							keyBindingFn={keyBindingFn}
							handleKeyCommand={handleKeyCommand}
							// placeholder='Write your thoughs here...'
						/>
					</div>

					<div className="absolute w-full box-border bottom-16  bg-black rounded-md ">
						<MentionSuggestions
							open={open}
							onOpenChange={onOpenChange}
							suggestions={props.memberList ?? []}
							onSearchChange={onSearchChange}
							entryComponent={Entry}
							popoverContainer={({ children }: any) => <div>{children}</div>}
						/>
					</div>
				</div>

				<div className="flex flex-row h-full items-center gap-1 w-12">
					<Icons.Gif />
					<Icons.Help />
				</div>
			</div>
		</div>
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
				<div className="flex flex-row h-full items-center gap-1 mr-2 w-12">
					<Icons.Gif />
					<Icons.Help />
				</div>
			</form>
		</div>
	);
};

export default MessageBox;
