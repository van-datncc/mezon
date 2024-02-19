import React, { MouseEvent, ReactElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter, MentionData, MentionPluginTheme } from '@draft-js-plugins/mention';
import editorStyles from './CustomMentionEditor.module.css';
import mentionsStyles from './MentionsStyles.module.css';
import { useAppParams, useChatChannel, useChatDirect } from '@mezon/core';

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
		<div className="flex flex-col relative bottom-96 z-50 bg-black">
			<div {...parentProps}>
				<div className="flex items-center rounded-xl">
					<div className="">
						<img src={mention.avatar} className={theme?.mentionSuggestionsEntryAvatar} role="presentation" />
					</div>

					<div className="flex justify-between gap-1">
						<div className={theme?.mentionSuggestionsEntryText}>{mention.name}</div>

						{/* <div className="">
            {mention.name}
          </div> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function CustomMentionEditor(): ReactElement {
	const { channelId } = useAppParams();
	const { members } = useChatChannel(channelId ?? '');
	const getListMentions = useCallback(() => {
		if (members[0].users.length > 0) {
			const userMentionRaw = members[0].users;
			const newUserMentionList: MentionData[] = userMentionRaw.map((item) => ({
				avatar: item?.user?.avatar_url ?? '',
				name: item?.user?.username ?? '',
				id: item?.id ?? null,
			}));
			return setListUserMention(newUserMentionList);
		}
	}, [channelId,members[0].users.length]);

	useEffect(() => {
		getListMentions();
	}, [channelId,getListMentions]);

	const [listUserMention, setListUserMention] = useState<MentionData[]>([]);
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
	const onSearchChange = useCallback(({ value }: { value: string }) => {
		setSuggestions(defaultSuggestionsFilter(value, listUserMention));
	}, []);

	return (
		<div
			className={editorStyles.editor}
			onClick={() => {
				ref.current!.focus();
			}}
		>
			<Editor editorKey={'editor'} editorState={editorState} onChange={onChange} plugins={plugins} ref={ref} />
			<MentionSuggestions
				open={open}
				onOpenChange={onOpenChange}
				suggestions={listUserMention}
				onSearchChange={onSearchChange}
				onAddMention={() => {
					// get the mention object selected
				}}
				entryComponent={Entry}
				popoverContainer={({ children }) => <div>{children}</div>}
			/>
		</div>
	);
}
