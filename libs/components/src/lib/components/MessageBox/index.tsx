import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createMentionPlugin, { MentionData, defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { uploadImageToMinIO } from '@mezon/transport';
import { IMessageSendPayload } from '@mezon/utils';
import { AtomicBlockUtils, ContentState, EditorState, Modifier, SelectionState, convertToRaw } from 'draft-js';
import { SearchIndex, init } from 'emoji-mart';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons';
import editorStyles from './editorStyles.module.css';
// import { useDebounce } from 'use-debounce';


export type MessageBoxProps = {
	onSend: (mes: IMessageSendPayload) => void;
	onTyping?: () => void;
	listMentions?: MentionData[] | undefined;
};

init({ data });

function MessageBox(props: MessageBoxProps): ReactElement {
	const { onSend, onTyping, listMentions } = props;
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [suggestions, setSuggestions] = useState(listMentions);
	const [clearEditor, setClearEditor] = useState(false);
	const [content, setContent] = useState<string>('');
	const [userMentioned, setUserMentioned] = useState<string[]>([]);
	const [showPlaceHolder, setShowPlaceHolder] = useState(false);
	const [open, setOpen] = useState(false);
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const mentionPlugin = useRef(
		createMentionPlugin({
			entityMutability: 'IMMUTABLE',
			theme: editorStyles,
			mentionPrefix: '@',
			supportWhitespace: true,
			mentionTrigger: '@',
		}),
	);
	const { MentionSuggestions } = mentionPlugin.current;
	const imagePlugin = createImagePlugin();
	const plugins = [mentionPlugin.current, imagePlugin];

	const onChange = useCallback(
		(editorState: EditorState) => {
			if (typeof onTyping === 'function') {
				onTyping();
			}

			setClearEditor(false);
			setEditorState(editorState);
			const contentState = editorState.getCurrentContent();
			const raw = convertToRaw(contentState);
			// get message
			const messageRaw = raw.blocks;
			const messageContent = Object.values(messageRaw).map((item) => item.text);
			const messageBreakline = messageContent.join('\n').replace(/,/g, '');
			let mentionedUsers = [];
			for (let key in raw.entityMap) {
				const ent = raw.entityMap[key];
				if (ent.type === 'mention') {
					mentionedUsers.push(ent.data.mention);
				}
			}
			setContent(messageBreakline);
			setUserMentioned(mentionedUsers);
		},
		[onTyping],
	);

	const onSearchChange = ({ value }: any) => {
		setSuggestions(defaultSuggestionsFilter(value, listMentions || []) as any);
	};

	const onOpenChange = useCallback((_open: boolean) => {
		setOpen(_open);
	}, []);

	const onPastedFiles = useCallback(
		(files: Blob[]) => {
			const now = Date.now();
			const filename = now + '.png';
			const file = new File(files, filename, { type: 'image/png' });
			const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;
			const bucket = 'mezon';
			const metaData = {
				'Content-Type': 'image/png',
				'Content-Language': file.size,
			};

			file.arrayBuffer().then((buf) => {
				// upload to minio
				uploadImageToMinIO(bucket, fullfilename, Buffer.from(buf), file.size, metaData, (err, etag) => {
					if (err) {
						console.log('err', err);
						return 'not-handled';
					}
					const url = 'https://cdn.mezon.vn/' + fullfilename;
					const contentState = editorState.getCurrentContent();
					const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {
						src: url,
						height: '20px',
						width: 'auto',
					});
					const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
					const newEditorState = EditorState.set(editorState, {
						currentContent: contentStateWithEntity,
					});

					setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
					setContent(url);
					return 'handled';
				});
			});

			setEditorState(() => EditorState.createWithContent(ContentState.createFromText('Uploading...')));
			return 'not-handled';
		},
		[currentChannelId, currentClanId, editorState],
	);

	const handleSend = useCallback(() => {
		// liRefs?.current[0]?.focus();

		setShowEmojiSuggestion(false);
		if (!content.trim()) {
			return;
		}
		const msg = userMentioned.length > 0 ? { t: content, m: userMentioned } : { t: content };
		onSend(msg);
		setContent('');
		setClearEditor(true);
		setSelectedItemIndex(0);
		liRefs?.current[selectedItemIndex]?.focus();
	}, [content, onSend, userMentioned]);

	function keyBindingFn(e: React.KeyboardEvent<Element>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			return 'onsend';
		}
		if (e.key === 'ArrowUp') {
			return 'arrowUpClicked';
		}
		if (e.key === 'ArrowDown') {
			return 'arrowUpClicked';
		}
		return;
	}



	


	function handleKeyCommand(command: string) {
		if (command === 'onsend') {
			handleSend();
			return 'handled';
		}

		if (command === 'arrowUpClicked') {
			liRefs?.current[selectedItemIndex]?.focus();
			return 'handled';
		}
		return 'not-handled';
	}
	const editorRef = useRef<Editor | null>(null);

	const [showEmojiSuggestion, setShowEmojiSuggestion] = useState(false);

	useEffect(() => {
		if (editorRef.current && clearEditor) {
			setTimeout(() => {
				editorRef.current!.focus();
			}, 0);
		}
		if (content.length === 0) {
			setShowPlaceHolder(true);
			setShowEmojiSuggestion(false);
		} else setShowPlaceHolder(false);
	}, [clearEditor, content, showEmojiSuggestion]);

	const editorDiv = document.getElementById('editor');
	const editorHeight = editorDiv?.clientHeight;
	document.documentElement.style.setProperty('--editor-height', (editorHeight && editorHeight - 10) + 'px');
	document.documentElement.style.setProperty('--bottom-emoji', (editorHeight && editorHeight + 25) + 'px');

	const [isShowEmoji, setShowEmoji] = useState(false);

	const handleOpenEmoji = () => {
		setShowEmoji(!isShowEmoji);
	};

	function handleEmojiClick(clickedEmoji: string) {
		setEditorState((prevEditorState) => {
			const currentContentState = prevEditorState.getCurrentContent();
			const newContentState = Modifier.insertText(currentContentState, prevEditorState.getSelection(), clickedEmoji);
			const newEditorState = EditorState.push(prevEditorState, newContentState, 'insert-characters');
			return newEditorState;
		});
	}

	function EmojiReaction() {
		const handleEmojiSelect = (emoji: any) => {
			setShowPlaceHolder(false);
			setShowEmoji(false);
			handleEmojiClick(emoji.native);
		};
		return <Picker data={data} onEmojiSelect={handleEmojiSelect} />;
	}

	const [emojiResult, setEmojiResult] = useState<string[]>([]);

	function clickEmojiSuggestion(emoji: string, index: number) {
		setSelectedItemIndex(index);
		handleEmojiClick(emoji);
		setEditorState((prevEditorState) => {
			const currentContentState = prevEditorState.getCurrentContent();
			const raw = convertToRaw(currentContentState);
			const messageRaw = raw.blocks;
			const emojiPicker = messageRaw[0].text.toString();
			const regexEmoji = /:[^\s]+(?=$|[\p{Emoji}])/gu;
			const emojiArray = Array.from(emojiPicker.matchAll(regexEmoji), (match) => match[0]);
			console.log('syntax.length', syntax.length);
			const lastEmoji = emojiArray[0]?.slice(syntax.length);
			const blockMap = editorState.getCurrentContent().getBlockMap();
			const selectionsToReplace: any = [];
			const findWithRegex = (regex: RegExp, contentBlock: Draft.ContentBlock | undefined, callback: (start: number, end: number) => void) => {
				const text = contentBlock?.getText() || '';
				let matchArr, start, end;
				while ((matchArr = regex.exec(text)) !== null) {
					start = matchArr.index;
					end = start + matchArr[0].length;
					callback(start, end);
				}
			};

			blockMap.forEach((contentBlock) => {
				findWithRegex(regexEmoji, contentBlock, (start: number, end: number) => {
					const blockKey = contentBlock?.getKey();
					const blockSelection = SelectionState.createEmpty(blockKey ?? '').merge({
						anchorOffset: start,
						focusOffset: end,
					});

					selectionsToReplace.push(blockSelection);
				});
			});
			let contentState = editorState.getCurrentContent();
			selectionsToReplace.forEach((selectionState: SelectionState) => {
				contentState = Modifier.replaceText(contentState, selectionState, lastEmoji ?? '�️');
			});
			const newEditorState = EditorState.push(prevEditorState, contentState, 'insert-characters');

			return newEditorState;
		});
	}
	const [syntax, setSyntax] = useState<string>('');
	const regexDetect = /:.{2,}/;

	const handleDetectEmoji = async (value: string) => {
		const inputValue = value;
		if (!regexDetect.test(inputValue)) {
			setEmojiResult([]);
			setShowEmojiSuggestion(false);
			return;
		}
		const matches = regexDetect.exec(inputValue)?.[0];
		matches && setSyntax(matches);
		const emojiPickerActive = matches?.startsWith(':');
		const lastEmojiIdx = emojiPickerActive ? inputValue.lastIndexOf(':') : null;
		const emojiSearch = emojiPickerActive ? inputValue.slice(Number(lastEmojiIdx)) : null;
		const emojiSearchWithOutPrefix = emojiSearch?.slice(1);
		let emojiResults = (await SearchIndex.search(emojiSearch)) || [];
		if (emojiResults.length === 0) {
			emojiResults = await SearchIndex.search(emojiSearchWithOutPrefix);
		}

		let results =
			emojiResults.map((emoji: any) => {
				return emoji.skins[0];
			}) || [];
		if (results) {
			setShowPlaceHolder(false);
			setEmojiResult(results);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent, native: string) => {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				setSelectedItemIndex((prevIndex) => Math.min(liRefs.current.length - 1, prevIndex - 1));
				liRefs?.current[selectedItemIndex]?.focus();
				setClicked(!clicked);
				break;
			case 'ArrowDown':
				e.preventDefault();
				setSelectedItemIndex((prevIndex) => Math.min(liRefs.current.length - 1, prevIndex + 1));
				liRefs?.current[selectedItemIndex]?.focus();
				setClicked(!clicked);
				break;
			case 'Enter':
				clickEmojiSuggestion(native as string, selectedItemIndex);
				setTimeout(() => {
					editorRef.current!.focus();
				}, 0);
				setEmojiResult([]);
				break;
			case 'Escape':
				setShowEmojiSuggestion(false);
				setTimeout(() => {
					editorRef.current!.focus();
				}, 0);
				setEmojiResult([]);
				break;
			default:
				break;
		}
	};

	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const liRefs = useRef<(HTMLLIElement | null)[]>([]);
	const ulRef = useRef<HTMLUListElement | null>(null);
	const [clicked, setClicked] = useState<boolean>(false);
	useEffect(() => {
		if (liRefs.current[selectedItemIndex]) {
			liRefs?.current[selectedItemIndex]?.focus();
		}
		if (emojiResult.length > 0) {
			// liRefs?.current[selectedItemIndex]?.focus();
			// setSelectedItemIndex(0);
			setShowEmojiSuggestion(true);
		}
	}, [showEmojiSuggestion, emojiResult, syntax]);

	console.log('syntax-detectEmoji', syntax);

	useEffect(() => {
		handleDetectEmoji(content);
		liRefs?.current[selectedItemIndex]?.focus();
	}, [content]);

	return (
		<div className="flex flex-inline w-max-[97%] items-center gap-2 box-content m-4 mr-4 mb-4 bg-black rounded-md pr-2 relative">
			{showEmojiSuggestion && (
				<div tabIndex={1} id="content" className="absolute bottom-[150%] bg-black rounded w-[400px] flex justify-center flex-col">
					<p className=" text-center p-2">Emoji Matching: {syntax}</p>
					<div className={`${emojiResult?.length > 0} ? 'p-2' : '' w-[100%] h-[400px] overflow-y-auto hide-scrollbar`}>
						<ul
							ref={ulRef}
							className="w-full flex flex-col"
							onKeyDown={(e) => {
								if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
									e.preventDefault();
								}
							}}
						>
							{emojiResult?.map((emoji: any, index: number) => (
								<li
									ref={(el) => (liRefs.current[index] = el)}
									key={emoji.shortcodes}
									onKeyDown={(e) => handleKeyPress(e, emoji.native)}
									onClick={() => clickEmojiSuggestion(emoji.native, index)}
									className={`hover:bg-gray-900 p-2 cursor-pointer focus:bg-gray-900 focus:outline-none focus:p-2 ${
										selectedItemIndex === index ? 'selected-item' : ''
									}`}
									tabIndex={0}
								>
									{emoji.native} {emoji.shortcodes} {index}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			<div className="flex flex-row h-6 w-6 items-center justify-center ml-2">
				<Icons.AddCircle />
			</div>

			<div
				className={`w-[96%] bg-black gap-3 relative`}
				onClick={() => {
					editorRef.current!.focus();
				}}
			>
				<div id="editor" className="p-[10px] flex items-center text-[15px]">
					<Editor
						keyBindingFn={keyBindingFn}
						handleKeyCommand={handleKeyCommand}
						editorState={clearEditor ? EditorState.createEmpty() : editorState}
						onChange={onChange}
						plugins={plugins}
						ref={editorRef}
						handlePastedFiles={onPastedFiles}
					/>
					{showPlaceHolder && <p className="absolute duration-300 text-gray-300 whitespace-nowrap">Write your thoughs here...</p>}
				</div>

				<MentionSuggestions open={open} onOpenChange={onOpenChange} onSearchChange={onSearchChange} suggestions={suggestions || []} />
			</div>

			<div className="flex flex-row h-full items-center gap-1 w-18">
				<Icons.Gif />
				<Icons.Help />
				<button onClick={handleOpenEmoji}>
					<Icons.Emoji defaultFill={isShowEmoji ? '#FFFFFF' : '#AEAEAE'} />
				</button>
			</div>
			{isShowEmoji && (
				<div className="absolute right-4 bottom-[--bottom-emoji]">
					<EmojiReaction />
				</div>
			)}
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
