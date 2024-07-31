import { NavLinkComponent } from '@mezon/components';
import { directActions, selectDirectById, useAppDispatch } from '@mezon/store';
import { Image } from '@mezon/ui';
import { ChannelType } from 'mezon-js';
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export type DirectMessUnreadProp = {
	readonly directMessage: Readonly<any>;
};

function DirectUnreads({ directMessage }: DirectMessUnreadProp) {
	const [countMessUnread, setCountMessUnread] = useState<number>();
	const currentDirect = useSelector(selectDirectById(directMessage.id));
	const dispatch = useAppDispatch();
	const openDirectMessage = (direct: any) => {
		dispatch(directActions.openDirectMessage({ channel_id: direct.channel_id || '' }));
	};

	useLayoutEffect(() => {
		if (currentDirect?.count_mess_unread) {
			setCountMessUnread(currentDirect?.count_mess_unread);
		}
	}, [currentDirect?.count_mess_unread]);
	return (
		<div>
			<div onClick={() => openDirectMessage(directMessage)}>
				<NavLink to={`/chat/direct/message/${directMessage.channel_id}/${directMessage.type}`}>
					<NavLinkComponent clanName={directMessage.channel_label || ''}>
						<div>
							<Image
								src={`${directMessage.type === ChannelType.CHANNEL_TYPE_DM ? directMessage.channel_avatar : 'assets/images/avatar-group.png'}`}
								alt={'logoMezon'}
								width={48}
								height={48}
								className="clan w-full aspect-square object-cover"
							/>
							{countMessUnread !== undefined && countMessUnread !== 0 && (
								<div className="absolute border-[4px] dark:border-bgPrimary border-white w-[24px] h-[24px] rounded-full bg-colorDanger text-[#fff] font-bold text-[11px] flex items-center justify-center top-7 right-[-6px]">
									{countMessUnread >= 100 ? '99+' : countMessUnread}
								</div>
							)}
						</div>
					</NavLinkComponent>
				</NavLink>
			</div>
		</div>
	);
}

export default DirectUnreads;
