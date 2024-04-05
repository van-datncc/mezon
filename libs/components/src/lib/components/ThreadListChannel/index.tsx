import { useAppNavigation } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { classes } from '../ChannelLink';
import * as Icons from '../Icons';

type ThreadListChannelProps = {
	threads: IChannel[];
};

const ThreadListChannel = ({ threads }: ThreadListChannelProps) => {
	const currentChanel = useSelector(selectCurrentChannel);
	const { toChannelPage } = useAppNavigation();

	return (
		<div className="flex flex-col ml-6">
			{threads.map((thread) => {
				const channelPath = toChannelPage(thread.channel_id as string, thread.clan_id || '');
				const active = currentChanel?.channel_id === thread.channel_id;
				const state = active ? 'active' : thread?.unread ? 'inactiveUnread' : 'inactiveRead';
				return (
					<Link to={channelPath} key={thread.channel_id} className="flex flex-row items-center h-[34px] relative">
						{threads.indexOf(thread) === 0 ? (
							<span className="absolute top-2 left-0">
								<Icons.ShortCorner />
							</span>
						) : (
							<span className="absolute top-[-16px] left-[1px]">
								<Icons.LongCorner />
							</span>
						)}

						<p className={`${classes[state]} ml-5 w-full leading-[24px] rounded ${active ? 'bg-[#36373D]' : ''}`}>
							{thread.channel_label}
						</p>
					</Link>
				);
			})}
		</div>
	);
};

export default ThreadListChannel;
