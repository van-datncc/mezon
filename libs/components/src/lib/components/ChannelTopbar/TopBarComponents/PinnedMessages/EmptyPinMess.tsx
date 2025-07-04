const EmptyPinMess = () => {
	return (
		<div className="flex flex-col items-center justify-center ">
			<div className="flex flex-col items-center py-16 px-7">
				<p className="text-base font-medium text-center">This channel doesn't have any pinned messages... yet.</p>
			</div>
			<div className="flex flex-col items-center h-[106px]  p-4 w-full border-t-theme-primary">
				<h2 className="text-sm text-[#2DC770] font-bold mb-2">PROTIP:</h2>
				<p className="text-sm font-normal  text-center">Users with 'Manage Messages' permission can pin a message from its context menu.</p>
			</div>
		</div>
	);
};

export default EmptyPinMess;
