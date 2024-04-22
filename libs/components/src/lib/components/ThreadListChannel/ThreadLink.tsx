import { useAppNavigation, useOnClickOutside, useThreads } from '@mezon/core';
import { selectCurrentChannel, selectIsUnreadChannelById } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Coords, classes } from '../ChannelLink';
import SettingChannel from '../ChannelSetting';
import { DeleteModal } from '../ChannelSetting/Component/Modal/deleteChannelModal';
import * as Icons from '../Icons';
import PanelChannel from '../PanelChannel';

type ThreadLinkProps = {
	thread: IChannel;
	isFirstThread: boolean;
};

const ThreadLink = ({ thread, isFirstThread }: ThreadLinkProps) => {
	const { toChannelPage } = useAppNavigation();
	const currentChanel = useSelector(selectCurrentChannel);
	const isUnReadChannel = useSelector(selectIsUnreadChannelById(thread.id));
	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const { setIsShowCreateThread } = useThreads();

	const panelRef = useRef<HTMLAnchorElement | null>(null);
	const [openSetting, setOpenSetting] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [coords, setCoords] = useState<Coords>({
		mouseX: 0,
		mouseY: 0,
		distanceToBottom: 0,
	});

	const channelPath = toChannelPage(thread.channel_id as string, thread.clan_id || '');

	const active = currentChanel?.channel_id === thread.channel_id;

	const state = active ? 'active' : thread?.unread ? 'inactiveUnread' : 'inactiveRead';

	const handleMouseClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		const mouseX = event.clientX;
		const mouseY = event.clientY + window.screenY;
		const windowHeight = window.innerHeight;

		if (event.button === 2) {
			const distanceToBottom = windowHeight - event.clientY;
			setCoords({ mouseX, mouseY, distanceToBottom });
			setIsShowPanelChannel((s) => !s);
		}
	};

	const handleDeleteChannel = () => {
		setShowModal(true);
		setIsShowPanelChannel(false);
	};

	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));

	return (
		<div className="flex flex-row items-center h-[34px] relative ">
			{isFirstThread ? (
				<span className="absolute top-2 left-0">
					<Icons.ShortCorner />
				</span>
			) : (
				<span className="absolute top-[-16px] left-[1px]">
					<Icons.LongCorner />
				</span>
			)}

			<Link
				to={channelPath}
				key={thread.channel_id}
				className={`${classes[state]} ml-5 w-full leading-[24px] rounded font-medium hover:text-white text-[15px] ${active ? 'font-medium bg-[#36373D] text-white' : ''} ${isUnReadChannel ? 'font-bold text-white' : ''}`}
				ref={panelRef}
				onMouseDown={(event) => handleMouseClick(event)}
				onClick={() => setIsShowCreateThread(false)}
			>
				{thread.channel_label}
				{isShowPanelChannel && (
					<PanelChannel
						onDeleteChannel={handleDeleteChannel}
						channel={thread}
						coords={coords}
						setOpenSetting={setOpenSetting}
						setIsShowPanelChannel={setIsShowPanelChannel}
					/>
				)}
				<SettingChannel
					open={openSetting}
					onClose={() => {
						setOpenSetting(false);
					}}
					channel={thread}
				/>

				{showModal && (
					<DeleteModal
						onClose={() => setShowModal(false)}
						channelLable={thread.channel_label || ''}
						channelId={thread.channel_id as string}
					/>
				)}
			</Link>
		</div>
	);
};

export default ThreadLink;
