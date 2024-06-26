import { useAuth, useClanRestriction, useRightClick } from '@mezon/core';
import { selectMessageByMessageId, selectPinMessageByChannelId } from '@mezon/store';
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
import { EPermission, RightClickPos } from '@mezon/utils';
import { selectPosClickingActive, selectReactionOnMessageList } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '../ItemContextMenu';
import ReactionPart from '../ReactionPart';
interface IContextMenuProps {
	urlData: string;
}

const ContextMenu: React.FC<IContextMenuProps> = ({ urlData }) => {
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
	const { userId } = useAuth();
	const [listTextToMatch, setListTextToMatch] = useState<any[]>(listClickDefault);
	const getListReactionMessageId = useSelector(selectReactionOnMessageList);
	const checkReactionHasExistRealtime = (arrayMessageIdReaction: string[], messageId: string) => {
		return arrayMessageIdReaction.includes(messageId);
	};
	const [checkReactionRealtime, setCheckReactionRealtime] = useState<boolean>(false);

	useEffect(() => {
		const check = checkReactionHasExistRealtime(getListReactionMessageId, getMessageIdRightClicked);
		if (check) {
			setCheckReactionRealtime(true);
		} else {
			setCheckReactionRealtime(false);
		}
	}, [getListReactionMessageId]);

	const [hasDeleteMessagePermision, { isClanCreator }] = useClanRestriction([EPermission.deleteMessage]);
	const emojiList = [':anhan:', , ':100:', ':rofl:', ':verify:'];

	useLayoutEffect(() => {
		if (messageRClicked) {
			const checkOwnerMessage = messageRClicked?.sender_id === userId;
			const checkMessHasReaction = messageRClicked?.reactions && messageRClicked?.reactions?.length > 0;
			const checkMessHasText = messageRClicked?.content.t !== '';

			if (isClanCreator) {
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
					if (checkMessHasReaction || checkReactionRealtime) {
						const combineHasReaction = [...combineOwnerMessage, ...viewReactionList, ...removeReactionList, ...removeAllReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction && !checkReactionRealtime) {
						const combineNoReaction = [...combineOwnerMessage];
						setListTextToMatch(combineNoReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineNoReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					}
				} else if (!checkOwnerMessage) {
					const combineNoOwnerMessage = [...listClickDefault, ...reportMessageList, ...deleteMessageList];
					setListTextToMatch(combineNoOwnerMessage);
					if (checkMessHasReaction || checkReactionRealtime) {
						const combineHasReaction = [...combineNoOwnerMessage, ...viewReactionList, ...removeReactionList, ...removeAllReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction && !checkReactionRealtime) {
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
			} else if (!isClanCreator) {
				const combineNoOwnerClan = [...listClickDefault];
				setListTextToMatch(combineNoOwnerClan);
				if (checkOwnerMessage) {
					const combineOwnerMessage = [...combineNoOwnerClan, ...deleteMessageList, ...editMessageList];
					setListTextToMatch(combineOwnerMessage);
					if (checkMessHasReaction || checkReactionRealtime) {
						const combineHasReaction = [...combineOwnerMessage, ...viewReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction && !checkReactionRealtime) {
						const combineNotReaction = [...combineOwnerMessage];
						setListTextToMatch(combineNotReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineNotReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					}
				} else if (!checkOwnerMessage) {
					let combineNoOwnerMessage: any[] = [];
					if (hasDeleteMessagePermision) {
						combineNoOwnerMessage = [...listClickDefault, ...reportMessageList, ...deleteMessageList];
					} else {
						combineNoOwnerMessage = [...listClickDefault, ...reportMessageList];
					}

					setListTextToMatch(combineNoOwnerMessage);
					if (checkMessHasReaction || checkReactionRealtime) {
						const combineHasReaction = [...combineNoOwnerMessage, ...viewReactionList];
						setListTextToMatch(combineHasReaction);
						if (checkMessHasText) {
							const combineHasText = [...combineHasReaction, ...speakMessageList];
							setListTextToMatch(combineHasText);
						}
					} else if (!checkMessHasReaction && !checkReactionRealtime) {
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
	}, [messageRClicked, messageExists, checkReactionRealtime, hasDeleteMessagePermision]);

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
		<div
			ref={menuRef}
			className="fixed h-fit flex flex-col bg-[#111214] rounded z-40 w-[12rem] p-2"
			style={{ top: topMenu, bottom: bottomMenu, left: leftMenu, right: rightMenu }}
		>
			<ReactionPart emojiList={emojiList} />
			{sortListById(listTextToMatch)?.map((item: any) => {
				return <MenuItem urlData={urlData} item={item} key={item.name} />;
			})}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL && <hr className=" border-t-[#2E2F34]  my-2"></hr>}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL &&
				imageList.map((item: any) => {
					return <MenuItem urlData={urlData} item={item} key={item.name} />;
				})}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL && <hr className=" border-t-[#2E2F34]  my-2"></hr>}
			{posClick === RightClickPos.IMAGE_ON_CHANNEL &&
				linkList.map((item: any) => {
					return <MenuItem urlData={urlData} item={item} key={item.name} />;
				})}
		</div>
	);
};

export default memo(ContextMenu);
