import { ApiChannelDescription } from 'mezon-js/api.gen';
import * as Icons from '../../../../Icons';

type ThreadHeaderProps = {
	setIsShowCreateThread: (isShowCreateThread: boolean) => void;
	currentThread?: ApiChannelDescription | null;
};

const ThreadHeader = ({ currentThread, setIsShowCreateThread }: ThreadHeaderProps) => {
	const handleCloseModal = () => {
		setIsShowCreateThread(false);
	};

	return (
		<div className="flex flex-row items-center justify-between px-4 h-[58px] min-h-[58px] border-b border-gray-800">
			<div className="flex flex-row items-center gap-2 pointer-events-none">
				<Icons.ThreadIcon />
				<span className="text-base font-semibold">{currentThread ? currentThread.channel_label : 'New Thread'}</span>
			</div>
			<button onClick={handleCloseModal} className="relative right-0">
				<Icons.Close />
			</button>
		</div>
	);
};

export default ThreadHeader;
