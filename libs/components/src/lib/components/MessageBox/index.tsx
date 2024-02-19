import { IMessage } from '@mezon/utils';
import { useCallback, useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import * as Icons from '../Icons';

export type MessageBoxProps = {
	onSend: (mes: IMessagePayload) => void;
	onTyping?: () => void;
};

export type IMessagePayload = IMessage & {
	channelId: string;
};

function MessageBox(props: MessageBoxProps) {
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

	const handleInputChanged = useCallback(
		(event: React.FormEvent<HTMLDivElement>) => {
			const updatedContent = (event.currentTarget as HTMLDivElement).innerHTML;
			const sanitizedContent = sanitizeContent(updatedContent);
			setContent(sanitizedContent);
		},
		[handleKeyDown, content, setContent],
	);

	const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
		event.preventDefault();
		const clipboardData = event.clipboardData.getData('text/plain');
		setContent(clipboardData);
	};

	const handleTyping = useCallback(() => {
		if (typeof onTyping === 'function') {
			onTyping();
		}
	}, [onTyping]);

	const contentEditableRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(contentEditableRef.current as any);
		range.collapse(false);
		selection?.removeAllRanges();
		selection?.addRange(range);
	}, [content]);

	const [placeholderVisible, setPlaceholderVisible] = useState(true);
	useEffect(() => {
		const hasContent = contentEditableRef?.current;
		const contentLength = hasContent?.textContent?.trim().length;
		if (contentLength && contentLength > 0) {
			setPlaceholderVisible(!hasContent);
		} else {
			setPlaceholderVisible(true);
		}
	}, [content]);
	return (
		<div className="self-stretch h-fit px-4 mb-[8px] mt-[8px] flex-col justify-end items-start gap-2 flex overflow-hidden">
			<form className="self-stretch p-4 bg-neutral-950  rounded-lg justify-start gap-3 inline-flex items-center ">
				<div>
					<div className="flex flex-row justify-end h-fit">
						<Icons.AddCircle />
					</div>
				</div>

				<div className="grow self-stretch justify-start items-center gap-2 flex relative ml-1">
					{placeholderVisible && (
						<div
							className="absolute pointer-events-none select-none text-[#ABABAB]"
							style={{ top: '50%', transform: 'translateY(-50%)' }}
						>
							Write your thoughts here...
						</div>
					)}

						<div
							contentEditable
							ref={contentEditableRef}
							className="grow flex-wrap text-white text-sm font-['Manrope'] placeholder-[#AEAEAE] h-fit border-none focus:border-none outline-none bg-transparent overflow-y-auto w-widChatBoxBreak resize-none"
							id="message"
							onInput={handleInputChanged}
							onFocus={handleTyping}
							onBlur={handleInputChanged}
							onChange={handleInputChanged}
							dangerouslySetInnerHTML={{ __html: content }}
							onKeyDown={handleKeyDown}
							onPaste={handlePaste}
						/>
				</div>
				<div>
					<div className="flex flex-row gap-1">
						<Icons.Gif />
						<Icons.Help />
					</div>
				</div>
			</form>
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
				<div className="flex flex-row h-full items-center gap-1">
					<Icons.Gif />
					<Icons.Help />
				</div>
			</form>
		</div>
	);
};

export default MessageBox;
