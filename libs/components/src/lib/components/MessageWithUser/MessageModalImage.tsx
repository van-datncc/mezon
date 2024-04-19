import { useEffect, useState } from 'react';
import * as Icons from '../Icons';

export type MessageModalImageProps = {
	open: boolean;
	closeModal: () => void;
	url: string | undefined;
};

const MessageModalImage = (props: MessageModalImageProps) => {
	const { open, closeModal, url } = props;
	const [scale, setScale] = useState(1);
	const [showList, setShowList] = useState(true);

	const handleShowList = () => {
		setShowList(!showList);
	};

	useEffect(() => {
		setShowList(true);
		setScale(1);
	}, [open]);

	const handleDrag = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleWheel = (event: any) => {
		const deltaY = event.deltaY;
		setScale((prevScale) => {
			let newScale = prevScale;
			if (deltaY > 0) {
				newScale = Math.max(1, prevScale - 0.05);
			} else {
				newScale = Math.min(5, prevScale + 0.05);
			}
			return newScale;
		});
	};
	return (
		<div>
			{open ? (
				<div className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none bg-black text-white">
					<div className="flex-1 flex justify-center items-center p-5 overflow-hidden h-full">
						<img
							src={url}
							alt={url}
							className="max-h-[90vh] object-contain rounded-[10px] cursor-default h-fit"
							onDragStart={handleDrag}
							onWheel={handleWheel}
							style={{ transform: `scale(${scale})`, transition: 'transform 0.5s ease' }}
						/>
					</div>
					<button
						className={`bg-[#AEAEAE] w-[30px] h-[30px] rounded-[50px] font-bold transform hover:scale-105 hover:bg-slate-400 transition duration-300 ease-in-out absolute top-5 ${showList ? 'right-[270px]' : 'right-5'}`}
						onClick={closeModal}
					>
						X
					</button>
					<button
						className={`bg-[#AEAEAE] w-[30px] h-[30px] rounded-[50px] font-bold transform hover:scale-105 hover:bg-slate-400 transition duration-300 ease-in-out absolute flex justify-center items-center ${showList ? '-rotate-90 top-5 right-[200px]' : 'rotate-90 top-[72px] right-5'}`}
						onClick={handleShowList}
					>
						<Icons.ArrowDown defaultFill="white" defaultSize="w-[20px] h-[30px]" />
					</button>
					{showList && (
						<div className="w-[250px] h-full bg-[#0B0B0B] flex flex-col p-5 overflow-y-scroll gap-y-5">
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
							<img
								src={url}
								alt={url}
								className="size-[150px] max-w-[150px] max-h-[150px] mx-auto gap-5 object-cover rounded cursor-pointer"
							/>
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};

export default MessageModalImage;
