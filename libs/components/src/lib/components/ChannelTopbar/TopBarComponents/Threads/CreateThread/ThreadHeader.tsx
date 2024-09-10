import { useMessageValue, useThreads } from '@mezon/core';
import { Icons } from '@mezon/ui';
import { ApiChannelDescription } from 'mezon-js/api.gen';

type ThreadHeaderProps = {
	threadCurrentChannel?: ApiChannelDescription | null;
};

const ThreadHeader = ({ threadCurrentChannel }: ThreadHeaderProps) => {
	const { setNameValueThread, setIsShowCreateThread, setTurnOffThreadMessage } = useThreads();
	const { setRequestInput, request } = useMessageValue();

	const handleCloseModal = () => {
		setTurnOffThreadMessage();
		setIsShowCreateThread(false);
		setNameValueThread('');
		setRequestInput({ ...request, valueTextInput: '' }, true);
	};

	return (
		<div className="flex flex-row items-center justify-between px-4 h-[58px] min-h-[60px] border-b-[1px] dark:border-bgTertiary border-bgLightTertiary">
			<div className="flex flex-row items-center gap-2 pointer-events-none">
				<Icons.ThreadIcon />
				<span className="text-base font-semibold dark:text-white text-colorTextLightMode">
					{threadCurrentChannel ? threadCurrentChannel.channel_label : 'New Thread'}
				</span>
			</div>
			<button onClick={handleCloseModal} className="relative right-0">
				<Icons.Close />
			</button>
		</div>
	);
};

export default ThreadHeader;
