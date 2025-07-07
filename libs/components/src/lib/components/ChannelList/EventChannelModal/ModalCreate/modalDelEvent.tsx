import { useEventManagement, useOnClickOutside } from '@mezon/core';
import { EventManagementEntity } from '@mezon/store';
import { useEffect, useRef } from 'react';

type ModalDelEventProps = {
	event: EventManagementEntity | undefined;
	setOpenModalDelEvent: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalDelEvent = (props: ModalDelEventProps) => {
	const { event, setOpenModalDelEvent } = props;
	const { deleteEventManagement } = useEventManagement();

	const handleDeleteEvent = async () => {
		await deleteEventManagement(event?.clan_id || '', event?.id || '', event?.creator_id || '', event?.title || '');
		closeModal();
	};

	const closeModal = () => {
		setOpenModalDelEvent(false);
	};

	const panelRef = useRef(null);
	const modalRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(panelRef, closeModal);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			closeModal();
		}
	};

	useEffect(() => {
		if (modalRef.current) {
			modalRef.current.focus();
		}
	}, []);

	return (
		<div
			ref={modalRef}
			tabIndex={-1}
			onKeyDown={handleKeyDown}
			className="w-[100vw] h-[100vh] overflow-hidden fixed top-0 left-0 z-50 bg-black bg-opacity-80 flex flex-row justify-center items-center"
		>
			<div
				ref={panelRef}
				className="w-fit h-fit bg-theme-setting-primary rounded-lg flex-col justify-start  items-start gap-3 inline-flex overflow-hidden"
			>
				<div className=" w-[440px]">
					<div className="p-4 pb-0">
						<h3 className="font-bold pb-4 text-xl">Cancel Event?</h3>
						<p className="pb-4">Are you sure you want to cancel this event?</p>
					</div>
					<div className="w-full  p-4 flex justify-end gap-x-4 font-medium">
						<button onClick={closeModal} className="px-4 py-2 hover:underline rounded">
							Never Mind
						</button>
						<button onClick={handleDeleteEvent} className="px-4 py-2 bg-[#DA363C] rounded hover:bg-opacity-85 text-white">
							Cancel Event
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ModalDelEvent;
