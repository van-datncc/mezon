import { useAppNavigation, useAuth, useTagById } from '@mezon/core';
import {
	ChannelsEntity,
	appActions,
	categoriesActions,
	selectClanView,
	selectCurrentChannel,
	selectCurrentClan,
	selectCurrentStreamInfo,
	selectGotifyToken,
	selectStatusStream,
	selectThreadById,
	useAppDispatch,
	useAppSelector,
	videoStreamActions
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelType } from 'mezon-js';
import { memo, useCallback } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import { useWebRTCStream } from '../StreamContext/StreamContext';
import ModalUnknowChannel from './ModalUnknowChannel';

type ChannelHashtagProps = {
	channelHastagId: string;
	isJumMessageEnabled: boolean;
	isTokenClickAble: boolean;
};

const ChannelHashtag = ({ channelHastagId, isJumMessageEnabled, isTokenClickAble }: ChannelHashtagProps) => {
	const dispatch = useAppDispatch();
	const tagId = channelHastagId?.slice(2, -1);
	const isClanView = useSelector(selectClanView);
	const { toChannelPage, navigate } = useAppNavigation();
	const currentChannel = useSelector(selectCurrentChannel);
	const currentStreamInfo = useSelector(selectCurrentStreamInfo);
	const playStream = useSelector(selectStatusStream);
	const clanById = useSelector(selectCurrentClan);
	const { userProfile } = useAuth();
	const gotifyToken = useSelector(selectGotifyToken);
	const { handleChannelClick, disconnect } = useWebRTCStream();

	let channel = useTagById(tagId);
	const thread = useAppSelector((state) => selectThreadById(state, tagId));
	if (thread) channel = thread as ChannelsEntity;

	const handleClick = useCallback(() => {
		if (!channel) return;
		if (channel.type === ChannelType.CHANNEL_TYPE_VOICE || channel?.type === ChannelType.CHANNEL_TYPE_VOICE) {
			const urlVoice = `https://meet.google.com/${channel.meeting_code}`;
			window.open(urlVoice, '_blank', 'noreferrer');
		} else {
			if (channel.type === ChannelType.CHANNEL_TYPE_STREAMING) {
				if (currentStreamInfo?.streamId !== channel.id || (!playStream && currentStreamInfo?.streamId === channel.id)) {
					disconnect();
					handleChannelClick(
						clanById?.id as string,
						channel?.channel_id as string,
						userProfile?.user?.id as string,
						channel?.channel_id as string,
						userProfile?.user?.username as string,
						gotifyToken as string
					);
					dispatch(
						videoStreamActions.startStream({
							clanId: clanById?.id || '',
							clanName: clanById?.clan_name || '',
							streamId: channel?.channel_id || '',
							streamName: channel?.channel_label || '',
							parentId: channel?.parrent_id || ''
						})
					);
					dispatch(appActions.setIsShowChatStream(false));
				}
			}
			const channelUrl = toChannelPage(channel?.id, channel?.clan_id ?? '');
			dispatch(categoriesActions.setCtrlKFocusChannel({ id: channel?.id, parentId: channel?.parrent_id ?? '' }));
			navigate(channelUrl);
		}
	}, [channel, clanById, currentStreamInfo?.streamId, dispatch, navigate, playStream, toChannelPage]);

	const tokenClickAble = () => {
		if (!isJumMessageEnabled || isTokenClickAble) {
			handleClick();
		}
	};

	const [openUnknown, closeUnknown] = useModal(() => {
		return <ModalUnknowChannel onClose={closeUnknown} />;
	}, []);

	const isTextChannel = currentChannel?.type === ChannelType.CHANNEL_TYPE_TEXT;
	const isStreamingChannel = currentChannel?.type === ChannelType.CHANNEL_TYPE_STREAMING;
	const isThreadChannel = currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD;
	const existHashtagAndChannelView = channelHastagId && !isClanView;
	const isValidChannel = (isTextChannel || isStreamingChannel || isThreadChannel || existHashtagAndChannelView) && channel;

	return channel ? (
		isValidChannel ? (
			<div
				onClick={tokenClickAble}
				style={{ textDecoration: 'none' }}
				className={`font-medium px-0.1 rounded-sm  inline whitespace-nowrap !text-[#3297ff] dark:bg-[#3C4270] bg-[#D1E0FF] ${!isJumMessageEnabled ? ' hover:bg-[#5865F2] hover:!text-white cursor-pointer ' : `hover:none cursor-text`} `}
			>
				{channel.type === ChannelType.CHANNEL_TYPE_VOICE ? (
					<Icons.Speaker
						defaultSize={`inline mt-[-0.2rem] w-4 h-4  ${isJumMessageEnabled ? 'mx-[-0.4rem]' : 'mr-0.5'} `}
						defaultFill="#3297FF"
					/>
				) : channel.type === ChannelType.CHANNEL_TYPE_STREAMING ? (
					<Icons.Stream
						defaultSize={`inline mt-[-0.2rem] w-4 h-4  ${isJumMessageEnabled ? 'mx-[-0.4rem]' : 'mr-0.5'} `}
						defaultFill="#3297FF"
					/>
				) : channel.type === ChannelType.CHANNEL_TYPE_TEXT ? (
					!channel.channel_private || channel.channel_private === 0 ? (
						<Icons.Hashtag defaultSize={`inline-block -mt-[0.2rem] w-4 h-4 ${isJumMessageEnabled ? 'mx-[-0.5rem]' : ''} `} />
					) : (
						<Icons.HashtagLocked defaultSize={`inline-block -mt-[0.2rem] w-4 h-4 ${isJumMessageEnabled ? 'mx-[-0.5rem]' : ''} `} />
					)
				) : channel.type === ChannelType.CHANNEL_TYPE_THREAD ? (
					!channel.channel_private || channel.channel_private === 0 ? (
						<Icons.ThreadIcon defaultSize={`inline-block -mt-[0.2rem] w-4 h-4 ${isJumMessageEnabled ? 'mx-[-0.5rem]' : ''} `} />
					) : (
						<Icons.ThreadIconLocker className={`inline-block -mt-[0.2rem] w-4 h-4 ${isJumMessageEnabled ? 'mx-[-0.5rem]' : ''} `} />
					)
				) : null}
				{channel.channel_label}
			</div>
		) : null
	) : (
		<PrivateChannel onClick={openUnknown} />
	);
};

export default memo(ChannelHashtag);
function PrivateChannel({ onClick }: { onClick: () => void }) {
	return (
		<span
			onClick={onClick}
			className={`px-0.1 rounded-sm inline-flex w-fit whitespace-nowrap dark:!text-[#ffffff] dark:bg-[#3e3f3f] bg-[#F2F3F5] relative top-[3px] cursor-pointer`}
		>
			<Icons.LockedPrivate className={`mt-1 w-4 h-4`} />
			<span>private-channel</span>
		</span>
	);
}
