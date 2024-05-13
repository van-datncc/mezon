import { useState } from 'react';
import * as Icons from '../../Icons';
import ModalCreate from './ModalCreate';
import { useAuth, useClans, useEventManagement } from '@mezon/core';
import ItemEventManagement from './ModalCreate/itemEventManagement';

export type EventModalProps = {
	open: boolean;
	onClose: () => void;
};

const EventModal = (props: EventModalProps) => {
	const { open, onClose } = props;
	const { userProfile } = useAuth();
	const { currentClan } = useClans();
	const [openModal, setOpenModal] = useState(false);
	const { allEventManagement } = useEventManagement();

	return open ? (
		<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-80 text-white">
			<div className={`relative w-full sm:h-auto ${openModal ? 'max-w-[472px]' : 'max-w-[600px]'}`}>
				<div className="rounded-lg overflow-hidden text-sm">
					{!openModal ? (
						<>
							<div className="bg-[#1E1F22] flex justify-between items-center p-4">
								<div className="flex items-center gap-x-4">
									<div className="gap-x-2 flex items-center">
										<Icons.EventIcon />
										<h4>Events</h4>
									</div>
									{currentClan?.creator_id === userProfile?.user?.id &&
										<>
											<div className="w-[0.1px] h-4 bg-gray-400"></div>
											<div className="bg-primary px-2 py-1 rounded-md" onClick={() => setOpenModal(true)}>
												Create Event
											</div>
										</>
									}
								</div>
								<span className="text-5xl leading-3 hover:text-white" onClick={onClose}>
									×
								</span>
							</div>
							
							{ allEventManagement.length !== 0 ? 
								<div className='bg-[#313339] max-h-80 h-80 overflow-y-scroll hide-scrollbar p-4 gap-y-4 flex flex-col'>
									{allEventManagement.map((event, index)=>{
										return <div key={index}>
											<ItemEventManagement topic={event.title || ''} voiceChannel={event.channel_id || ''} titleEvent={event.title || ''} address={event.address} option=""/>
										</div>
									})}
								</div> :
								<div className="bg-[#313339] h-80 flex justify-center items-center">
									<Icons.EventIcon defaultSize="size-[100px]" />
								</div>
							}
						</>
					) : (
						<ModalCreate onClose={() => setOpenModal(false)} onCloseEventModal={onClose}/>
					)}
				</div>
			</div>
		</div>
	) : null;
};

export default EventModal;
