type EmptyPinMessageProps = {
	onClick?: () => void;
};

const EmptyPinMessage = ({ onClick }: EmptyPinMessageProps) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-col items-center py-16 px-7 dark:bg-bgSecondary bg-gray-100">
				<p className="text-base font-medium dark:text-gray-300 text-colorTextLightMode text-center">This channel doesn't have any pinned messages... yet.</p>
			</div>
			<div className="flex flex-col items-center h-[106px] dark:bg-[#1E1F22] bg-white p-4 w-full">
				<h2 className="text-sm text-[#2DC770] font-bold mb-2">PROTIP:</h2>
				<p className="text-sm font-normal dark:text-gray-300 text-colorTextLightMode text-center">
					Users with 'Manage Messages' permission can pin a message from its context menu.
				</p>
			</div>
		</div>
	);
};

export default EmptyPinMessage;
