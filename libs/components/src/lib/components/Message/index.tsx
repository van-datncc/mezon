import { IMessage } from '@mezon/utils';

export type MessageProps = {
	message: IMessage;
};

function Message({ message }: MessageProps) {
	return (
		<div className="py-0.5 pr-16 pl-4 leading-[22px] hover:bg-gray-950/[.07]">
			<p className="pl-14 text-gray-100">{message.body?.text}</p>
		</div>
	);
}

export default Message;
