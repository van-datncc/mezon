import { ChatContext } from '@mezon/core';
import { useContext } from 'react';

type ReplyMessageProps = {
	receiver?: string;
};

function ReplyMessage(props: ReplyMessageProps) {
	const { receiver } = useContext(ChatContext);

	console.log(receiver);
	return <div className="w-[98.5%] m-4 bg-[#2B2D31] p-2 rounded-md ">Reply to: {props.receiver} </div>;
}

export default ReplyMessage;
