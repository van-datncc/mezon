import { useAppNavigation, useAppParams } from '@mezon/core';
import { selectChannelById } from '@mezon/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

type ChannelHashtagProps = {
	channelHastagId: string;
};

const ChannelHashtag = ({ channelHastagId }: ChannelHashtagProps) => {
	const { clanId } = useAppParams();
	const { toChannelPage } = useAppNavigation();

	const getChannelPath = (channelHastagId: string, clanId: string): string | undefined => {
		if (channelHastagId.startsWith('#')) {
			return toChannelPage(channelHastagId.slice(1), clanId || '');
		}
		return undefined;
	};
	const channelPath = getChannelPath(channelHastagId, clanId ?? '');

	const getChannelById = (channelHastagId: string) => {
		const channel = useSelector(selectChannelById(channelHastagId));
		return channel;
	};

	return channelPath && getChannelById(channelHastagId.slice(1)) ? (
		<Link
			style={{ textDecoration: 'none' }}
			to={channelPath}
			className="font-medium px-1 rounded-sm cursor-pointer whitespace-nowrap !text-[#3297ff] hover:!text-white dark:bg-[#3C4270] bg-[#D1E0FF] hover:bg-[#5865F2]"
		>
			{channelHastagId.startsWith('#') &&
				getChannelById(channelHastagId.slice(1)) &&
				`#${getChannelById(channelHastagId.slice(1)).channel_label}`}
		</Link>
	) : (
		<span>{channelHastagId}</span>
	);
};

export default ChannelHashtag;
