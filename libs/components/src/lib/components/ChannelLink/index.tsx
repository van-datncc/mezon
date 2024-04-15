import { useAppNavigation, useAuth, useClans, useOnClickOutside, useThreads } from '@mezon/core';
import { channelsActions, useAppDispatch, voiceActions } from '@mezon/store';
import { useMezon, useMezonVoice } from '@mezon/transport';
import { ChannelStatusEnum, IChannel } from '@mezon/utils';
import cls from 'classnames';
import { ChannelType } from 'mezon-js';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SettingChannel from '../ChannelSetting';
import { DeleteModal } from '../ChannelSetting/Component/Modal/deleteChannelModal';
import * as Icons from '../Icons';
import { AddPerson, SettingProfile } from '../Icons';
import PanelChannel from '../PanelChannel';

export type ChannelLinkProps = {
	clanId?: string;
	channel: IChannel;
	active?: boolean;
	createInviteLink: (clanId: string, channelId: string) => void;
	isPrivate?: number;
	isUnReadChannel?: boolean;
	numberNotication?: number;
	channelType?: number;
};

export type Coords = {
	mouseX: number;
	mouseY: number;
};

export const classes = {
	active: 'flex flex-row items-center px-2 mx-2 rounded relative p-1',
	inactiveUnread: 'flex flex-row items-center px-2 mx-2 rounded relative p-1 hover:bg-[#36373D]',
	inactiveRead: 'flex flex-row items-center px-2 mx-2 rounded relative p-1 hover:bg-[#36373D]',
};

function ChannelLink({ clanId, channel, active, isPrivate, createInviteLink, isUnReadChannel, numberNotication, channelType }: ChannelLinkProps) {
	const state = active ? 'active' : channel?.unread ? 'inactiveUnread' : 'inactiveRead';

	const { userProfile } = useAuth();
	const { currentClan } = useClans();
	const { sessionRef } = useMezon();
	const { setIsShowCreateThread } = useThreads();
	const voice = useMezonVoice();

	const [openSetting, setOpenSetting] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isShowPanelChannel, setIsShowPanelChannel] = useState<boolean>(false);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [coords, setCoords] = useState<Coords>({
		mouseX: 0,
		mouseY: 0,
	});

	const handleOpenCreate = () => {
		setOpenSetting(true);
	};

	const { toChannelPage } = useAppNavigation();

	const handleCreateLinkInvite = () => {
		createInviteLink(clanId || '', channel.channel_id || '');
	};

	const channelPath = toChannelPage(channel.id, channel?.clan_id || '');

	const handleMouseClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const mouseX = event.clientX;
		const mouseY = event.clientY + window.screenY;

		if (event.button === 2) {
			setCoords({ mouseX, mouseY });
			setIsShowPanelChannel((s) => !s);
		}
	};

	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	const dispatch = useAppDispatch();

	useEffect(() => {
		const voiceChannelName = currentClan?.clan_name?.replace(' ', '-') + '-' + channel.channel_label?.replace(' ', '-');
		voice.setVoiceChannelName(voiceChannelName.toLowerCase());
		voice.setVoiceChannelId(channel.id);
		voice.setUserDisplayName(userProfile?.user?.username || '');
		voice.setClanId(clanId || '');
		voice.setClanName(currentClan?.clan_name || '');
	}, [channel.channel_label, channel.id, clanId, currentClan?.clan_name, userProfile?.user?.username, voice]);

	const handleVoiceChannel = (id: string) => {
		dispatch(channelsActions.setCurrentVoiceChannelId(id));
		dispatch(voiceActions.setStatusCall(true));
		const voiceChannelName = currentClan?.clan_name?.replace(' ', '-') + '-' + channel.channel_label?.replace(' ', '-');
		voice.createVoiceConnection(voiceChannelName.toLowerCase(), sessionRef.current?.token || '');
	};

	const handleDeleteChannel = () => {
		setShowModal(true);
		setIsShowPanelChannel(false);
	};

	return (
		<div ref={panelRef} onMouseDown={(event) => handleMouseClick(event)} onClick={() => setIsShowCreateThread(false)} className="relative group">
			{channelType === ChannelType.CHANNEL_TYPE_VOICE ? (
				<span className={`${classes[state]} cursor-pointer ${active ? 'bg-[#36373D]' : ''}`} onClick={() => handleVoiceChannel(channel.id)}>
					{state === 'inactiveUnread' && <div className="absolute left-0 -ml-2 w-1 h-2 bg-white rounded-r-full"></div>}
					<div className="relative mt-[-5px]">
						{isPrivate === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_VOICE && (
							<Icons.SpeakerLocked defaultSize="w-5 h-5" />
						)}
						{isPrivate === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_TEXT && (
							<Icons.HashtagLocked defaultSize="w-5 h-5 " />
						)}
						{isPrivate === undefined && channel.type === ChannelType.CHANNEL_TYPE_VOICE && <Icons.Speaker defaultSize="w-5 5-5" />}
						{isPrivate === undefined && channel.type === ChannelType.CHANNEL_TYPE_TEXT && <Icons.Hashtag defaultSize="w-5 h-5" />}
					</div>
					<p
						className={cls({
							'ml-2 text-[#AEAEAE] w-full group-hover:text-white text-[15px] focus:bg-[#36373D]': true,
							'font-bold text-white': active || isUnReadChannel,
						})}
						title={channel.channel_label && channel?.channel_label.length > 20 ? channel?.channel_label : undefined}
					>
						{channel.channel_label && channel?.channel_label.length > 20
							? `${channel?.channel_label.substring(0, 20)}...`
							: channel?.channel_label}
					</p>
				</span>
			) : (
				<Link to={channelPath}>
					<span className={`${classes[state]} ${active ? 'bg-[#36373D]' : ''}`}>
						{state === 'inactiveUnread' && <div className="absolute left-0 -ml-2 w-1 h-2 bg-white rounded-r-full"></div>}
						<div className="relative mt-[-5px]">
							{isPrivate === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_VOICE && (
								<Icons.SpeakerLocked defaultSize="w-5 h-5" />
							)}
							{isPrivate === ChannelStatusEnum.isPrivate && channel.type === ChannelType.CHANNEL_TYPE_TEXT && (
								<Icons.HashtagLocked defaultSize="w-5 h-5 " />
							)}
							{isPrivate === undefined && channel.type === ChannelType.CHANNEL_TYPE_VOICE && <Icons.Speaker defaultSize="w-5 5-5" />}
							{isPrivate === undefined && channel.type === ChannelType.CHANNEL_TYPE_TEXT && <Icons.Hashtag defaultSize="w-5 h-5" />}
						</div>
						<p
							className={cls({
								'ml-2 text-[#AEAEAE] w-full group-hover:text-white text-[15px] focus:bg-[#36373D]': true,
								'font-bold text-white': active || isUnReadChannel,
							})}
							title={channel.channel_label && channel?.channel_label.length > 20 ? channel?.channel_label : undefined}
						>
							{channel.channel_label && channel?.channel_label.length > 20
								? `${channel?.channel_label.substring(0, 20)}...`
								: channel?.channel_label}
						</p>
					</span>
				</Link>
			)}

			{currentClan?.creator_id === userProfile?.user?.id ? (
				numberNotication !== 0 ? (
					<>
						<AddPerson
							className={`absolute ml-auto w-4 h-4  top-[6px] right-8 cursor-pointer hidden group-hover:block text-white ${active ? '' : ''}`}
							onClick={handleCreateLinkInvite}
						/>
						<SettingProfile
							className={`absolute ml-auto w-4 h-4  top-[6px] right-3 cursor-pointer hidden group-hover:block text-white ${active ? '' : ''}`}
							onClick={handleOpenCreate}
						/>
						<div
							className={`absolute ml-auto w-4 h-4 text-white right-3 group-hover:hidden bg-red600 rounded-full text-xs text-center top-2`}
						>
							{numberNotication}
						</div>
					</>
				) : (
					<>
						<AddPerson
							className={`tesst absolute ml-auto w-4 h-4  top-[6px] group-hover:block group-hover:text-white  ${active ? 'text-white' : 'text-[#0B0B0B]'} block right-8 cursor-pointer`}
							onClick={handleCreateLinkInvite}
						/>
						<SettingProfile
							className={`absolute ml-auto w-4 h-4  top-[6px] right-3 ${active ? 'text-white' : 'text-[#0B0B0B]'} block group-hover:block group-hover:text-white cursor-pointer`}
							onClick={handleOpenCreate}
						/>
					</>
				)
			) : (
				<>
					<AddPerson
						className={`absolute ml-auto w-4 h-4  top-[6px] group-hover:block group-hover:text-white  ${active ? 'text-white' : 'text-[#0B0B0B]'} hidden right-3 cursor-pointer`}
						onClick={handleCreateLinkInvite}
					/>
					{numberNotication !== 0 && (
						<div className="absolute ml-auto w-4 h-4  top-[2px] text-white  right-3 group-hover:hidden">{numberNotication}</div>
					)}
				</>
			)}

			<SettingChannel
				open={openSetting}
				onClose={() => {
					setOpenSetting(false);
				}}
				channel={channel}
			/>
			{/* <p>{numberNotication}</p> */}
			{isShowPanelChannel && (
				<PanelChannel
					onDeleteChannel={handleDeleteChannel}
					channel={channel}
					coords={coords}
					setOpenSetting={setOpenSetting}
					setIsShowPanelChannel={setIsShowPanelChannel}
				/>
			)}

			{showModal && (
				<DeleteModal
					onClose={() => setShowModal(false)}
					channelLable={channel.channel_label || ''}
					channelId={channel.channel_id as string}
				/>
			)}
		</div>
	);
}

export default ChannelLink;
