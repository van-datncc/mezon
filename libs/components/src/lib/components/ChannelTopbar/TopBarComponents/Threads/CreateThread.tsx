import { useThreads } from '@mezon/core';
import * as Icons from '../../../Icons';

const CreateThread = () => {
	const { setIsShowCreateThread } = useThreads();
	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-row items-center justify-between px-4 h-[58px] border-b border-gray-800">
				<div className="flex flex-row items-center gap-2 pointer-events-none">
					<Icons.ThreadIcon />
					<span className="text-base font-semibold">New Thread</span>
				</div>
				<button onClick={() => setIsShowCreateThread(false)} className="relative right-0">
					<Icons.Close />
				</button>
			</div>
			<div className="flex flex-col flex-1 justify-end px-4">
				<div className="my-4">
					<div className="flex items-center justify-center w-16 h-16 bg-[#26262B] rounded-full pointer-events-none">
						<Icons.ThreadIcon defaultSize="w-7 h-7" />
					</div>
					<div className="flex flex-col mt-4">
						<span className="text-xs font-semibold uppercase mb-2">Thread name</span>
						<input type="text" placeholder="New Thread" className="h-10 p-[10px] bg-black text-base rounded" />
					</div>
				</div>
				<div className="mb-6">
					<input
						className="w-full h-10 p-[10px] bg-[#26262B] text-base rounded"
						type="text"
						placeholder="Enter a message to start the conversation!"
					/>
				</div>
			</div>
		</div>
	);
};

export default CreateThread;
