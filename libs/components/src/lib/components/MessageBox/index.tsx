import { MentionData } from '@draft-js-plugins/mention';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Icons from '../Icons';
import { uploadImageToMinIO } from 'libs/transport/src/lib/minio';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createMentionPlugin, { MentionPluginTheme, defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';
import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { IMessageSendPayload } from '@mezon/utils';
import { AtomicBlockUtils, ContentState, EditorState, convertToRaw } from 'draft-js';
import React, { MouseEvent, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import mentionsStyles from '../MentionMessage/MentionsStyles.module.css';
import { buffer } from 'stream/consumers';


export interface EntryComponentProps {
	className?: string;
	onMouseDown(event: MouseEvent): void;
	onMouseUp(event: MouseEvent): void;
	onMouseEnter(event: MouseEvent): void;
	role: string;
	id: string;
	'aria-selected'?: boolean | 'false' | 'true';
	theme?: MentionPluginTheme;
	// mention: MentionData;
	isFocused: boolean;
	searchValue?: string;
}

export type MessageBoxProps = {
	onSend: (mes: IMessageSendPayload) => void;
	onTyping?: () => void;
	memberList?: MentionData[];
};

function MessageBox(props: MessageBoxProps): ReactElement {
	const list = props.memberList as MentionData[];
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannelId = useSelector(selectCurrentChannelId);

	const { onSend, onTyping } = props;
	const [content, setContent] = useState<string>('');
	const [suggestions, setSuggestions] = useState<MentionData[]>(list);

	useEffect(() => {
		if (props.memberList || suggestions.length === 0) setSuggestions(list);
	}, [props.memberList, currentClanId, currentChannelId]);

	const ref = useRef<Editor>(null);
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const [open, setOpen] = useState(false);

	const { MentionSuggestions, plugins } = useMemo(() => {
		const mentionPlugin = createMentionPlugin({
			entityMutability: 'IMMUTABLE',
			theme: mentionsStyles,
			mentionPrefix: '@',
			supportWhitespace: true,
			mentionTrigger: '@',
		});
		const imagePlugin = createImagePlugin();
		const { MentionSuggestions } = mentionPlugin;
		const plugins = [mentionPlugin, imagePlugin];
		return { plugins, MentionSuggestions };
	}, [onTyping, currentChannelId]);

	const [userMentioned, setUserMentioned] = useState<string[]>([]);
	const [showPlaceHolder, setShowPlaceHolder] = useState(false);

	const onPastedFiles = useCallback(
		(files: Blob[]) => {
			for (const file of files) {
				file.arrayBuffer().then(buffer => {
					const now = Date.now();
					const bucket = currentChannelId || currentClanId || 'uploads';
					const filename = (now + file.type).replace('image/', '.');

					// upload to minio
					uploadImageToMinIO('uploads', filename, Buffer.from(buffer), (err, etag) => {
						if (err) {
							console.log(err);
							return 'not-handled';
						}
						const url = "https://ncc.asia/assets/images/about_wedo-img.webp";
						const contentState = editorState.getCurrentContent();
						const contentStateWithEntity = contentState.createEntity(
							"image",
							"IMMUTABLE",
							{ 
								src:  	url,
								height: '20px',
        						width: 	'auto',
							}
						);
						const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
						const newEditorState = EditorState.set(editorState, {
							currentContent: contentStateWithEntity
						});
						
						setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));						
						setContent(url);
						return 'handled';
					});
				});
			}

			setEditorState(() => EditorState.createWithContent(ContentState.createFromText("Uploading...")));

			return 'not-handled';
		}, []
	);

	const onChange = useCallback(
		(editorState: EditorState) => {
			if (typeof onTyping === 'function') {
				onTyping();
			}
			setEditorState(editorState);
			const contentState = editorState.getCurrentContent();
			const contentRaw = convertToRaw(contentState).blocks;
			const contentText = Object.values(contentRaw).map((item) => item.text);
			const contentBreakLine = contentText.join('\n').replace(/,/g, '');
			if (contentBreakLine === '@') {
				const updatedEditorState = EditorState.moveFocusToEnd(editorState);
				setEditorState(updatedEditorState);
			}
			const mentionedRaw = convertToRaw(contentState).entityMap;
			const mentioned = Object.values(mentionedRaw).map((item) => item.data.m?.id);
			setContent(contentBreakLine);
			setUserMentioned(mentioned);
		},
		[onTyping],
	);

	const handleSend = useCallback(() => {
		if (!content.trim()) {
			return;
		}

		const msg = userMentioned.length > 0 ? { t: content, m: userMentioned } : { t: content };
		onSend(msg);
		setContent('');
		setEditorState(() => EditorState.createEmpty());
	}, [content, onSend, userMentioned]);

	function keyBindingFn(e: React.KeyboardEvent<Element>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			return 'onsend';
		}
		return;
	}

	function handleKeyCommand(command: string) {
		if (command === 'onsend') {
			handleSend();
			return 'handled';
		}
		return 'not-handled';
	}

	const onOpenChange = useCallback((_open: boolean) => {
		setOpen(_open);
	}, []);

	const onSearchChange = useCallback(
		({ value }: { value: string }) => {
			setSuggestions(defaultSuggestionsFilter(value, list));
		},
		[onTyping, currentChannelId, currentClanId, content, list],
	);

	const checkSelectionCursor = () => {
		if (content.length === 1) {
			const updatedEditorState = EditorState.moveFocusToEnd(editorState);
			setEditorState(updatedEditorState);
		} else setEditorState(editorState);
		if (content.length === 0) {
			setShowPlaceHolder(true);
		} else setShowPlaceHolder(false);
	};

	useEffect(() => {
		checkSelectionCursor();
	}, [content]);
	const editorDiv = document.getElementById('editor');
	const editorHeight = editorDiv?.clientHeight;
	document.documentElement.style.setProperty('--editor-height', (editorHeight && editorHeight - 10) + 'px');

	return (
		<div className="flex w-full items-center relative">
			<div className="flex flex-inline w-full items-center gap-2 box-content m-4 mr-4 mb-4 bg-black rounded-md pr-2">
				<div className="flex flex-row h-6 w-6 items-center justify-center ml-2">
					<Icons.AddCircle />
				</div>

				<div
					className={`w-[96%] bg-black gap-3`}
					onClick={() => {
						ref.current!.focus();
					}}
				>
					<div id="editor" className="p-[10px] flex items-center text-[15px]">
						<Editor
							editorState={editorState}
							handlePastedFiles={onPastedFiles}
							onChange={onChange}
							plugins={plugins}
							ref={ref}
							handleKeyCommand={handleKeyCommand}
							keyBindingFn={keyBindingFn}
						/>
						{showPlaceHolder && <p className="absolute duration-300 text-gray-300 whitespace-nowrap">Write your thoughs here...</p>}
					</div>

					<div className="absolute w-[100%] box-border top-10 left-9">
						<MentionSuggestions onOpenChange={onOpenChange} open={open} onSearchChange={onSearchChange} suggestions={suggestions} />
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
