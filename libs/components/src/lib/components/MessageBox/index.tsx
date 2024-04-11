import createImagePlugin from '@draft-js-plugins/image';
import createMentionPlugin from '@draft-js-plugins/mention';
import { MentionReactInput } from '@mezon/components';
import { useEmojiSuggestion } from '@mezon/core';
import { useAppDispatch } from '@mezon/store';
import { handleUploadFile, handleUrlInput, useMezon } from '@mezon/transport';
import { IMessageSendPayload, MentionDataProps, SubPanelName } from '@mezon/utils';
import { AtomicBlockUtils, EditorState, Modifier, convertToRaw } from 'draft-js';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import * as Icons from '../Icons';
import FileSelectionButton from './FileSelectionButton';
import GifStickerEmojiButtons from './GifsStickerEmojiButtons';
import ImageComponent from './ImageComponet';
import editorStyles from './editorStyles.module.css';

export type MessageBoxProps = {
	onSend: (
		content: IMessageSendPayload,
		mentions?: Array<ApiMessageMention>,
		attachments?: Array<ApiMessageAttachment>,
		references?: Array<ApiMessageRef>,
	) => void;
	onTyping?: () => void;
	listMentions?: MentionDataProps[] | undefined;
	currentChannelId?: string;
	currentClanId?: string;
};

function MessageBox(props: MessageBoxProps): ReactElement {
	const { sessionRef, clientRef } = useMezon();
	const dispatch = useAppDispatch();
	const { onSend, onTyping, listMentions, currentChannelId, currentClanId } = props;
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [clearEditor, setClearEditor] = useState(false);
	const [content, setContent] = useState<string>('');
	const [mentionData, setMentionData] = useState<ApiMessageMention[]>([]);
	const [attachmentData, setAttachmentData] = useState<ApiMessageAttachment[]>([]);
	const [showPlaceHolder, setShowPlaceHolder] = useState(false);
	const imagePlugin = createImagePlugin({ imageComponent: ImageComponent });
	const mentionPlugin = useRef(
		createMentionPlugin({
			entityMutability: 'IMMUTABLE',
			theme: editorStyles,
			mentionPrefix: '@',
			supportWhitespace: true,
			mentionTrigger: '@',
		}),
	);

	const plugins = [mentionPlugin.current, imagePlugin];
	//clear Editor after navigate channel
	useEffect(() => {
		setEditorState(EditorState.createEmpty());
	}, [currentChannelId, currentClanId]);

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
			const messageContent = Object.values(messageRaw)
				.filter((item) => item.text.trim() !== '')
				.map((item) => item.text);
			const messageBreakline = messageContent.join('\n').replace(/,/g, '');

			onConvertToFiles(messageBreakline);

			handleUrlInput(messageBreakline)
				.then((attachment) => {
					handleFinishUpload(attachment);
				})
				.catch(() => {
					setContent(content + messageBreakline);
				});

			const mentionedUsers = [];
			for (const key in raw.entityMap) {
				const ent = raw.entityMap[key];
				if (ent.type === 'mention') {
					mentionedUsers.push({
						user_id: ent.data.mention.id,
						username: ent.data.mention.name,
					});
				}
			}
			setMentionData(mentionedUsers);
		},
		[attachmentData],
	);

	const onConvertToFiles = useCallback(
		(content: string) => {
			if (content.length > 2000) {
				const fileContent = new Blob([content], { type: 'text/plain' });
				const now = Date.now();
				const filename = now + '.txt';
				const file = new File([fileContent], filename, { type: 'text/plain' });
				const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;

				const session = sessionRef.current;
				const client = clientRef.current;

				if (!client || !session || !currentChannelId) {
					throw new Error('Client is not initialized');
				}
				handleUploadFile(client, session, fullfilename, file)
					.then((attachment) => {
						handleFinishUpload(attachment);
						return 'handled';
					})
					.catch((err) => {
						return 'not-handled';
					});
				return;
			}
		},
		[attachmentData],
	);

	const handleFinishUpload = useCallback(
		(attachment: ApiMessageAttachment) => {
			let urlFile = attachment.url;
			if (attachment.filetype?.indexOf('pdf') !== -1) {
				urlFile = '/assets/images/pdficon.png';
			} else if (attachment.filetype?.indexOf('text') !== -1) {
				urlFile = '/assets/images/text.png';
			} else if (attachment.filetype?.indexOf('vnd.openxmlformats-officedocument.presentationml.presentation') !== -1) {
				urlFile = '/assets/images/pptfile.png';
			} else if (attachment.filetype?.indexOf('mp4') !== -1) {
				urlFile = '/assets/images/video.png';
			}

			const contentState = editorState.getCurrentContent();
			const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {
				src: urlFile,
				height: '20px',
				width: 'auto',
				onRemove: () => handleEditorRemove(),
			});
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

			const newEditorState = EditorState.push(editorState, contentStateWithEntity, 'insert-fragment');
			const newEditorStateWithImage = EditorState.forceSelection(
				newEditorState,
				newEditorState.getSelection().merge({
					anchorOffset: 0,
					focusOffset: 0,
				}),
			);
			const newStateWithImage = AtomicBlockUtils.insertAtomicBlock(newEditorStateWithImage, entityKey, ' ');
			setEditorState(newStateWithImage);

			attachmentData.push(attachment);
			setAttachmentData(attachmentData);
		},
		[attachmentData, content, editorState],
	);

	const onPastedFiles = useCallback(
		(files: Blob[]) => {
			const now = Date.now();
			const filename = now + '.png';
			const file = new File(files, filename, { type: 'image/png' });
			const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + filename;

			const session = sessionRef.current;
			const client = clientRef.current;

			if (!client || !session || !currentChannelId) {
				throw new Error('Client is not initialized');
			}
			handleUploadFile(client, session, fullfilename, file)
				.then((attachment) => {
					handleFinishUpload(attachment);
					return 'handled';
				})
				.catch((err) => {
					return 'not-handled';
				});

			return 'not-handled';
		},
		[attachmentData, clientRef, content, currentChannelId, currentClanId, editorState, sessionRef],
	);

	const handleEditorRemove = () => {
		const currentContentState = editorState.getCurrentContent();
		const newContentState = Modifier.applyEntity(currentContentState, editorState.getSelection(), null);
		const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');
		setEditorState(newEditorState);
	};

	// please no delete
	const editorDiv = document.getElementById('editor');
	const editorHeight = editorDiv?.clientHeight;
	document.documentElement.style.setProperty('--editor-height', (editorHeight && editorHeight - 10) + 'px');
	document.documentElement.style.setProperty('--bottom-emoji', (editorHeight && editorHeight + 25) + 'px');
	//

	const editorElement = document.getElementById('editor');
	useEffect(() => {
		const hasFigure = editorElement?.querySelector('figure');
		const firstChildHasBr = editorElement?.querySelector('br');
		if (hasFigure) {
			if (firstChildHasBr) {
				firstChildHasBr.style.display = 'none';
			}
		}
	}, [editorState]);

	const emojiListRef = useRef<HTMLDivElement>(null);
	const { setTextToSearchEmojiSuggesion } = useEmojiSuggestion();

	useEffect(() => {
		if (content) {
			setTextToSearchEmojiSuggesion(content);
		}
	}, [content]);

	return (
		<div className="relative">
			<div className="flex flex-inline w-max-[97%] items-end gap-2 box-content mb-4 bg-black rounded-md relative">
				<FileSelectionButton
					currentClanId={currentClanId || ''}
					currentChannelId={currentChannelId || ''}
					onFinishUpload={handleFinishUpload}
				/>
				<div className={`w-full bg-black gap-3 flex items-center`}>
					<div className={`w-[96%] bg-black gap-3 relative`}>
						<MentionReactInput listMentions={props.listMentions} onSend={props.onSend} onTyping={props.onTyping} />
					</div>
					<GifStickerEmojiButtons activeTab={SubPanelName.NONE} />
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
				<div className="flex flex-row h-full items-center gap-1 mr-2 w-12 rounded-r-lg">
					<Icons.Gif />
					<Icons.Help />
				</div>
			</form>
		</div>
	);
};

export default MessageBox;
