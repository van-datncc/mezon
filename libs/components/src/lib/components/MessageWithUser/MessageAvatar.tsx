import { ShortUserProfile } from '@mezon/components';
import { useOnClickOutside } from '@mezon/core';
import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import { useMessageParser } from './useMessageParser';
import { useMessageSender } from './useMessageSender';
type IMessageAvatarProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine: boolean;
	isEditing?: boolean;
};

const MessageAvatar = ({ user, message, isCombine, isEditing }: IMessageAvatarProps) => {
	const { hasAvatar, avatarChar, avatarImg, username } = useMessageSender(user);
	const { messageHour } = useMessageParser(message);
	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [positionBottom, setPositionBottom] = useState(false);
	const [positionTop, setPositionTop] = useState(0);
	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.button === 0) {
			setIsShowPanelChannel(true);
			const clickY = event.clientY;
			const windowHeight = window.innerHeight;
			const distanceToBottom = windowHeight - clickY;
			const heightElementShortUserProfileMin = 313;
			setPositionTop(clickY - 50);
			if (distanceToBottom < heightElementShortUserProfileMin) {
				setPositionBottom(true);
			}
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	const handleDefault = (e: any) => {
		e.stopPropagation();
	};

	if ((message.references?.length === 0 && isCombine)) {
		return (
			isEditing ? "" : (<div className="w-10 flex items-center justify-center min-w-10">
				<div className="hidden group-hover:text-zinc-400 group-hover:text-[10px] group-hover:block cursor-default">{messageHour}</div>
			</div>)
		);
	}
	return (
		<div className="relative group">
			<div className="pt-1" ref={panelRef} onMouseDown={(event) => handleMouseClick(event)}>
				{user ? (
					hasAvatar ? (
						<img className="size-10 rounded-full object-cover min-w-10 min-h-[38px] cursor-pointer" src={avatarImg} alt={avatarImg} />
					) : (
						<div className="size-10 bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
							{avatarChar}
						</div>
					)
				) : (
					<img
						className="size-10 rounded-full object-cover min-w-10 min-h-[38px] cursor-pointer"
						src="./assets/images/anonymous-avatar.jpg"
						alt={"anonymous-avatar"}
					/>
				)}
			</div>
			{isShowPanelChannel ? (
				<div
					className={`dark:bg-black bg-gray-200 mt-[10px] w-[300px] max-w-[89vw] rounded-lg flex flex-col z-10 opacity-100 shortUserProfile fixed left-5 sbm:left-0 md:left-[409px] `}
					style={{ top: positionBottom ? '' : `${positionTop + 'px'}`, bottom: positionBottom ? '64px' : '' }}
					onMouseDown={handleDefault}
				>
					<ShortUserProfile userID={user?.user?.id || ''} message={message}/>
				</div>
			) : null}
		</div>
	);
};

export default MessageAvatar;
