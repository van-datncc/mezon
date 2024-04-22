import * as Icons from '../../Icons';

export const BrowseChannel = () => {
	return (
		<div className="h-5 w-full justify-start items-center gap-2 flex cursor-pointer">
			<div className="w-5 h-5 relative">
				<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
					<Icons.BrowwseChannel />
				</div>
			</div>
			<div className="text-zinc-400 text-sm font-medium">Browse Channels</div>
		</div>
	);
};

export const Events = () => {
	return (
		<div className="self-stretch inline-flex cursor-pointer">
			<div className="grow w-5 flex-row h-5 items-center gap-2 flex">
				<div className="w-5 h-5 relative flex flex-row items-center">
					<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
						<Icons.EventIcon />
					</div>
				</div>
				<div className="w-[99px] text-zinc-400 text-sm font-medium">3 Events</div>
			</div>
			<div className="w-5 h-5 p-2 bg-red-600 rounded-[50px] flex-col justify-center items-center flex">
				<div className="text-white text-xs font-medium">1</div>
			</div>
		</div>
	);
};
