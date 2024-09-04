import { useAttachments } from '@mezon/core';
import {
	selectAttachment,
	selectAttachmentPhoto,
	selectCurrentChannel,
	selectMessageIdAttachment,
	selectModeAttachment,
	selectOpenModalAttachment
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { SHOW_POSITION } from '@mezon/utils';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MessageContextMenuProps, useMessageContextMenu } from '../../ContextMenu';
import ListAttachment from './listAttachment';

const MessageModalImage = () => {
	const [scale, setScale] = useState(1);
	const [rotate, setRotate] = useState(0);

	const [showList, setShowList] = useState(true);
	const attachments = useSelector(selectAttachmentPhoto());
	const { setOpenModalAttachment } = useAttachments();
	const openModalAttachment = useSelector(selectOpenModalAttachment);
	const attachment = useSelector(selectAttachment);
	const [urlImg, setUrlImg] = useState(attachment);
	const [currentIndexAtt, setCurrentIndexAtt] = useState(attachments.findIndex((img) => img.url === urlImg));
	const attLength = attachments.length;
	const checkNumberAtt = attLength > 1;
	const { showMessageContextMenu, setPositionShow, setImageURL, imageSrc } = useMessageContextMenu();

	const mode = useSelector(selectModeAttachment);
	const messageId = useSelector(selectMessageIdAttachment);

	const handleShowList = () => {
		setShowList(!showList);
	};

	useEffect(() => {
		setShowList(true);
		setScale(1);
		setUrlImg(attachment);
	}, [openModalAttachment]);

	const handleDrag = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleWheel = (event: any) => {
		const deltaY = event.deltaY;
		setScale((prevScale) => {
			const newScale = deltaY > 0 ? Math.max(1, prevScale - 0.05) : Math.min(5, prevScale + 0.05);
			return newScale;
		});
		if (scale === 1) {
			setPosition({
				x: 0,
				y: 0
			});
		}
	};

	const closeModal = () => {
		setOpenModalAttachment(false);
		setPositionShow(SHOW_POSITION.NONE);
		setImageURL('');
	};

	const handleContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, props?: Partial<MessageContextMenuProps>) => {
			showMessageContextMenu(event, messageId, mode ?? 2, props);
			setPositionShow(SHOW_POSITION.IN_VIEWER);
			setImageURL(urlImg);
		},
		[showMessageContextMenu, messageId, mode, setPositionShow, setImageURL, urlImg]
	);

	const handleKeyDown = (event: any) => {
		if (event.key === 'Escape') {
			console.log('close view img');
			closeModal();
		}
		if (event.key === 'ArrowUp') {
			const newIndex = currentIndexAtt > 0 ? currentIndexAtt - 1 : attLength - 1;
			setUrlImg(attachments[newIndex]?.url || '');
		}
		if (event.key === 'ArrowDown') {
			const newIndex = currentIndexAtt < attLength - 1 ? currentIndexAtt + 1 : 0;
			setUrlImg(attachments[newIndex]?.url || '');
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);

		setCurrentIndexAtt(attachments.findIndex((img) => img.url === urlImg));

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [urlImg, currentIndexAtt]);

	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const handleMouseDown = (event: any) => {
		setDragging(true);
		setDragStart({
			x: event.clientX - position.x,
			y: event.clientY - position.y
		});
	};

	const handleMouseMove = (event: any) => {
		if (dragging && scale !== 1) {
			setPosition({
				x: event.clientX - dragStart.x,
				y: event.clientY - dragStart.y
			});
		}
	};

	const handleMouseUp = () => {
		setDragging(false);
	};

	const currentChannel = useSelector(selectCurrentChannel);

	const handleRotateImg = (direction: 'LEFT' | 'RIGHT') => {
		if (direction === 'LEFT') {
			setRotate(rotate - 90);
		} else {
			setRotate(rotate + 90);
		}
	};

	return (
		<div className="justify-center items-center flex flex-col fixed z-50 inset-0 outline-none focus:outline-none dark:bg-black bg-white dark:text-white text-colorTextLightMode">
			<div className="flex justify-center items-center bg-[#2e2e2e] w-full h-[30px] relative">
				<div>{currentChannel?.channel_label}</div>
				<div onClick={closeModal} className="w-4 absolute right-2 top-2 cursor-pointer">
					<Icons.MenuClose className="text-white w-full" />
				</div>
			</div>
			<div className="flex w-full h-[calc(100vh_-_30px_-_56px)]">
				<div className="flex-1 flex justify-center items-center p-5 overflow-hidden h-full w-full">
					<img
						src={urlImg}
						alt={urlImg}
						className="md:max-h-[90vh] max-h-full object-contain rounded-[10px] cursor-default h-fit"
						onDragStart={handleDrag}
						onWheel={handleWheel}
						onMouseUp={handleMouseUp}
						onMouseMove={handleMouseMove}
						onMouseDown={handleMouseDown}
						onMouseLeave={handleMouseUp}
						style={{
							transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px) rotate-[${rotate}deg]`,
							transition: `${dragging ? '' : 'transform 0.2s ease'}`
						}}
						onContextMenu={handleContextMenu}
					/>
				</div>
				{/* {checkNumberAtt && (
				<button
					className={`bg-[#AEAEAE] w-[30px] h-[30px] rounded-[50px] font-bold transform hover:scale-105 hover:bg-slate-400 transition duration-300 ease-in-out absolute flex justify-center items-center ${showList ? 'md:-rotate-90 md:top-5 md:right-[200px] md:left-auto left-5 bottom-[110px]' : 'md:rotate-90 md:top-[72px] md:right-5 md:left-auto rotate-180 left-5 bottom-5'}`}
					onClick={handleShowList}
				>
					<Icons.ArrowDown defaultFill="white" defaultSize="w-[20px] h-[30px]" />
				</button>
			)} */}
				{showList && checkNumberAtt && (
					<ListAttachment
						attachments={attachments}
						urlImg={urlImg}
						setUrlImg={setUrlImg}
						handleDrag={handleDrag}
						setScale={setScale}
						setPosition={setPosition}
					/>
				)}
			</div>
			<div className="h-14 flex px-4 w-full items-center">
				<div className="flex-1 flex items-center">
					<div className="flex gap-2">
						<div className="w-10 aspect-square object-cover">
							<img
								src="https://steamuserimages-a.akamaihd.net/ugc/1667980019599930485/F57B5D6531681D2C2CB8090EBA30F734F1412017/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
								alt="user-avatar"
								className="w-full rounded-full"
							/>
						</div>
						<div className="flex flex-col justify-between">
							<div className="text-[14px] font-semibold">Anh.TranTruong</div>
							<div className="text-[12px]">Today at 11:37</div>
						</div>
					</div>
				</div>
				<div className="flex-1 gap-3 text-white flex items-center justify-center">
					<div className="p-2 hover:bg-[#434343] rounded-md cursor-pointer" onClick={() => handleRotateImg('LEFT')}>
						<Icons.RotateLeftIcon className="w-5" />
					</div>
					<div className="p-2 hover:bg-[#434343] rounded-md cursor-pointer" onClick={() => handleRotateImg('RIGHT')}>
						<Icons.RotateRightIcon className="w-5" />
					</div>
					<div className="">
						<Icons.StraightLineIcon className="w-5" />
					</div>
					<div className="p-2 hover:bg-[#434343] rounded-md cursor-pointer">
						<Icons.ZoomIcon className="w-5" />
					</div>
					<div className="p-2 hover:bg-[#434343] rounded-md cursor-pointer">
						<Icons.AspectRatioIcon className="w-5" />
					</div>
				</div>
				<div className="flex-1 flex justify-end">
					<div className="p-2 hover:bg-[#434343] rounded-md cursor-pointer">
						<Icons.SideMenuIcon className="w-5" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageModalImage;
