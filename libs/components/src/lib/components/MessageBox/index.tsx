import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { MentionData, defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { EditorState, Modifier, SelectionState, convertToRaw } from 'draft-js';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import * as Icons from '../Icons';

import createImagePlugin from '@draft-js-plugins/image';
import data from '@emoji-mart/data';

import Picker from '@emoji-mart/react';
import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { uploadImageToMinIO, useMezon } from '@mezon/transport';
import { IMessageSendPayload } from '@mezon/utils';
import axios from 'axios';
import { AtomicBlockUtils, ContentState } from 'draft-js';
import { SearchIndex, init } from 'emoji-mart';
import { useSelector } from 'react-redux';
import editorStyles from './editorStyles.module.css';

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
	const [metaData, setMetaData] = useState({});
	const [showPlaceHolder, setShowPlaceHolder] = useState(false);
	const [open, setOpen] = useState(false);
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const { sessionRef, clientRef } = useMezon();
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
	const urlImageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/g;
	const checkImage = async (url: string) => {
		try {
			const response = await axios.head(url);
			const contentType = response.headers['content-type'];
			if (contentType && contentType.startsWith('image')) {
				setMetaData({
					tp: 'image',
					dt: {
						s: content.length,
						l: url.length,
					}
				})
			} else {
				setMetaData({
				})
			}
		} catch (error) {
			setMetaData({
			})
		}
		return false;
	};

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
			if (messageBreakline.match(urlImageRegex)) {
				checkImage(messageBreakline);
			}
			let mentionedUsers = [];
			for (let key in raw.entityMap) {
				const ent = raw.entityMap[key];
				if (ent.type === 'mention') {
					mentionedUsers.push(ent.data.mention);
				}
			}
			setContent(content + messageBreakline);
			setUserMentioned(mentionedUsers);
		},
		[],
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

			const session = sessionRef.current;
			const client = clientRef.current;

			if (!client || !session || !currentClanId) {
				console.log(client, session, currentClanId);
				throw new Error('Client is not initialized');
			}

			file.arrayBuffer().then((buf) => {
				client.uploadAttachmentFile(session, {filename: fullfilename, filetype:'image', size:file.size}).then(data => {
					if (!data || !data.url) {
						return 'not-handled';
					}
					// upload to minio
					uploadImageToMinIO(data.url, Buffer.from(buf), file.size).then( res => {
						if (res.status !== 200) {
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
						setContent(content + url);
						setMetaData({
							tp: 'image',
							dt: {
								s: content.length,
								l: url.length,
							}
						})
						return 'handled';
					});
				});				
			});

			setEditorState(() => EditorState.createWithContent(ContentState.createFromText('Uploading...')));

			console.log('add code handle');
			return 'not-handled';
		},
		[content, currentChannelId, currentClanId, editorState],
	);

	const handleSend = useCallback(() => {
		if (!content.trim()) {
			return;
		}
		const msg = userMentioned.length > 0 ? { t: content, m: userMentioned, md: metaData } : { t: content, md: metaData };
		// console.log('MMMMMMM: ', msg)
		onSend(msg);
		setContent('');
		setMetaData({})
		setClearEditor(true);
	}, [content, onSend, userMentioned, metaData]);

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
		handleDetectEmoji(content);
	}, [clearEditor, content]);

	useEffect(() => {
		const editorElement = document.querySelectorAll('[data-offset-key]');
		editorElement[2].classList.add('break-all');
	}, []);

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

	const handleKeyPress = (event: React.KeyboardEvent, emoji: string) => {
		if (event.key === 'Enter') {
			clickEmojiSugesstion(emoji);
		}
	};

	function EmojiReaction() {
		const handleEmojiSelect = (emoji: any) => {
			setShowPlaceHolder(false);
			setShowEmoji(false);
			handleEmojiClick(emoji.native);
		};
		return <Picker data={data} onEmojiSelect={handleEmojiSelect} />;
	}

	const [emojiResult, setEmojiResult] = useState<string[]>([]);

	function clickEmojiSugesstion(emoji: string) {
		handleEmojiClick(emoji);
		setShowEmojiSuggestion(false);
		setEditorState((prevEditorState) => {
			const currentContentState = prevEditorState.getCurrentContent();
			const raw = convertToRaw(currentContentState);
			const messageRaw = raw.blocks;
			const emojiPicker = messageRaw[0].text.toString();
			const regexEmoji = /[\uD800-\uDFFF][\uDC00-\uDFFF]|[\u0020-\uD7FF\uE000-\uFFFF]/g;
			const emojiArray = Array.from(emojiPicker.matchAll(regexEmoji), (match) => match[0]);
			const lastEmoji = emojiArray.length > 0 ? emojiArray[emojiArray.length - 1] : null;
			const regexSpaceToEmoji = /\s[^\s]+(?=$|[\p{Emoji}])/gu;
			const blockMap = editorState.getCurrentContent().getBlockMap();
			const selectionsToReplace: any = [];
			const findWithRegex = (regex: RegExp, contentBlock: Draft.ContentBlock | undefined, callback: (start: number, end: number) => void) => {
				const text = contentBlock?.getText();
				const modifiedText = text?.startsWith(' ') ? text : ` ${text}`;
				let matchArr, start, end;
				while ((matchArr = regex.exec(modifiedText)) !== null) {
					start = matchArr.index;
					end = start + matchArr[0].length;
					callback(start, end);
				}
			};

			blockMap.forEach((contentBlock) => {
				findWithRegex(regexSpaceToEmoji, contentBlock, (start: number, end: number) => {
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
				contentState = Modifier.replaceText(contentState, selectionState, lastEmoji ?? '');
			});
			const newEditorState = EditorState.push(prevEditorState, contentState, 'insert-characters');
			return newEditorState;
		});
	}
	const regex = /:{2}./;
	const handleDetectEmoji = async (value: string) => {
		const inputValue = value;
		if (!regex.test(inputValue)) {
			setShowEmojiSuggestion(false);
			return;
		}
		const lastWord = inputValue.split(' ').pop();
		const emojiPickerActive = lastWord?.startsWith(':');
		const lastEmojiIdx = emojiPickerActive ? inputValue.lastIndexOf(':') : null;
		const emojiSearch = emojiPickerActive ? inputValue.slice(Number(lastEmojiIdx)) : null;
		const emojiSearchWithOutPrefix = emojiSearch?.slice(1);
		let emojiResults = (await SearchIndex.search(emojiSearch)) || [];
		if (emojiResults.length === 0) {
			emojiResults = await SearchIndex.search(emojiSearchWithOutPrefix);
		}

		let results = emojiResults?.map((emoji: any) => {
			return emoji.skins[0].native;
		});

		if (results) {
			setShowPlaceHolder(false);
			setShowEmojiSuggestion(true);
		}
		setEmojiResult(results);
	};

	return (
		<div className="flex flex-inline w-max-[97%] items-end gap-2 box-content m-4 mr-4 mb-4 bg-black rounded-md pr-2 relative">
			{showEmojiSuggestion && (
				<div tabIndex={1} id="content" className="absolute bottom-[150%] bg-black rounded max-w-[50%] w-fit h-fit">
					<div className={emojiResult?.length > 0 ? 'p-2' : ''}>
						<div className=" cursor-pointer flex flex-wrap">
							{emojiResult?.map((emoji) => {
								return (
									<p
										tabIndex={0}
										className=" hover:bg-slate-800 rounded border-blue-500"
										onClick={() => clickEmojiSugesstion(emoji)}
										key={emoji}
										onKeyDown={(e) => handleKeyPress(e, emoji)}
									>
										{emoji}
									</p>
								);
							})}
						</div>
					</div>
				</div>
			)}

			<div className="flex flex-row h-6 w-6 items-center justify-center ml-2 mb-2 cursor-pointer">
				<Icons.AddCircle />
			</div>

			<div
				className={`w-[96%] bg-black gap-3 relative`}
				onClick={() => {
					editorRef.current!.focus();
				}}
			>
				<div id="editor" className={`p-[10px] flex items-center text-[15px] break-all `}>
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

			<div className="flex flex-row h-full items-center gap-1 w-18 mb-3">
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
