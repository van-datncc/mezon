import { useEscapeKeyClose } from '@mezon/core';
import { useEffect, useRef } from 'react';

interface ModalConfirmProps {
	handleCancel: () => void;
	handleConfirm: () => void;
	/**  Recommend lowercase */
	title?: string;
	modalName?: string;
	buttonName?: string;
	buttonColor?: string;
	message?: string;
	customModalName?: string;
	customTitle?: string;
}

const ModalConfirm = ({
	handleCancel,
	title = 'Title Modal',
	buttonName = 'OK',
	modalName,
	handleConfirm,
	buttonColor = 'bg-red-600 hover:bg-red-700',
	message = `You won’t be able to re-join this
            server unless you are re-invited.`,
	customModalName,
	customTitle = ''
}: ModalConfirmProps) => {
	useEffect(() => {
		const handleEnterKey = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				handleConfirm();
			}
		};

		document.addEventListener('keydown', handleEnterKey);
		return () => {
			document.removeEventListener('keydown', handleEnterKey);
		};
	}, [handleConfirm]);

	const modalRef = useRef<HTMLDivElement>(null);
	useEscapeKeyClose(modalRef, handleCancel);

	return (
		<div ref={modalRef} tabIndex={-1} className="fixed inset-0 flex items-center justify-center z-50" onClick={handleCancel}>
			<div className="fixed inset-0 bg-black opacity-80 " />
			<div className="relative z-10 w-[440px]" onClick={(e) => e.stopPropagation()}>
				<div className="bg-theme-setting-primary pt-[16px] px-[16px] rounded-t-md">
					<div className=" text-theme-primary text-[20px] font-semibold pb-[16px]">
						<span className="capitalize mr-1">{title}</span>
						{customModalName ? customModalName : modalName}
					</div>
					<div className=" pb-[20px] text-theme-primary">
						{customTitle !== '' ? (
							<span>{customTitle}</span>
						) : (
							<span>
								Are you sure you want to {title} {''}
								<b className="font-semibold">{modalName}</b>? {message}
							</span>
						)}
					</div>
				</div>
				<div className="bg-theme-setting-nav  flex justify-end items-center gap-4 p-[16px] text-[14px] font-medium rounded-b-md">
					<div
						onClick={handleCancel}
						className="hover:underline px-4 rounded-lg text-theme-primary text-theme-primary-hover  cursor-pointer"
					>
						Cancel
					</div>
					<div className={`${buttonColor}  text-white rounded-lg px-[25px] py-[8px] cursor-pointer`} onClick={handleConfirm}>
						{buttonName}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalConfirm;
