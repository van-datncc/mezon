import { selectMemberByUserId } from '@mezon/store';
import { useSelector } from 'react-redux';
import { ApiChannelDescription } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

type ThreadMessageBoxProps = {
	currentChannelId?: string;
	currentThread?: ApiChannelDescription | null;
};

const ThreadMessageBox = ({ currentChannelId, currentThread }: ThreadMessageBoxProps) => {
	const user = useSelector(selectMemberByUserId(currentThread?.creator_id as string));
	return (
		<div>
			<h4 className="text-[32px] font-bold my-2">{currentThread?.channel_label}</h4>
			<div className="mb-1">
				<span className="text-base">Started by &nbsp;</span>
				<span className="text-base font-semibold">{user?.user?.username}</span>
			</div>
		</div>
	);
};

export default ThreadMessageBox;
