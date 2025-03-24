/* eslint-disable jsx-a11y/accessible-emoji */
import { useAppNavigation } from '@mezon/core';
import {
	channelAppActions,
	channelsActions,
	getStore,
	selectAppChannelsList,
	selectAppChannelsListShowOnPopUp,
	selectAppFocusedChannel,
	selectChannelById,
	selectCheckAppFocused,
	selectCurrentClanId,
	selectEnableCall,
	selectEnableMic,
	selectGetRoomId,
	selectPostionPopupApps,
	selectSizePopupApps,
	selectToCheckAppIsOpening,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ApiChannelAppResponseExtend, useWindowSize } from '@mezon/utils';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChannelApps } from '../ChannelApp';

import React from 'react';
export const POPUP_HEIGHT_COLLAPSE = 48;

type DraggableModalTabsProps = {
	appChannelList: ApiChannelAppResponseExtend[];
	onCollapseToggle?: () => void;
	isCollapsed?: boolean;
	handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onFullSizeToggle?: () => void;
	isFullSize?: boolean;
};

const DraggableModalTabs: React.FC<DraggableModalTabsProps> = ({
	appChannelList,
	onCollapseToggle,
	isCollapsed,
	handleMouseDown,
	onFullSizeToggle,
	isFullSize
}) => {
	const dispatch = useAppDispatch();
	const store = getStore();

	const handleOnCloseCallback = useCallback(
		(event: React.MouseEvent, clanId: string, channelId: string) => {
			event.stopPropagation();

			dispatch(
				channelsActions.removeAppChannelsListShowOnPopUp({
					clanId,
					channelId
				})
			);
		},
		[dispatch]
	);

	const handleFocused = useCallback(
		(event: React.MouseEvent, app: ApiChannelAppResponseExtend) => {
			event.stopPropagation();
			dispatch(channelsActions.setAppChannelFocus({ app: app as ApiChannelAppResponseExtend }));
		},
		[dispatch]
	);

	const handleCloseAllTabs = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();

			const curClanId = selectCurrentClanId(store.getState());
			dispatch(channelsActions.resetAppChannelsListShowOnPopUp({ clanId: curClanId as string }));
		},
		[dispatch]
	);

	const handlePlusClick = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();

			const clanId = selectCurrentClanId(store.getState());
			const timestamp = Date.now().toString();
			const blankApp: ApiChannelAppResponseExtend = {
				clan_id: clanId as string,
				channel_id: timestamp,
				app_id: timestamp,
				id: timestamp,
				isBlank: true
			};

			dispatch(
				channelsActions.setAppChannelsListShowOnPopUp({
					clanId: blankApp.clan_id as string,
					channelId: blankApp.channel_id as string,
					appChannel: blankApp
				})
			);
		},
		[dispatch]
	);

	const { navigate, toChannelPage } = useAppNavigation();

	const onBack = useCallback(
		(event: React.MouseEvent, channelId?: string, clanId?: string) => {
			event.stopPropagation();

			const channelPath = toChannelPage(channelId as string, clanId as string);
			navigate(channelPath);
		},
		[toChannelPage, navigate]
	);

	return (
		<div onMouseDown={handleMouseDown} className="flex items-center justify-between bg-[#1E1F22] z-50">
			{/* close_button */}
			<div className="w-[60px] h-[48px] justify-center bg-transparent flex items-center">
				<button
					onClick={(event) => handleCloseAllTabs(event)}
					title="Close all tabs"
					className="left-0 flex items-center justify-center text-[#B5BAC1] text-sm font-bold rounded-full w-[30px] h-[30px] bg-gray-800"
				>
					✕
				</button>
			</div>
			<div className={`flex items-center flex-1 overflow-x-auto scrollbar-hide h-[${POPUP_HEIGHT_COLLAPSE}px]`}>
				{appChannelList.map((app) => (
					<DraggableModalTabItem
						key={app.app_id}
						app={app}
						handleFocused={handleFocused}
						onBack={onBack}
						handleOnCloseCallback={handleOnCloseCallback}
					/>
				))}
				<div className="w-[60px] h-[48px] justify-center bg-transparent flex items-center">
					{' '}
					<button
						onClick={(event) => handlePlusClick(event)}
						title="Open new tab"
						className="left-0 flex items-center justify-center text-[#B5BAC1] text-sm font-bold rounded-full w-[30px] h-[30px] bg-gray-800 rotate-45"
					>
						✕
					</button>
				</div>
			</div>
			<div className="w-[60px] h-[48px] justify-center bg-transparent flex items-center right-3">
				<button
					onClick={onCollapseToggle}
					title={isCollapsed ? 'Expand tabs' : 'Collapse tabs'}
					className="left-0 flex items-center justify-center text-[#B5BAC1] text-sm  rounded-full w-[30px] h-[30px]"
				>
					{isCollapsed ? '▼' : '▲'}
				</button>
				<button
					onClick={onFullSizeToggle}
					title={isFullSize ? 'Exit Full Screen' : 'Enter Full Screen'}
					className="left-0 flex items-center justify-center text-[#B5BAC1] text-sm rounded-full w-[30px] h-[30px]"
				>
					{isFullSize ? '🗗' : '⛶'}
				</button>
			</div>
		</div>
	);
};

interface DraggableModalTabItemProps {
	app: ApiChannelAppResponseExtend;
	handleFocused: (event: React.MouseEvent<HTMLDivElement>, app: ApiChannelAppResponseExtend) => void;
	onBack: (event: React.MouseEvent<HTMLButtonElement>, channelId: string, clanId: string) => void;
	handleOnCloseCallback: (event: React.MouseEvent<HTMLButtonElement>, clanId: string, channelId: string) => void;
}

const DraggableModalTabItem: React.FC<DraggableModalTabItemProps> = ({ app, handleFocused, onBack, handleOnCloseCallback }) => {
	const dispatch = useDispatch();
	const store = getStore();
	const isFocused = selectCheckAppFocused(store.getState(), app?.channel_id as string);
	const channel = selectChannelById(store.getState(), app?.channel_id as string);
	const roomId = useAppSelector((state) => selectGetRoomId(state, app?.channel_id));
	const isJoinVoice = useSelector(selectEnableCall);
	const isTalking = useSelector(selectEnableMic);
	return (
		<div onClick={(event) => handleFocused(event, app as ApiChannelAppResponseExtend)}>
			<div
				title={channel?.channel_label}
				className={`rounded-t-xl flex items-center transition-all duration-300 ease-in-out relative gap-2 ${
					isFocused ? 'w-fit min-w-[270px] px-2 pr-8 bg-black' : 'w-[60px] justify-center bg-transparent'
				} h-[48px]`}
			>
				{/* Avatar */}
				<span className="text-white text-xs font-bold w-[30px] h-[30px] bg-slate-800 flex justify-center items-center rounded-full">
					{(channel?.channel_label || 'New tab').charAt(0).toLocaleUpperCase()}
				</span>

				{isFocused && <span className="text-white text-sm font-medium truncate max-w-[120px]">{channel?.channel_label || 'New tab'}</span>}
				{isFocused && (
					<div className="flex flex-row items-center gap-2 absolute right-2">
						{roomId && (
							<div
								className="flex justify-between items-center gap-2 text-sm text-white"
								onMouseEnter={(event) => event.stopPropagation()}
							>
								<button
									onClick={() => {
										dispatch(channelAppActions.setEnableCall(!isJoinVoice));
										if (isJoinVoice) {
											dispatch(channelAppActions.setEnableVoice(false));
											dispatch(channelAppActions.setRoomToken(undefined));
										}
									}}
								>
									{isJoinVoice ? (
										<Icons.StopCall className="size-4 text-red-600" />
									) : (
										<Icons.StartCall className="size-3 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
									)}
								</button>
								{isJoinVoice && (
									<button onClick={() => dispatch(channelAppActions.setEnableVoice(!isTalking))}>
										{isTalking ? (
											<Icons.MicDisable className="size-4 text-red-600" />
										) : (
											<Icons.MicEnable className="size-4 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
										)}
									</button>
								)}
							</div>
						)}
						{Boolean(app.isBlank) === false && (
							<button
								onClick={(e) => onBack(e, app.channel_id as string, app.clan_id as string)}
								className="flex items-center justify-center text-[#B5BAC1] text-sm hover:text-white transition"
								title="Back"
							>
								↩
							</button>
						)}

						<button
							title="Close"
							onClick={(e) => handleOnCloseCallback(e, app.clan_id as string, app.channel_id as string)}
							className="flex items-center justify-center text-[#B5BAC1] text-sm hover:text-white transition"
						>
							✕
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

type ModalContentProps = {
	isCollapsed: boolean;
	appChannelList: ApiChannelAppResponseExtend[];
};

const ModalContent: React.FC<ModalContentProps> = memo(({ isCollapsed, appChannelList }) => {
	const contentStyle = isCollapsed ? { height: 0, visibility: 'hidden' as const } : {};
	const store = getStore();

	return (
		<div className="relative w-full h-full">
			{appChannelList?.map((appChannel) => {
				const isFocused = selectCheckAppFocused(store.getState(), appChannel.channel_id as string);

				return (
					<div
						key={appChannel.channel_id}
						className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out ${
							isFocused ? 'z-10 opacity-100' : 'z-0 opacity-0'
						}`}
						style={contentStyle}
					>
						{appChannel?.isBlank ? <BlankChannelComponent /> : <ChannelApps appChannel={appChannel} />}
					</div>
				);
			})}
		</div>
	);
});

const BlankChannelComponent: React.FC = () => {
	const appsList = useSelector(selectAppChannelsList);
	const dispatch = useDispatch();
	const store = getStore();

	const onClickAppItem = (app: ApiChannelAppResponseExtend) => {
		const appIsOpening = selectToCheckAppIsOpening(store.getState(), app.channel_id as string);
		const getAppFocused = selectAppFocusedChannel(store.getState());

		if (appIsOpening) {
			dispatch(channelsActions.setAppChannelFocus({ app: app as ApiChannelAppResponseExtend }));
		} else {
			dispatch(
				channelsActions.replaceAppChannelsListShowOnPopUp({
					clanId: getAppFocused?.clan_id as string,
					channelId: getAppFocused?.channel_id as string,
					newApp: app
				})
			);
		}
	};

	return (
		<div className="flex justify-center flex-col w-full h-full bg-[#313338] text-gray-500 border border-gray-800">
			{/* Search Bar */}
			<div className="px-4 py-3 w-full">
				<div className="bg-gray-800 rounded-full flex items-center px-4 py-2">
					<input type="text" placeholder="Search Apps" className="bg-transparent border-none outline-none text-white w-full" />
				</div>
			</div>

			{/* Apps List */}
			<div className="w-full flex flex-wrap gap-4 px-4 justify-center">
				{appsList.map((app) => {
					const channel = selectChannelById(store.getState(), app.channel_id as string);

					return (
						<div key={app.channel_id} className="flex flex-col items-center">
							<button
								onClick={() => onClickAppItem(app as ApiChannelAppResponseExtend)}
								className="w-16 h-16 flex items-center justify-center bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all duration-200"
								title={app.url || 'Unnamed App'}
							>
								🌐
							</button>
							<span>{channel?.channel_label || 'Unknown'}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

type ResizeHandlesProps = {
	handleResizeMouseDown: (dir: string) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const ResizeHandles: React.FC<ResizeHandlesProps> = memo(({ handleResizeMouseDown }) => (
	<>
		<div className="absolute top-0 left-1 w-[calc(100%-8px)] h-1 cursor-n-resize z-50 " onMouseDown={handleResizeMouseDown('top')} />
		<div className="absolute bottom-0 left-1 w-[calc(100%-8px)] h-1 cursor-s-resize z-50 " onMouseDown={handleResizeMouseDown('bottom')} />
		<div className="absolute left-0 top-1 h-[calc(100%-8px)] w-1 cursor-w-resize z-50 " onMouseDown={handleResizeMouseDown('left')} />
		<div className="absolute right-0 top-1 h-[calc(100%-8px)] w-1 cursor-e-resize z-50 " onMouseDown={handleResizeMouseDown('right')} />
		<div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50 " onMouseDown={handleResizeMouseDown('bottom-right')} />
		<div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50 " onMouseDown={handleResizeMouseDown('bottom-left')} />
		<div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50 " onMouseDown={handleResizeMouseDown('top-right')} />
		<div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50 " onMouseDown={handleResizeMouseDown('top-left')} />
	</>
));

interface DraggableModalProps {
	initialWidth?: number;
	initialHeight?: number;
	aspectRatio?: number | null;
}

const DraggableModal: React.FC<DraggableModalProps> = memo(({ initialWidth = 430, initialHeight = 630, aspectRatio = null }) => {
	const appChannelList = useSelector(selectAppChannelsListShowOnPopUp);
	const isShowModal = appChannelList && appChannelList.length > 0;
	const modalRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();

	const position = useSelector(selectPostionPopupApps);
	const size = useSelector(selectSizePopupApps);

	const [isDragging, setIsDragging] = useState(false);
	const [resizeDir, setResizeDir] = useState<string | null>(null);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isInteracting, setIsInteracting] = useState(false);
	const [isFullSize, setIsFullSize] = useState(false);
	const { height, width } = useWindowSize();

	const onFullSizeToggle = useCallback(() => {
		setIsFullSize((prev) => {
			const newSize = prev ? { width: initialWidth, height: initialHeight } : { width, height };

			const newPosition = prev ? { x: 100, y: 100 } : { x: 0, y: 0 };
			dispatch(channelAppActions.setSize(newSize));
			dispatch(channelAppActions.setPosition(newPosition));

			return !prev;
		});
	}, [width, height, initialWidth, initialHeight]);

	const onCollapseToggle = useCallback(() => {
		setIsCollapsed((prev) => {
			const newHeight = prev ? size.height : 30;
			const newWidth = prev ? size.width : 240;
			dispatch(channelAppActions.setSize({ height: newHeight, width: newWidth }));
			return !prev;
		});
	}, [initialHeight, initialWidth]);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging && !resizeDir) return;
			setIsInteracting(true);

			if (isDragging) {
				dispatch(
					channelAppActions.setPosition({
						x: Math.min(Math.max(position.x + e.movementX, 0), width - size.width),
						y: Math.min(Math.max(position.y + e.movementY, 0), height - size.height)
					})
				);
			} else if (resizeDir) {
				let newWidth = size.width;
				let newHeight = size.height;
				let newX = position.x;
				let newY = position.y;

				const isCorner = resizeDir.includes('-');
				const shouldMaintainAspect = aspectRatio && isCorner;

				if (resizeDir.includes('right')) {
					newWidth = Math.min(Math.max(initialWidth, size.width + e.movementX), width - position.x);
				}
				if (resizeDir.includes('left')) {
					newWidth = Math.min(Math.max(initialWidth, size.width - e.movementX), width - newX);
					newX = Math.min(Math.max(newX + e.movementX, 0), width - newWidth);
				}
				if (resizeDir.includes('bottom')) {
					newHeight = Math.min(Math.max(initialHeight, size.height + e.movementY), height - position.y);
				}
				if (resizeDir.includes('top')) {
					newHeight = Math.min(Math.max(initialHeight, size.height - e.movementY), height - newY);
					newY = Math.min(Math.max(newY + e.movementY, 0), height - newHeight);
				}

				if (shouldMaintainAspect && aspectRatio) {
					newHeight = newWidth / aspectRatio;
					if (resizeDir === 'top-left' || resizeDir === 'top-right') {
						newY = position.y + (size.height - newHeight);
					}
				}

				dispatch(channelAppActions.setSize({ width: newWidth, height: newHeight }));
				dispatch(channelAppActions.setPosition({ x: newX, y: newY }));
			}
		},
		[isDragging, resizeDir, width, height, size, position, aspectRatio]
	);

	// setBound and re-set Position when the size of window changed
	useEffect(() => {
		dispatch(
			channelAppActions.setPosition({
				x: Math.min(Math.max(position.x, 0), width - size.width),
				y: Math.min(Math.max(position.y, 0), height - size.height)
			})
		);
	}, [height, width, isCollapsed]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsDragging(true);
		setIsInteracting(true);
	}, []);

	const handleResizeMouseDown = useCallback((direction: string) => {
		return (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setResizeDir(direction);
			setIsInteracting(true);
		};
	}, []);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
		setResizeDir(null);
		setTimeout(() => setIsInteracting(false), 200);
	}, []);

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);
	const isContentStrict = !isCollapsed ? 'contain-strict' : '';
	return (
		// eslint-disable-next-line react/jsx-no-useless-fragment
		<>
			{isShowModal && (
				<div className=" relative z-50">
					<div
						ref={modalRef}
						className={`absolute bg-[#212121] shadow-lg rounded-xl   ${isContentStrict} `}
						style={{
							left: `${position.x}px`,
							top: `${position.y}px`,
							width: `${size.width}px`,
							height: `${size.height}px`,
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						{isInteracting && <Overlay />}

						<DraggableModalTabs
							appChannelList={appChannelList}
							onCollapseToggle={onCollapseToggle}
							isCollapsed={isCollapsed}
							handleMouseDown={handleMouseDown}
							onFullSizeToggle={onFullSizeToggle}
							isFullSize={isFullSize}
						/>
						<ModalContent isCollapsed={isCollapsed} appChannelList={appChannelList as ApiChannelAppResponseExtend[]} />
						{!isCollapsed && <ResizeHandles handleResizeMouseDown={handleResizeMouseDown} />}
					</div>
				</div>
			)}
		</>
	);
});

export default DraggableModal;

const Overlay: React.FC = () => {
	return (
		<div
			className="absolute inset-0  bg-transparent z-50 cursor-pointer rounded-b-lg "
			style={{ top: `${POPUP_HEIGHT_COLLAPSE}`, height: `calc(100% - ${POPUP_HEIGHT_COLLAPSE})` }}
		/>
	);
};
