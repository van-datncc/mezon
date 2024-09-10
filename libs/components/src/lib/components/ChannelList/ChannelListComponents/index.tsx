import { useAppNavigation, useAppParams, useClans } from '@mezon/core';
import { eventManagementActions, EventManagementOnGogoing, selectCurrentClanId, selectNumberEvent, selectOngoingEvent, selectShowNumEvent } from '@mezon/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Icons from '../../../../../../ui/src/lib/Icons';
import EventModal from '../EventChannelModal';

const EventNotification = ({ event, onClose } : {event : EventManagementOnGogoing, onClose : ()=> void}) => (
	<div className='w-[90%] mx-auto my-2 text-sm'>
	  <div className='flex justify-between'>
		<div className='flex items-center'>
		  <div className='w-2 h-2 rounded-full bg-green-500'></div>
		  <p className='text-green-500 text-base font-bold ml-2'>Ongoing Event</p>
		</div>
		<Icons.CloseButton className='w-3 h-3 mt-2' onClick={onClose} />
	  </div>
	  <p className='text-white mt-3 text-base font-medium'>{event.title}</p>
	  <div className='flex mt-2'>
		<Icons.Location />
		<p className='ml-2 text-gray-200'>{event.address}</p>
	  </div>
	  <div className='text-center py-1 bg-green-700 mt-2 rounded'>
		<p className='text-white font-medium'>Event detail</p>
	  </div>
	</div>
)

export const Events = () => {
	const { toMembersPage } = useAppNavigation();
	const { currentURL } = useAppParams();
	const dispatch =  useDispatch()
	const numberEventManagement = useSelector(selectNumberEvent);
	const ongoingEvent = useSelector(selectOngoingEvent)
	
	const { setClanShowNumEvent } = useClans();
	const currentClanId = useSelector(selectCurrentClanId);
	const showNumEvent = useSelector(selectShowNumEvent(currentClanId || ''));
	const [showModal, setShowModal] = useState(false);
	const closeModal = () => {
		setShowModal(false);
	};

	const openModal = () => {
		setShowModal(true);
		setClanShowNumEvent(false);
	};

	const memberPath = toMembersPage(currentClanId || '');

	const handleCloseEvent = ()=> {
		dispatch(eventManagementActions.clearOngoingEvent(null))
	}
	return (
		<>
			{
				ongoingEvent && 
				<EventNotification
					event={ongoingEvent}
					onClose={handleCloseEvent}
        		/>
			}
			<div
				className="self-stretch  items-center inline-flex cursor-pointer px-2 rounded h-[34px] dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton"
				onClick={openModal}
			>
				<div className="grow w-5 flex-row items-center gap-2 flex">
					<div className="w-5 h-5 relative flex flex-row items-center">
						<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
							<Icons.IconEvents />
						</div>
					</div>
					<div className="w-[99px] dark:text-channelTextLabel text-colorTextLightMode text-base font-medium">
						{numberEventManagement === 0 && 'Events'}
						{numberEventManagement === 1 && '1 Event'}
						{numberEventManagement > 1 && `${numberEventManagement} Events`}
					</div>
				</div>
				{numberEventManagement !== 0 && showNumEvent && (
					<div className="w-5 h-5 p-2 bg-red-600 rounded-[50px] flex-col justify-center items-center flex">
						<div className="text-white text-xs font-medium">{numberEventManagement}</div>
					</div>
				)}
			</div>
			<Link
				to={memberPath}
				className={`self-stretch inline-flex cursor-pointer px-2 rounded h-[34px] ${currentURL === memberPath ? 'dark:bg-bgModifierHover bg-bgModifierHoverLight' : ''} dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight`}
			>
				<div className="grow w-5 flex-row items-center gap-2 flex">
					<div className="w-5 h-5 relative flex flex-row items-center">
						<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
							<Icons.MemberList defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						</div>
					</div>
					<div className="w-[99px] dark:text-channelTextLabel text-colorTextLightMode text-base font-medium">Members</div>
				</div>
			</Link>
			{showModal && <EventModal onClose={closeModal} numberEventManagement={numberEventManagement} />}
		</>
	);
};
