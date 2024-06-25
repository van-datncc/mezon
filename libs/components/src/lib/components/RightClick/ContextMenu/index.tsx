import { useAuth, useClans, useRightClick } from '@mezon/core';
import { selectCurrentChannel, selectMessageByMessageId, selectPinMessageByChannelId } from '@mezon/store';
import {
	deleteMessageList,
	editMessageList,
	imageList,
	linkList,
	listClickDefault,
	pinMessageList,
	removeAllReactionList,
	removeReactionList,
	reportMessageList,
	speakMessageList,
	unPinMessageList,
	viewReactionList,
} from '@mezon/ui';
import { RightClickPos } from '@mezon/utils';
import { selectPosClickingActive } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '../ItemContextMenu';
interface IContextMenuProps {
	onClose: () => void;
	urlData: string;
	mode:number
}

const ContextMenu: React.FC<IContextMenuProps> = ({ onClose, urlData, mode }) => {
	const posClick = useSelector(selectPosClickingActive);
	const { rightClickXy } = useRightClick();
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [topMenu, setTopMenu] = useState<number | 'auto'>('auto');
	const [bottomMenu, setBottomMenu] = useState<number | 'auto'>('auto');
	const [rightMenu, setRightMenu] = useState<number | 'auto'>('auto');
	const [leftMenu, setLeftMenu] = useState<number | 'auto'>('auto');
	const WINDOW_HEIGHT = window.innerHeight;
	const WINDOW_WIDTH = window.innerWidth;
	const { getMessageIdRightClicked } = useRightClick();
	const getMessageRclicked = useSelector(selectMessageByMessageId(getMessageIdRightClicked));
	const listPinMessages = useSelector(selectPinMessageByChannelId(getMessageRclicked.channel_id));
	const messageExists = listPinMessages.some((pinMessage) => pinMessage.message_id === getMessageRclicked.id);

	const messageRClicked = useSelector(selectMessageByMessageId(getMessageIdRightClicked));
	const { currentClan } = useClans();
	const { userId } = useAuth();
	const [listTextToMatch, setListTextToMatch] = useState<any[]>(listClickDefault);

	useLayoutEffect(() => {
		if (messageRClicked) {
			const checkOwnerClan = currentClan?.creator_id === userId;
			const checkOwnerMessage = messageRClicked.sender_id === userId;
			const checkMessHasReaction = messageRClicked.reactions && messageRClicked.reactions?.length > 0;
			const checkMessHasText = messageRClicked.content.t !== '';
			if (checkOwnerClan) {
				let combineOwnerClan: any[] = [];
				if (messageExists) {
					combineOwnerClan = [...listClickDefault, ...unPinMessageList];
				} else {
					combineOwnerClan = [...listClickDefault, ...pinMessageList];
				}
				setListTextToMatch(combineOwnerClan);
				if (checkOwnerMessage) {
					const combineOwnerMessage = [...combineOwnerClan, ...editMessageList, ...deleteMessageList];
					setListTextToMatch(combineOwnerMessage);
					if (checkMessHasReaction) {
						const combineHasReaction = [...combineOwnerMessage, ...viewReactionList, ...removeReactionList, ...removeAllReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					}
				} else if (!checkOwnerMessage) {
					const combineNoOwnerMessage = [...listClickDefault, ...reportMessageList, ...deleteMessageList];
					setListTextToMatch(combineNoOwnerMessage);
					if (checkMessHasReaction) {
						const combineHasReaction = [...combineNoOwnerMessage, ...viewReactionList, ...removeReactionList, ...removeAllReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction) {
						let combineNotReaction: any[] = [];
						if (messageExists) {
							combineNotReaction = [...combineNoOwnerMessage, ...unPinMessageList];
						} else {
							combineNotReaction = [...combineNoOwnerMessage, ...pinMessageList];
						}
						setListTextToMatch(combineNotReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineNotReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					}
				}
			} else if (!checkOwnerClan) {
				const combineNoOwnerClan = [...listClickDefault];
				setListTextToMatch(combineNoOwnerClan);
				if (checkOwnerMessage) {
					const combineOwnerMessage = [...combineNoOwnerClan, ...deleteMessageList, ...editMessageList];
					setListTextToMatch(combineOwnerMessage);
					if (checkMessHasReaction) {
						const combineHasReaction = [...combineOwnerMessage, ...viewReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction) {
						const combineNotReaction = [...combineOwnerMessage];
						setListTextToMatch(combineNotReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineNotReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					}
				} else if (!checkOwnerMessage) {
					const combineNoOwnerMessage = [...listClickDefault, ...reportMessageList];
					setListTextToMatch(combineNoOwnerMessage);
					if (checkMessHasReaction) {
						const combineHasReaction = [...combineNoOwnerMessage, ...viewReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction) {
						const combineNotReaction = [...combineNoOwnerMessage];
						setListTextToMatch(combineNotReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineNotReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					}
				}
			}
		}
	}, [messageRClicked,messageExists]);

	useLayoutEffect(() => {
		const menuRefHeight = menuRef.current?.getBoundingClientRect().height || 0;
		const menuRefWidth = menuRef.current?.getBoundingClientRect().width || 0;
		const distanceCursorToBottom = WINDOW_HEIGHT - rightClickXy?.y;
		const distanceCursorToRight = WINDOW_WIDTH - rightClickXy?.x;

		if (menuRefHeight && menuRefWidth) {
			const isBottomLimit = distanceCursorToBottom < menuRefHeight;
			const isRightLimit = distanceCursorToRight < menuRefWidth;

			if (isBottomLimit && isRightLimit) {
				setTopMenu('auto');
				setBottomMenu(60);
				setLeftMenu('auto');
				setRightMenu(60);
			} else if (!isBottomLimit && isRightLimit) {
				setTopMenu(rightClickXy.y);
				setBottomMenu('auto');
				setLeftMenu('auto');
				setRightMenu(60);
			} else if ((isBottomLimit && !isRightLimit) || (menuRefHeight < 250 && distanceCursorToBottom < 350)) {
				setTopMenu('auto');
				setBottomMenu(60);
				setLeftMenu(rightClickXy.x);
				setRightMenu('auto');
			} else if (!isBottomLimit && !isRightLimit) {
				setTopMenu(rightClickXy.y);
				setBottomMenu(60);
				setLeftMenu(rightClickXy.x);
				setRightMenu('auto');
			}
		}
	}, [rightClickXy, WINDOW_HEIGHT, WINDOW_WIDTH, getMessageIdRightClicked]);

	function sortListById(arrayList: any[]) {
		return arrayList.sort((a, b) => a.id - b.id);
	}

	return (
		<>
			{' '}
			{messageRClicked !== undefined && (
				<div
					ref={menuRef}
					className="fixed h-fit flex flex-col bg-[#111214] rounded z-40 w-[12rem] p-2"
					style={{ top: topMenu, bottom: bottomMenu, left: leftMenu, right: rightMenu }}
					onClick={onClose}
				>
					{sortListById(listTextToMatch)?.map((item: any) => {
						return <MenuItem mode={mode} urlData={urlData} item={item} key={item.name} />;
					})}
					{posClick === RightClickPos.IMAGE_ON_CHANNEL && <hr className=" border-t-[#2E2F34]  my-2"></hr>}
					{posClick === RightClickPos.IMAGE_ON_CHANNEL &&
						imageList.map((item: any) => {
							return <MenuItem mode={mode} urlData={urlData} item={item} key={item.name} />;
						})}
					{posClick === RightClickPos.IMAGE_ON_CHANNEL && <hr className=" border-t-[#2E2F34]  my-2"></hr>}
					{posClick === RightClickPos.IMAGE_ON_CHANNEL &&
						linkList.map((item: any) => {
							return <MenuItem mode={mode} urlData={urlData} item={item} key={item.name} />;
						})}
				</div>
			)}
		</>
	);
};

export default memo(ContextMenu);
