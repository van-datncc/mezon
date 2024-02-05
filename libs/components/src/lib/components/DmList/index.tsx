import { NavLink, useNavigate } from 'react-router-dom';
import MemberProfile from '../MemberProfile';
import { IconFriends } from '../Icons';
import { useAppNavigation, useAppParams, useChannelMembers, useChatDirect } from '@mezon/core';
import * as Icons from '../Icons';
import { ModalCreateDM } from './ModalCreateDmGroup/index';
import { useEffect, useState } from 'react';
import { ChannelTypeEnum, IChannel } from '@mezon/utils';
import { ChannelMembersEntity, RootState, directActions } from '@mezon/store';
import { joinDirectMessage } from '@mezon/store';
import { useAppDispatch } from '@mezon/store';
import { useSelector } from 'react-redux';

export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

function DirectMessageList() {
	const currentDmGroupId = useSelector((state: RootState) => state.direct.currentDirectMessageId);
	const { directId } = useAppParams();
	const data = useChatDirect(directId);
	const dmGroupChatList = data.listDM;
	const filterDmGroupsByChannelLabel = (data: IChannel[]) => {
		const uniqueLabels = new Set();
		return data.filter((obj: IChannel) => {
			const isUnique = !uniqueLabels.has(obj.channel_lable);
			uniqueLabels.add(obj.channel_lable);
			return isUnique;
		});
	};

	const filteredDataDM = filterDmGroupsByChannelLabel(dmGroupChatList);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const onClickOpenModal = () => {
		setIsOpen(!isOpen);
	};

	const dispatch = useAppDispatch();
	const { toDmGroupPage } = useAppNavigation();
	const navigate = useNavigate();

	const joinToChatAndNavigate = async (DMid: string, type: number) => {
		const result = await dispatch(
			directActions.joinDirectMessage({
				directMessageId: DMid,
				channelName: '',
				type: type,
			}),
		);
		await dispatch(directActions.selectDmGroupCurrentId(DMid));

		if (result) {
			navigate(toDmGroupPage(DMid, type));
		}
	};

	return (
		<>
			<hr className="h-[0.08px] w-[272px] mt-[24px] border-[#1E1E1E]" />
			<div className="absolute">
				<ModalCreateDM onClose={onClickOpenModal} isOpen={isOpen} />
			</div>

			<div className="mt-5">
				<div className="w-full flex flex-row justify-center">
					<button
						className={` rounded-[4px] flex items-center gap-3`}
						onClick={() => {
							navigate('/chat/direct/friends');
						}}
					>
						<IconFriends />
						Add Friend
					</button>
				</div>

				<div className="text-[14px] font-bold text-[#fff] mt-6 flex flex-row items-center w-full justify-between px-1 pb-5 h-5">
					<p>DIRECT MESSAGE</p>
					<button onClick={onClickOpenModal} className="cursor-pointer flex flex-row justify-end  ml-0">
						<Icons.Plus />
					</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-scroll font-medium text-gray-300 scrollbar-hide">
				<div className="flex flex-col gap-4 font-['Manrope'] text-[#AEAEAE] py-1 text-center relative">
					<div className=" ">
						{filteredDataDM.map((directMessage: any) => (
							<button
								className={`h-fit pl-2 hover:bg-[#1E1E1E] py-2 w-full focus:bg-[#1E1E1E] ${directMessage.channel_id === currentDmGroupId ? 'bg-[#1E1E1E] text-cyan-500' : ''}`}
								onClick={() => joinToChatAndNavigate(directMessage.channel_id, directMessage.type)}
							>
								<MemberProfile
									numberCharacterCollapse={25}
									avatar={directMessage?.user?.avatar ?? ''}
									name={directMessage?.channel_lable ?? ''}
									status={false}
									isHideStatus={false}
									key={directMessage.channel_id}
								/>
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default DirectMessageList;
