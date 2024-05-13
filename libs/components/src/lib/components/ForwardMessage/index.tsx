import { Icons } from '@mezon/components';
import { useChannels, useDirect, useSendForwardMessage } from '@mezon/core';
import { RootState, channelsActions, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { ChannelStatusEnum } from '@mezon/utils';
import { Button, Checkbox, Label, Modal } from 'flowbite-react';
import { getSelectedMessage, toggleIsShowPopupForwardFalse } from 'libs/store/src/lib/forwardMessage/forwardMessage.slice';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageContent from '../MessageWithUser/MessageContent';
type ModalParam = {
	openModal: boolean;
	onClose: () => void;
};
type OpjectSend = {
	id: string;
	type: number;
	clanId?: string;
	channel_label?: string;
};
const ForwardMessageModal = ({ openModal, onClose }: ModalParam) => {
	const dispatch = useAppDispatch();
	const { listDM: dmGroupChatList } = useDirect();
	const { listChannels } = useChannels();
	const listChannel = listChannels.filter((Channel) => Channel.type === 1);
	const isLoading = useSelector((state: RootState) => state.channels.loadingStatus);
	const listGroup = dmGroupChatList.filter((groupChat) => groupChat.type === 2);
	const listDM = dmGroupChatList.filter((groupChat) => groupChat.type === 3);
	const [selectedObjectIdSends, setSelectedObjectIdSends] = useState<OpjectSend[]>([]);
	const { sendForwardMessage } = useSendForwardMessage();
	const mezon = useMezon();
	const selectedMessage = useSelector(getSelectedMessage);

	useEffect(() => {
		if (isLoading === 'loaded') {
			dispatch(channelsActions.openCreateNewModalChannel(false));
		}
	}, [dispatch, isLoading]);

	const handleCloseModal = () => {
		dispatch(toggleIsShowPopupForwardFalse());
	};
	const handleToggle = (id: string, type: number, clanId?: string, channel_label?: string) => {
		const existingIndex = selectedObjectIdSends.findIndex((item) => item.id === id && item.type === type);
		if (existingIndex !== -1) {
			setSelectedObjectIdSends((prevItems) => [...prevItems.slice(0, existingIndex), ...prevItems.slice(existingIndex + 1)]);
		} else {
			setSelectedObjectIdSends((prevItems) => [...prevItems, { id, type, clanId, channel_label }]);
		}
	};

	const sentToMessage = async () => {
		for (const selectedObjectIdSend of selectedObjectIdSends) {
			if (selectedObjectIdSend.type === ChannelType.CHANNEL_TYPE_DM) {
				mezon.joinChatDirectMessage(selectedObjectIdSend.id, '', selectedObjectIdSend.type);
				sendForwardMessage('', selectedObjectIdSend.id, '', ChannelStreamMode.STREAM_MODE_DM, selectedMessage);
			} else if (selectedObjectIdSend.type === ChannelType.CHANNEL_TYPE_GROUP) {
				mezon.joinChatDirectMessage(selectedObjectIdSend.id, '', selectedObjectIdSend.type);
				sendForwardMessage('', selectedObjectIdSend.id, '', ChannelStreamMode.STREAM_MODE_GROUP, selectedMessage);
			} else if (selectedObjectIdSend.type === ChannelType.CHANNEL_TYPE_TEXT) {
				await mezon.joinChatChannel(selectedObjectIdSend.id);
				sendForwardMessage(
					selectedObjectIdSend.clanId || '',
					selectedObjectIdSend.id,
					selectedObjectIdSend.channel_label || '',
					ChannelStreamMode.STREAM_MODE_CHANNEL,
					selectedMessage,
				);
			}
		}
		dispatch(toggleIsShowPopupForwardFalse());
	};

	return (
		<Modal theme={{ content: { base: 'w-[550px]' } }} show={openModal} dismissible={true} onClose={onClose}>
			<div className="bg-bgPrimary pt-4 rounded">
				<div>
					<h1 className="text-white text-xl font-semibold text-center">Forward Message</h1>
				</div>
				<div className="px-4 pt-4">
					<input
						type="text"
						className="text-[#B5BAC1] outline-none w-full h-10 p-[10px] bg-[#26262B] text-base rounded placeholder:text-sm"
						placeholder="Search"
					/>
					<div className="mt-4 mb-2 overflow-y-auto h-[300px] thread-scroll">
						{listDM.map((DM, index) => (
							<div key={DM.id} className="flex items-center px-4 py-1 hover:bg-bgPrimary1 rounded">
								<div className="flex flex-1 flex-row items-center">
									<img src={DM.channel_avatar?.at(0)} alt="" className="size-5 object-cover rounded-full mr-[10px] my-[5px]" />
									<p className="text-[#B5BAC1]">{DM.channel_label}</p>
								</div>
								<Checkbox
									className="w-4 h-4 focus:ring-transparent"
									id={`checkbox-item-${index}`}
									onChange={() => handleToggle(DM.id, DM.type || 0)}
								/>
							</div>
						))}
						{listGroup.map((group, index) => (
							<div key={group.id} className="flex items-center px-4 py-1 hover:bg-bgPrimary1 rounded">
								<div className="flex flex-1 flex-row items-center">
									<img
										src={`/assets/images/avatar-group.png`}
										alt=""
										className="size-10 min-w-10 min-h-10 object-cover rounded-full mr-[10px] my-[5px]"
									/>
									<p className="text-[#B5BAC1]">{group.channel_label}</p>
								</div>
								<Checkbox
									className="w-4 h-4 focus:ring-transparent"
									id={`checkbox-item-${index}`}
									onChange={() => handleToggle(group.id, group.type || 0)}
								/>
							</div>
						))}
						{listChannel.map((channel, index) => (
							<div key={channel.id} className="flex items-center px-4 py-1 hover:bg-bgPrimary1 rounded">
								<div className="flex flex-1 flex-row items-center gap-1">
									{channel.channel_private === ChannelStatusEnum.isPrivate ? (
										<Icons.HashtagLocked defaultSize="size-5 min-w-5 min-h-5" />
									) : (
										<Icons.Hashtag defaultSize="size-5 min-w-5 min-h-5" />
									)}
									<p className="text-[#B5BAC1]">{channel.channel_label}</p>
								</div>
								<Checkbox
									className="w-4 h-4 focus:ring-transparent"
									id={`checkbox-item-${index}`}
									onChange={() => handleToggle(channel.id, channel.type || 0, channel.clan_id, channel.channel_label || '')}
								/>
							</div>
						))}
					</div>
				</div>
				<div className="px-4">
					<div className="mb-2 block">
						<Label htmlFor="clearAfter" value="Shared content" className="text-[#B5BAC1] text-xs uppercase font-semibold" />
					</div>
					<div className="h-20 overflow-y-auto bg-bgProfileBody p-[5px] rounded">
						<MessageContent message={selectedMessage} newMessage="" />
					</div>
					<div className="flex justify-end p-4 rounded-b">
						<Button
							className="h-10 px-4 rounded bg-transparent hover:!bg-transparent hover:!underline focus:ring-transparent"
							type="button"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							onClick={() => sentToMessage()}
							className="h-10 px-4 rounded bg-bgSelectItem hover:!bg-bgSelectItemHover focus:ring-transparent"
						>
							Save
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
export default ForwardMessageModal;
