import { useThreads } from '@mezon/core';
import { selectMemberByUserId } from '@mezon/store';
import { ETypeMessage } from '@mezon/utils';
import { useSelector } from 'react-redux';
import { Hashtag, ThreadIcon } from '../Icons';

export type ChatWelComeProp = {
	readonly type: Readonly<string>;
	readonly name?: Readonly<string>;
	readonly avatarDM?: Readonly<string>;
};

function ChatWelCome({ type, name, avatarDM }: ChatWelComeProp) {
	const { currentThread } = useThreads();
	const user = useSelector(selectMemberByUserId(currentThread?.creator_id as string));
	return (
		<div className="space-y-2 px-4 mb-4 mt-[250px]">
			{type === ETypeMessage.CHANNEL ? (
				<div className="h-[75px] w-[75px] rounded-full bg-zinc-700 flex items-center justify-center pl-2">
					<Hashtag defaultFill="#ffffff" defaultSize="w-10 h-10 mb-2" />
				</div>
			) : type === ETypeMessage.THREAD ? (
				<div className="h-[75px] w-[75px] rounded-full bg-zinc-700 flex items-center justify-center pl-2">
					<ThreadIcon defaultFill="#ffffff" defaultSize="w-10 h-10 mb-2" />
				</div>
			) : (
				<img className="h-[75px] w-[75px] rounded-full flex items-center justify-center" alt='' src={avatarDM} />
			)}

			{type === ETypeMessage.THREAD && currentThread && (
				<div>
					<h4 className="text-[32px] font-bold my-2">{currentThread?.channel_label}</h4>
					<div className="mb-1">
						<span className="text-base">Started by &nbsp;</span>
						<span className="text-base font-semibold">{user?.user?.username}</span>
					</div>
				</div>
			)}

			{type !== ETypeMessage.THREAD && !currentThread && (
				<div>
					<p className="text-xl md:text-3xl font-bold pt-1" style={{ wordBreak: 'break-word' }}>
						{type === 'CHANNEL' ? 'Welcome to #' : ''} {name}
					</p>

					<p className="text-zinc-400 text-sm">
						{type === 'CHANNEL' ? `This is the start of the #${name} channel.` : `This is the start of your conversation with ${name}`}
					</p>
				</div>
			)}
		</div>
	);
}

export default ChatWelCome;
