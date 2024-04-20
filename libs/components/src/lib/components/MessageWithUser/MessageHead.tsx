import { ShortUserProfile } from '@mezon/components';
import { useOnClickOutside } from '@mezon/core';
import { IChannelMember, IMessageWithUser } from '@mezon/utils';
import { useRef, useState } from 'react';
import { useMessageParser } from './useMessageParser';
import { useMessageSender } from './useMessageSender';
type IMessageHeadProps = {
	user?: IChannelMember | null;
	message: IMessageWithUser;
	isCombine: boolean;
};

const MessageHead = ({ user, message, isCombine }: IMessageHeadProps) => {
	const { username } = useMessageSender(user);
	const { messageTime } = useMessageParser(message);

	if (isCombine && message.references?.length === 0) {
		return <></>;
	}
	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.button === 0) {
			setIsShowPanelChannel(true);
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));

	if (isCombine && message.references?.length === 0) {
		return <></>;
	}

	return (
		<div className="relative group">
			<div className="flex-row items-center w-full gap-4 flex">
				<div className="font-['Manrope'] text-sm text-white font-[600] text-[15px] tracking-wider cursor-pointer break-all" ref={panelRef} onMouseDown={(event) => handleMouseClick(event)}>{username}</div>
				<div className=" text-zinc-400 font-['Manrope'] text-[10px] cursor-default">{messageTime}</div>
			</div>
			{isShowPanelChannel ? (
				<div className="bg-black mt-[10px] w-[360px] rounded-lg flex flex-col z-10 absolute top-[-420px] right-[-100px] opacity-100">
					<ShortUserProfile userID={user?.user?.id || ''} />
				</div>
			) : null}
		</div>
	);
};

export default MessageHead;
