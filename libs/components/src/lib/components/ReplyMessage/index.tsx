import { ChatContext } from '@mezon/core';
import { useContext } from 'react';
import * as Icons from '../Icons/index';

function ReplyMessage() {
	const { messageRep, isOpenReply, setMessageRep, setIsOpenReply } = useContext(ChatContext);
	const handleRemoveReply = () => {
		setIsOpenReply(false);
		setMessageRep({});
	};

	return (
		<>
			{isOpenReply && (
				<div className="flex flex-row items-center justify-between w-[98%] m-4 bg-[#2B2D31] p-2 rounded-md text-[12px] ">
					<div className="">
						Reply: <span className=" text-[#DBDEE1] italic">{messageRep.content.t}</span>{' '}
					</div>
					<button className="relative" onClick={handleRemoveReply}>
						<Icons.CircleClose />
					</button>
				</div>
			)}
		</>
	);
}

export default ReplyMessage;
