import { AvatarImage, NavLinkComponent, SidebarTooltip } from '@mezon/components';
import { directActions, directMetaActions, messagesActions, selectDirectById, useAppDispatch, useAppSelector } from '@mezon/store';
import { ChannelType } from 'mezon-js';
import { NavLink, useNavigate } from 'react-router-dom';

export type DirectMessUnreadProp = {
	countMessUnread: number;
	directId: string;
};

function DirectUnreads({ countMessUnread, directId }: DirectMessUnreadProp) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const directMessage = useAppSelector((state) => selectDirectById(state, directId));
	const handleClick = async () => {
		await dispatch(
			directActions.joinDirectMessage({
				directMessageId: directMessage.id,
				channelName: '',
				type: directMessage.type
			})
		);
		const timestamp = Date.now() / 1000;
		dispatch(messagesActions.setDirectMessageUnread({ directId: directId, message: [] }));
		dispatch(directMetaActions.setDirectLastSeenTimestamp({ channelId: directId, timestamp: timestamp }));
		if (directMessage.active === undefined) {
			dispatch(directActions.setActiveDirect({ directId: directId }));
		}
		navigate(`/chat/direct/message/${directMessage.channel_id}/${directMessage.type}`);
	};
	return (
		<SidebarTooltip key={directMessage.id} titleTooltip={directMessage?.channel_label}>
			<NavLink to="#" onClick={handleClick}>
				<NavLinkComponent>
					<div>
						<AvatarImage
							alt={directMessage?.usernames || ''}
							userName={directMessage?.usernames}
							className="min-w-12 min-h-12 max-w-12 max-h-12"
							src={
								directMessage.type === ChannelType.CHANNEL_TYPE_DM
									? directMessage?.channel_avatar?.at(0)
									: 'assets/images/avatar-group.png'
							}
						/>
						{countMessUnread !== undefined && countMessUnread !== 0 && (
							<div className="absolute border-[4px] dark:border-bgPrimary border-white w-[24px] h-[24px] rounded-full bg-colorDanger text-[#fff] font-bold text-[11px] flex items-center justify-center top-7 right-[-6px]">
								{countMessUnread >= 100 ? '99+' : countMessUnread}
							</div>
						)}
					</div>
				</NavLinkComponent>
			</NavLink>
		</SidebarTooltip>
	);
}

export default DirectUnreads;
