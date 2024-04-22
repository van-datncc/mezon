import { useChannels, useDirect, useSendForwardMessage } from '@mezon/core';
import { RootState, channelsActions, useAppDispatch } from '@mezon/store';
import { Modal } from '@mezon/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Icons from '../Icons';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { ChannelStatusEnum, IMessageSendPayload } from '@mezon/utils';
import { getSelectedMessage, toggleIsShowPopupForwardFalse, toggleIsShowPopupForwardTrue } from 'libs/store/src/lib/forwardMessage/forwardMessage.slice';
import { useMezon } from '@mezon/transport';
import MessageContent from '../MessageWithUser/MessageContent';
type ModalParam = {
    open: boolean;
}
type OpjectSend = {
	id:string;
	type:number;
	clanId?: string;
	channel_label?:string;
}
const ForwardMessageModal = (pops: ModalParam) => {
	const dispatch = useAppDispatch();
	const { listDM: dmGroupChatList } = useDirect();
	const { listChannels } = useChannels();
	const listChannel = listChannels.filter((Channel)=> Channel.type === 1)
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
	const handleToggle = (id:string, type: number, clanId?:string, channel_label?:string) => {
		const existingIndex = selectedObjectIdSends.findIndex(item => item.id === id && item.type === type);
		if (existingIndex !== -1) {
		  setSelectedObjectIdSends(prevItems => [...prevItems.slice(0, existingIndex), ...prevItems.slice(existingIndex + 1)]);
		} else {
		  setSelectedObjectIdSends(prevItems => [...prevItems, { id, type, clanId, channel_label }]);
		}
	};
	
	const sentToMessage = async () => {
		for (let i = 0; i < selectedObjectIdSends.length; i++) {
			if (selectedObjectIdSends[i].type === ChannelType.CHANNEL_TYPE_DM) {
				mezon.joinChatDirectMessage(selectedObjectIdSends[i].id, '', selectedObjectIdSends[i].type);
				sendForwardMessage('', selectedObjectIdSends[i].id, '', ChannelStreamMode.STREAM_MODE_DM, selectedMessage);
			} else if (selectedObjectIdSends[i].type === ChannelType.CHANNEL_TYPE_GROUP){
				mezon.joinChatDirectMessage(selectedObjectIdSends[i].id, '', selectedObjectIdSends[i].type);
				sendForwardMessage('', selectedObjectIdSends[i].id, '', ChannelStreamMode.STREAM_MODE_GROUP, selectedMessage);
			} else if (selectedObjectIdSends[i].type === ChannelType.CHANNEL_TYPE_TEXT) {
				await mezon.joinChatChannel(selectedObjectIdSends[i].id)
				sendForwardMessage(selectedObjectIdSends[i].clanId||'',selectedObjectIdSends[i].id,selectedObjectIdSends[i].channel_label||'', ChannelStreamMode.STREAM_MODE_CHANNEL, selectedMessage);
			}
		}
		dispatch(toggleIsShowPopupForwardFalse());
	};
	
	return (
				<Modal
		title="SHARE"
		onClose={() => {
			handleCloseModal();
		}}
		showModal={pops.open}
		titleConfirm="Copy"
		classSubTitleBox="ml-[0px] mt-[15px] cursor-default"
		borderBottomTitle="border-b "
		>
			<hr className='border-1 border-[#7a7a7a] mt-[-25px]'/>
			<input type="text" 
				className='w-full border-[#1d1c1c] rounded-[10px] bg-[#1d1c1c] py-[5px] px-[10px] my-[10px]' 
				placeholder='Search'
			/>
			<hr className='border-1 border-[#7a7a7a] '/>
			<div className='h-[400px] overflow-y-auto'>
				{listDM.map((DM, index) => (
					<div key={index} className='flex items-center'>
						<input
							id={`checkbox-item-${index}`}
							type="checkbox"
							className="min-w-5 min-h-5 mr-[10px]"
							onChange={() => handleToggle(DM.id, DM.type|| 0)}
						></input>
						<img src={DM.channel_avatar} alt='' className="size-10 min-w-10 min-h-10 object-cover rounded-full mr-[10px] my-[5px]"/>
						<p>
							{DM.channel_label}
						</p>
					</div>
				))}
				{listGroup.map((group, index) => (
					<div key={index} className='flex items-center'>
						<input
							id={`checkbox-item-${index}`}
							type="checkbox"
							className="min-w-5 min-h-5 mr-[10px]"
							onChange={() => handleToggle(group.id, group.type||0)}
						></input>
						<img src={`/assets/images/avatar-group.png`} alt='' className="size-10 min-w-10 min-h-10 object-cover rounded-full mr-[10px] my-[5px]"/>
						<p>
							{group.channel_label}
						</p>
					</div>
				))}
				{listChannel.map((channel, index) => (
					<div key={index} className='flex items-center'>
						<input
							id={`checkbox-item-${index}`}
							type="checkbox"
							className="min-w-5 min-h-5 mr-[10px]"
							onChange={() => handleToggle(channel.id, channel.type||0,channel.clan_id,channel.channel_label||'')}
						></input>
						{channel.channel_private === ChannelStatusEnum.isPrivate ? <Icons.HashtagLocked defaultSize="size-10 min-w-10 min-h-10" /> : <Icons.Hashtag defaultSize="size-10 min-w-10 min-h-10" />}
						<p>
							{channel.channel_label}
						</p>
					</div>
				))}
			</div>
			<div>
				Shared content
			</div>
			<div className='h-[200px] overflow-y-auto bg-[#222222] p-[5px]'>
				<MessageContent message={selectedMessage} newMessage=''/>
			</div>
			<div className='mt-[35px]'>
				<button
					className="absolute right-0 bottom-0 mb-1 text-white font-semibold text-sm px-8 py-1.5 
					shadow hover:text-fuchsia-500 outline-none focus:outline-none ease-linear transition-all duration-150 
					bg-primary text-[16px] leading-6 rounded mr-[8px]"
					onClick={()=>sentToMessage()}
				>
					Send
				</button>
			</div>
		</Modal> 
	);
};
export default ForwardMessageModal