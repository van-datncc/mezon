import { ShortUserProfile } from '@mezon/components';
import { useOnClickOutside } from '@mezon/core';
import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useRef, useState } from 'react';
import { useMessageParser } from './useMessageParser';
import { useMessageSender } from './useMessageSender';
type IMessageAvatarProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine: boolean;
};

const MessageAvatar = ({ user, message, isCombine }: IMessageAvatarProps) => {
	const { hasAvatar, avatarChar, avatarImg } = useMessageSender(user);

	const { messageHour } = useMessageParser(message);

	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.button === 0) {
			setIsShowPanelChannel(true);
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	if ((message.references?.length === 0 && isCombine) || (message.references?.length === 0 && !user)) {
		return (
			<div className="w-10 flex items-center justify-center min-w-10">
				<div className="hidden group-hover:text-zinc-400 group-hover:text-[10px] group-hover:block cursor-default">{messageHour}</div>
			</div>
		);
	}
	return (
		<div ref={panelRef} onMouseDown={(event) => handleMouseClick(event)} className="relative group">
			<div className="pt-1">
				{hasAvatar ? (
					<img className="size-10 rounded-full object-cover min-w-10 min-h-[38px] cursor-pointer" src={avatarImg} alt={avatarImg} />
				) : (
					<div className="size-10 bg-bgDisable rounded-full flex justify-center items-center text-contentSecondary text-[16px]">
						{avatarChar}
					</div>
				)}
			</div>
			{isShowPanelChannel ? (
				<div className="bg-black mt-[10px] w-[360px] rounded-lg flex flex-col z-10 absolute top-[-300px] right-[-375px] opacity-100">
					<ShortUserProfile userID={user?.user?.id || ''} />
				</div>
			) : null}
		</div>
	);
};

export default MessageAvatar;
