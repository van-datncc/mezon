import { useAttachments, useOnClickOutside } from '@mezon/core';
import { listClickImageInViewer } from '@mezon/ui';
import { RightClickList, notImplementForGifOrStickerSendFromPanel } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { Fragment, useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
};

function MessageImage({ attachmentData }: MessageImage) {
	const { setOpenModalAttachment, setAttachment } = useAttachments();
	const isDimensionsValid = attachmentData.height && attachmentData.width && attachmentData.height > 0 && attachmentData.width > 0;
	const checkImage = notImplementForGifOrStickerSendFromPanel(attachmentData);
	const imageRef = useRef<HTMLDivElement | null>(null);

	const handleClick = (url: string) => {
		if (!isDimensionsValid && !checkImage) {
			setOpenModalAttachment(true);
			setAttachment(url);
		}
		handleCloseMenu();
	};
	const imgStyle = {
		width: isDimensionsValid ? `${attachmentData.width}%` : undefined,
		height: isDimensionsValid ? `${attachmentData.height}%` : undefined,
	};

	const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [isMenuVisible, setMenuVisible] = useState(false);
	const handleContextMenu = (event: React.MouseEvent<HTMLImageElement>) => {
		event.preventDefault();
		setMenuPosition({ x: event.pageX, y: event.pageY });
		setMenuVisible(true);
	};

	const handleCloseMenu = () => {
		setMenuVisible(false);
	};

	useOnClickOutside(imageRef, handleCloseMenu);

	return (
		<div ref={imageRef} className="break-all" onContextMenu={handleContextMenu}>
			<img
				className={
					'max-w-[100%] max-h-[30vh] object-cover my-2 rounded ' + (!isDimensionsValid && !checkImage ? 'cursor-pointer' : 'cursor-default')
				}
				src={attachmentData.url?.toString()}
				alt={attachmentData.url}
				onClick={() => handleClick(attachmentData.url || '')}
				style={imgStyle}
			/>
			{isMenuVisible && (
				<ContextMenu
					urlData={attachmentData.url ?? ''}
					listMenu={listClickImageInViewer}
					x={menuPosition.x}
					y={menuPosition.y}
					onClose={handleCloseMenu}
				/>
			)}
		</div>
	);
}

export default MessageImage;

interface IContextMenuProps {
	x: number;
	y: number;
	onClose: () => void;
	listMenu: any;
	urlData: string;
}

const ContextMenu: React.FC<IContextMenuProps> = ({ x, y, onClose, listMenu, urlData }) => {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const menuRefHeight = menuRef.current && menuRef.current?.getBoundingClientRect().height;
	const WINDOW_HEIGHT = window.innerHeight;
	const distanceCursorToBottom = WINDOW_HEIGHT - y;
	const [topMenu, setTopMenu] = useState<any>();
	const [bottomMenu, setBottomMenu] = useState<any>();

	useEffect(() => {
		if (distanceCursorToBottom < menuRefHeight!) {
			setTopMenu('auto');
			setBottomMenu(30);
		} else {
			setTopMenu(y);
			setBottomMenu('auto');
		}
	}, [distanceCursorToBottom, menuRefHeight]);

	return (
		<div
			ref={menuRef}
			className="fixed h-[15rem]    bg-[#111214] rounded   z-50 w-[12rem]"
			style={{ top: topMenu, bottom: bottomMenu, left: x }}
			onClick={onClose}
		>
			<ul className="list-none m-0  p-2 ">
				{listMenu.map((item: any) => {
					return (
						<Fragment key={item.name}>
							<CopyToClipboard text={urlData}>
								<MenuItem urlData={urlData} item={item} />
							</CopyToClipboard>
						</Fragment>
					);
				})}
			</ul>
		</div>
	);
};

interface IMenuItem {
	item: any;
	urlData: string;
}

const MenuItem: React.FC<IMenuItem> = ({ item, urlData }) => {
	const [copied, setCopied] = useState<boolean>(true);
	const clickItem = () => {
		if (item.name === RightClickList.COPY_IMAGE) {
			return handleCopyImage(urlData);
		}
		if (item.name === RightClickList.SAVE_IMAGE) {
			return handleSaveImage();
		}
		if (item.name === RightClickList.COPY_LINK) {
			return handleCopyLink();
		}
		if (item.name === RightClickList.OPEN_LINK) {
			return handleOpenLink();
		}
	};

	const convertImageToBlobFile = async (urlData: string): Promise<Blob | null> => {
		try {
			const response = await fetch(urlData);
			const blob = await response.blob();
			return blob;
		} catch (error) {
			console.error('Error converting image to blob:', error);
			return null;
		}
	};

	const handleCopyImage = async (urlData: string) => {
		try {
			const blob = await convertImageToBlobFile(urlData);
			if (!blob) {
				console.error('Failed to fetch or convert image');
				return;
			}

			const file = new File([blob], 'image.png', { type: 'image/png' });
			if (navigator.clipboard && navigator.clipboard.write) {
				try {
					const clipboardItem = new ClipboardItem({ 'image/png': file });
					await navigator.clipboard.write([clipboardItem]);
				} catch (error) {
					console.error('Failed to write image to clipboard:', error);
				}
			} else {
				console.warn('Clipboard API not supported. Image data not copied.');
			}
		} catch (error) {
			console.error('Error fetching or converting image:', error);
		}
	};

	const handleSaveImage = () => {
		console.log('saveImage');
	};
	const handleCopyLink = () => {
		
	};
	const handleOpenLink = () => {
		window.open(urlData);
	};

	return (
		<CopyToClipboard text={urlData} onCopy={handleCopyLink}>
			<span
				onClick={clickItem}
				className="flex justify-between items-center text-sm pl-1 py-1
				cursor-pointer rounded-sm text-[#81858A] hover:text-[#FFFFFF] 
				dark:hover:bg-[#4B5CD6] hover:bg-bgLightModeButton font-medium"
			>
				<span className="w-[90%]">{item.name}</span>
				<span className="w-[10%] flex justify-end mr-1">{item.symbol}</span>
			</span>
		</CopyToClipboard>
	);
};
