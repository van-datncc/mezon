import { useAppNavigation, useAppParams, useMessageValue } from '@mezon/core';
import { selectChannelById } from '@mezon/store';
import { ChannelType } from 'mezon-js';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

type ChannelHashtagProps = {
	tagName: string;
};

const ChannelHashtag = ({ tagName }: ChannelHashtagProps) => {
	const { clanId } = useAppParams();
	const { toChannelPage } = useAppNavigation();
	const { currentChannelId } = useMessageValue();

	const getChannelPath = (tagName: string, clanId: string): string | undefined => {
		if (tagName.startsWith('#')) {
			return toChannelPage(tagName.slice(1), clanId || '');
		}
		return undefined;
	};
	const [channelPath, setChannelPath] = useState(getChannelPath(tagName, clanId ?? ''));

	const getChannelById = (channelId: string) => {
		const channel = useSelector(selectChannelById(channelId));
		return channel;
	};

	const channel = getChannelById(tagName.slice(1));

	useEffect(() => {
		if (channel?.type === ChannelType.CHANNEL_TYPE_VOICE) {
			setChannelPath(getChannelPath('#' + currentChannelId || '', clanId ?? ''));
		} else {
			setChannelPath(getChannelPath(tagName, clanId ?? ''));
		}
	}, [channel, currentChannelId, clanId, tagName]);

	const handleClick = useCallback(
		() => {
			if(channel.type === ChannelType.CHANNEL_TYPE_VOICE){
				const urlVoice = `https://meet.google.com/${channel.meeting_code}`;
				window.open(urlVoice, "_blank", "noreferrer");
			}
		},[channel]
	)

	return (
		channelPath && (
			<Link
				style={{ textDecoration: 'none' }}
				to={channelPath}
				className="font-medium cursor-pointer whitespace-nowrap !text-[#3297ff] hover:!text-white dark:bg-[#3C4270] bg-[#D1E0FF] hover:bg-[#5865F2]"
				onClick={handleClick}
			>
				{tagName.startsWith('#') && getChannelById(tagName.slice(1)) && `#${getChannelById(tagName.slice(1)).channel_label}`}
			</Link>
		)
	);
};

export default ChannelHashtag;
