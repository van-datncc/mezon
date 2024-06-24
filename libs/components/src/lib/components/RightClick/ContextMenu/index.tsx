import { useAuth, useClans, useRightClick } from '@mezon/core';
import { selectMessageByMessageId } from '@mezon/store';
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
	viewReactionList,
} from '@mezon/ui';
import { RightClickPos } from '@mezon/utils';
import { selectPosClickingActive } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import MenuItem from '../ItemContextMenu';
interface IContextMenuProps {
	onClose: () => void;
	urlData: string;
}

const ContextMenu: React.FC<IContextMenuProps> = ({ onClose, urlData }) => {
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

	const messageRClicked = useSelector(selectMessageByMessageId(getMessageIdRightClicked));
	const { currentClan } = useClans();
	const { userId } = useAuth();
	const [listTextToMatch, setListTextToMatch] = useState<any[]>(listClickDefault);

	const checkOwnerClan = currentClan?.creator_id === userId;
	const checkOwnerMessage = messageRClicked.sender_id === userId;
	const checkMessHasReaction = messageRClicked.reactions && messageRClicked.reactions?.length > 0;
	const checkImageHasText = messageRClicked.content.t !== '';

	useLayoutEffect(() => {
		if (checkOwnerClan) {
			const combineOwnerClan = [...listClickDefault, ...pinMessageList];
			setListTextToMatch(combineOwnerClan);
			if (checkOwnerMessage) {
				const combineOwnerMessage = [...combineOwnerClan, ...editMessageList, ...deleteMessageList];
				setListTextToMatch(combineOwnerMessage);
				if (checkMessHasReaction) {
					const combineHasReaction = [...combineOwnerMessage, ...viewReactionList, ...removeReactionList, ...removeAllReactionList];
					setListTextToMatch(combineHasReaction);
					if (checkImageHasText) {
						const combineHasText = [...combineHasReaction, ...speakMessageList];
						setListTextToMatch(combineHasText);
					}
				}
			} else if (!checkOwnerMessage) {
				const combineNoOwnerMessage = [...combineOwnerClan, ...reportMessageList, ...deleteMessageList];
				setListTextToMatch(combineNoOwnerMessage);
				if (checkMessHasReaction) {
					const combineHasReaction = [...combineNoOwnerMessage, ...viewReactionList, ...removeReactionList, ...removeAllReactionList];
					setListTextToMatch(combineHasReaction);
					if (checkImageHasText) {
						const combineHasText = [...combineHasReaction, ...speakMessageList];
						setListTextToMatch(combineHasText);
					}
				}
			}
		} else if (!checkOwnerClan) {
			const combineNoOwnerClan = [...listClickDefault];
			setListTextToMatch(combineNoOwnerClan);
			if (checkOwnerMessage) {
				const combineOwnerMessage = [...combineNoOwnerClan, ...deleteMessageList];
				setListTextToMatch(combineOwnerMessage);
				if (checkMessHasReaction) {
					const combineHasReaction = [...combineOwnerMessage, ...viewReactionList];
					setListTextToMatch(combineHasReaction);
					if (checkImageHasText) {
						const combineHasText = [...combineHasReaction, ...speakMessageList];
						setListTextToMatch(combineHasText);
					}
				}
			}
		}
	}, [messageRClicked]);

	console.log(posClick);

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
				setBottomMenu(30);
				setLeftMenu('auto');
				setRightMenu(30);
			} else if (!isBottomLimit && isRightLimit) {
				setTopMenu(rightClickXy.y);
				setBottomMenu('auto');
				setLeftMenu('auto');
				setRightMenu(30);
			} else if (isBottomLimit && !isRightLimit) {
				setTopMenu('auto');
				setBottomMenu(30);
				setLeftMenu(rightClickXy.x);
				setRightMenu('auto');
			} else if (!isBottomLimit && !isRightLimit) {
				setTopMenu(rightClickXy.y);
				setBottomMenu(30);
				setLeftMenu(rightClickXy.x);
				setRightMenu('auto');
			}
		}
	}, [rightClickXy, WINDOW_HEIGHT, WINDOW_WIDTH, getMessageIdRightClicked]);

	function sortListById(arrayList: any[]) {
		return arrayList.sort((a, b) => a.id - b.id);
	}

	return (
		<div
			ref={menuRef}
			className="fixed h-fit flex flex-col bg-[#111214] rounded z-40 w-[12rem] p-2 z-50"
			style={{ top: topMenu, bottom: bottomMenu, left: leftMenu, right: rightMenu }}
			onClick={onClose}
		>
			{sortListById(listTextToMatch)?.map((item: any) => {
				return (
					<Fragment key={item.name}>
						<CopyToClipboard text={urlData}>
							<MenuItem urlData={urlData} item={item} />
						</CopyToClipboard>
					</Fragment>
				);
			})}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL && <hr className=" border-t-[#2E2F34]  my-2"></hr>}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL &&
				imageList.map((item: any) => {
					return (
						<Fragment key={item.name}>
							<CopyToClipboard text={urlData}>
								<MenuItem urlData={urlData} item={item} />
							</CopyToClipboard>
						</Fragment>
					);
				})}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL && <hr className=" border-t-[#2E2F34]  my-2"></hr>}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL &&
				linkList.map((item: any) => {
					return (
						<Fragment key={item.name}>
							<CopyToClipboard text={urlData}>
								<MenuItem urlData={urlData} item={item} />
							</CopyToClipboard>
						</Fragment>
					);
				})}
		</div>
	);
};

export default ContextMenu;
