import { selectCurrentChannel, selectMemberByUserId } from '@mezon/store';
import { ChannelIsNotThread, ETypeMessage } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { useSelector } from 'react-redux';
import { Hashtag, ThreadIcon } from '../../../../../ui/src/lib/Icons';

export type ChatWelComeProp = {
	readonly type: Readonly<string>;
	readonly name?: Readonly<string>;
	readonly avatarDM?: Readonly<string>;
	userName?: string;
	mode: number;
};

function ChatWelCome({ type, name, userName, avatarDM, mode }: ChatWelComeProp) {
	const currentChannel = useSelector(selectCurrentChannel);
	const user = useSelector(selectMemberByUserId(currentChannel?.creator_id as string));
	const classNameSubtext = 'dark:text-zinc-400 text-colorTextLightMode text-sm';
	const showName = <span className='font-medium'>{name}</span>;

	return (
		<div className="space-y-2 px-4 mb-0 mt-[50px] flex-1 flex flex-col justify-end">
			{type === ETypeMessage.CHANNEL ? (
				<div className="h-[75px] w-[75px] rounded-full bg-bgLightModeButton dark:bg-zinc-700 flex items-center justify-center pl-2">
					<Hashtag defaultFill="#ffffff" defaultSize="w-10 h-10 mb-2" />
				</div>
			) : type === ETypeMessage.THREAD ? (
				<div className="h-[75px] w-[75px] rounded-full bg-bgLightModeButton dark:bg-zinc-700 flex items-center justify-center pl-2">
					<ThreadIcon defaultFill="#ffffff" defaultSize="w-10 h-10 mb-2" />
				</div>
			) : avatarDM ? (
				<img className="h-[75px] w-[75px] rounded-full flex items-center justify-center object-cover" alt="" src={avatarDM} />
			) : (
				<div className="h-[75px] w-[75px] bg-bgLightModeButton dark:bg-zinc-700 rounded-full flex justify-center items-center text-contentSecondary text-4xl">
					{(userName ?? name)?.charAt(0).toUpperCase()}
				</div>
			)}

			<div>
				<p className="text-xl md:text-3xl font-bold pt-1 dark:text-white text-black" style={{ wordBreak: 'break-word' }}>
					Welcome to #{name}
				</p>
			</div>
			<div className='text-base'>
				{mode === ChannelStreamMode.STREAM_MODE_CHANNEL && (
					currentChannel?.parrent_id !== ChannelIsNotThread.TRUE ?(
						<p className={classNameSubtext}>
							Started by <span className='dark:text-white text-black font-medium'>{user?.user?.username}</span>
						</p>
					) : (
						<p className={classNameSubtext}>
							This is the start of the #{showName} {currentChannel?.channel_private ? 'private' : ''} channel
						</p>
					))
				}
				{mode === ChannelStreamMode.STREAM_MODE_DM && 
					<p className={classNameSubtext}>
						This is the beginning of your direct message history with {showName}
					</p>
				}
				{mode === ChannelStreamMode.STREAM_MODE_GROUP && 
					<p className={classNameSubtext}>
						Welcome to the beginning of the #{showName} group
					</p>
				}
			</div>
		</div>
	);
}

export default ChatWelCome;
