import {
	eventManagementActions,
	EventManagementEntity,
	RootState,
	selectChannelById,
	selectChooseEvent,
	selectCurrentClan,
	selectMemberClanByUserId,
	selectMembersByUserIds,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { createImgproxyUrl } from '@mezon/utils';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { timeFomat } from '../timeFomatEvent';

enum tabs {
	event = 'Events',
	interest = 'Interested'
}

const ModalDetailItemEvent = () => {
	const [currentTab, setCurrentTab] = useState('Events');
	const event = useSelector(selectChooseEvent);
	const dispatch = useAppDispatch();

	const clearChooseEvent = useCallback(() => {
		dispatch(eventManagementActions.setChooseEvent(null));
		dispatch(eventManagementActions.showModelDetailEvent(false));
	}, [dispatch]);

	return (
		<div className="w-[100vw] h-[100vh] overflow-hidden fixed top-0 left-0 z-50 bg-black bg-opacity-80 flex flex-row justify-center items-center">
			<div className="w-[600px] min-h-[400px] max-h-[600px] rounded-lg overflow-hidden text-base dark:bg-[#313339] bg-white dark:text-white text-black">
				{event?.logo && <img src={event?.logo} alt={event?.title} className="w-full h-44 object-cover" />}
				<div className="flex justify-between items-center pt-4 border-b font-bold border-zinc-600">
					<div className="flex items-center gap-x-4 ml-4">
						<div className="gap-x-6 flex items-center">
							<h4
								className={`pb-4 ${currentTab === tabs.event ? 'dark:text-white text-black border-b border-white' : 'text-zinc-400'}`}
								onClick={() => setCurrentTab(tabs.event)}
							>
								Event Info
							</h4>
							<h4
								className={`pb-4 ${currentTab === tabs.interest ? 'dark:text-white text-black border-b border-white' : 'text-zinc-400'}`}
								onClick={() => setCurrentTab(tabs.interest)}
							>
								Interested
							</h4>
						</div>
					</div>
					<span className="text-base leading-3 dark:hover:text-white hover:text-black mr-4 -mt-[14px]" onClick={() => clearChooseEvent()}>
						✕
					</span>
				</div>
				{currentTab === tabs.event && <EventInfoDetail event={event} />}
				{currentTab === tabs.interest && <InterestedDetail userIds={event?.user_ids || []} />}
			</div>
		</div>
	);
};

export default ModalDetailItemEvent;

type EventInfoDetailProps = {
	event: EventManagementEntity | null;
};

const EventInfoDetail = (props: EventInfoDetailProps) => {
	const { event } = props;
	const channelVoice = useAppSelector((state) => selectChannelById(state, event?.channel_voice_id ?? '')) || {};

	const currentClan = useSelector(selectCurrentClan);
	const userCreate = useSelector(selectMemberClanByUserId(event?.creator_id || ''));
	const time = useMemo(() => timeFomat(event?.start_time || ''), [event?.start_time]);

	return (
		<div className="px-4 py-8 space-y-2 dark:text-zinc-400 text-colorTextLightMode max-h-[370px] h-fit hide-scrollbar overflow-auto">
			<h4 className="font-semibold inline-flex gap-x-3">
				<Icons.IconEvents />
				{time}
			</h4>
			<p className="font-bold dark:text-white text-black text-lg">{event?.title}</p>
			<div className="flex items-center gap-x-3">
				<img src={currentClan?.logo} alt={currentClan?.clan_name} className="size-5 rounded-full" />
				<p className="hover:underline">{currentClan?.clan_name}</p>
			</div>
			<div className="flex items-center gap-x-3 ">
				{event?.channel_id === '0' ? (
					<>
						<Icons.Location />
						<p>{event?.address}</p>
					</>
				) : (
					<>
						<Icons.Speaker />
						<p>{channelVoice?.channel_label}</p>
					</>
				)}
			</div>
			<div className="flex items-center gap-x-3">
				<Icons.MemberList />
				<p>{event?.user_ids?.length} person is interested</p>
			</div>
			<div className="flex items-center gap-x-3">
				<img src={userCreate?.user?.avatar_url} alt={userCreate?.user?.avatar_url} className="size-5 rounded-full" />
				<p>
					Created by <span className="hover:underline">{userCreate?.user?.username}</span>
				</p>
			</div>
			<div className="break-all">{event?.description}</div>
		</div>
	);
};

type InterestedDetailProps = {
	userIds: Array<string>;
};

const InterestedDetail = ({ userIds }: InterestedDetailProps) => {
	const userData = useSelector((state: RootState) => selectMembersByUserIds(state, userIds));

	return (
		<div className="p-4 space-y-1 dark:text-zinc-300 text-colorTextLightMode text-base font-semibold max-h-[250px] h-[250px] hide-scrollbar overflow-auto">
			{userData.map((user, index) => (
				<div key={index} className="flex items-center gap-x-3 rounded dark:hover:bg-slate-600 hover:bg-bgLightModeButton p-2">
					<img src={createImgproxyUrl(user?.user?.avatar_url ?? '')} alt={user?.user?.avatar_url} className="size-7 rounded-full" />
					<p>{user?.user?.username}</p>
				</div>
			))}
		</div>
	);
};
