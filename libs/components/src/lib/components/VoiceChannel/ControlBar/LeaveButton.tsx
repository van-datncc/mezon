import { Icons } from '@mezon/ui';
import { generateE2eId } from '@mezon/utils';
import { memo } from 'react';

interface LeaveButtonProps {
	onLeaveRoom: () => void;
}

export const LeaveButton = memo(({ onLeaveRoom }: LeaveButtonProps) => {
	return (
		<div
			id="btn-meet-leave"
			onClick={onLeaveRoom}
			className="w-14 h-14 max-md:w-10 max-md:h-10 bg-[#da373c] hover:bg-[#a12829] cursor-pointer rounded-full flex justify-center items-center"
			data-e2e={generateE2eId('icon.end_call')}
		>
			<Icons.EndCall className="w-6 h-6 max-md:w-4 max-md:h-4" />
		</div>
	);
});
