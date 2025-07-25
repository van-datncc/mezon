import { usePermissionChecker } from '@mezon/core';
import { selectCurrentChannelId } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EOverriddenPermission } from '@mezon/utils';
import { useSelector } from 'react-redux';

type EmptyThreadProps = {
	onClick: () => void;
};

const EmptyThread = ({ onClick }: EmptyThreadProps) => {
	const currentChannelId = useSelector(selectCurrentChannelId);
	const [canManageThread] = usePermissionChecker([EOverriddenPermission.manageThread], currentChannelId ?? '');
	const handleCreateThread = () => {
		onClick();
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-12">
			<button className="relative mx-auto mb-4 p-[22px] rounded-full bg-theme-item cursor-default">
				<Icons.ThreadEmpty className="w-9 h-9 " />
				<Icons.EmptyUnreadStyle className="w-[104px] h-[80px] absolute top-0 left-[-10px]" />
			</button>
			<h2 className="text-2xl font-semibold mb-2">There are no threads.</h2>
			<p className="text-base  text-center">Stay focused on a conversation with a thread - a temporary text channel.</p>
			{canManageThread && (
				<button
					onClick={handleCreateThread}
					className=" py-2 px-3 mt-6 h-10 font-medium text-sm rounded-lg focus:ring-transparent btn-primary btn-primary-hover"
				>
					Create Thread
				</button>
			)}
		</div>
	);
};

export default EmptyThread;
