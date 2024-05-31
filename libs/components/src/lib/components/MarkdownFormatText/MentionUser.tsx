import { useClans, useOnClickOutside } from '@mezon/core';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ShortUserProfile from '../ShortUserProfile/ShortUserProfile';

type ChannelHashtagProps = {
	tagName: string;
};

const MentionUser = ({ tagName }: ChannelHashtagProps) => {
	const panelRef = useRef<HTMLAnchorElement>(null);
	const { usersClan } = useClans();
	const [foundUser, setFoundUser] = useState<any>(null);

	const dispatchUserIdToShowProfile = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();
	};

	useEffect(() => {
		const username = tagName.slice(1);
		const user = usersClan.find((userClan) => userClan.user?.username === username);
		if (user) {
			setFoundUser(user);
		} else {
			setFoundUser(null);
		}
	}, [tagName]);

	const [showProfileUser, setIsShowPanelChannel] = useState(false);
	const [positionBottom, setPositionBottom] = useState(false);
	const [positionTop, setPositionTop] = useState(0);
	const [positionLeft, setPositionLeft] = useState(0);

	const handleMouseClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		if (event.button === 0) {
			setIsShowPanelChannel(true);
			const clickY = event.clientY;
			const windowHeight = window.innerHeight;
			const distanceToBottom = windowHeight - clickY;
			const windowWidth = window.innerWidth;
			const elementTagName = event.target;
			if (elementTagName instanceof HTMLElement) {
				const positionRight = elementTagName.getBoundingClientRect().right;
				const widthElement = elementTagName.offsetWidth;
				const widthElementShortUserProfileMin = 380;
				const distanceToRight = windowWidth - positionRight;
				if (distanceToRight < widthElementShortUserProfileMin) {
					setPositionLeft(positionRight - widthElement - widthElementShortUserProfileMin);
				} else {
					setPositionLeft(positionRight + 20);
				}
				setPositionTop(clickY - 50);
				setPositionBottom(false);
			}
			const heightElementShortUserProfileMin = 313;
			if (distanceToBottom < heightElementShortUserProfileMin) {
				setPositionBottom(true);
			}
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	return (
		<>
			{showProfileUser && (
				<div
					className="dark:bg-black bg-gray-200 mt-[10px] w-[360px] rounded-lg flex flex-col z-10 fixed opacity-100"
					style={{
						left: `${positionLeft}px`,
						top: positionBottom ? '' : `${positionTop}px`,
						bottom: positionBottom ? '64px' : '',
					}}
					onMouseDown={(e) => e.stopPropagation()}
				>
					<ShortUserProfile userID={foundUser.user.id} />
				</div>
			)}
			{foundUser !== null ? (
				<Link
					onMouseDown={(event) => handleMouseClick(event)}
					ref={panelRef}
					onClick={(e) => dispatchUserIdToShowProfile(e)}
					style={{ textDecoration: 'none' }}
					to={''}
					className="font-medium px-1 rounded-sm cursor-pointer whitespace-nowrap !text-[#3297ff] hover:!text-white dark:bg-[#3C4270] bg-[#D1E0FF] hover:bg-[#5865F2]"
				>
					@{foundUser?.user?.username}
				</Link>
			) : (
				<span>{tagName}</span>
			)}
		</>
	);
};

export default MentionUser;
