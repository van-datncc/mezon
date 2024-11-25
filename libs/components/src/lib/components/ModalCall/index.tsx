import { useUserByUserId } from '@mezon/core';
import { audioCallActions, directActions, DMCallActions, selectDirectById, useAppDispatch, useAppSelector } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { Icons } from '@mezon/ui';
import { createImgproxyUrl } from '@mezon/utils';
import { WebrtcSignalingFwd } from 'mezon-js';
import { NavLink, useNavigate } from 'react-router-dom';
import { AvatarImage } from '../AvatarImage/AvatarImage';

interface ModalCallProps {
	dataCall: WebrtcSignalingFwd;
	userId: string;
}

const ModalCall = ({ dataCall, userId }: ModalCallProps) => {
	const user = useUserByUserId(dataCall?.caller_id);
	const mezon = useMezon();
	const dispatch = useAppDispatch();
	const direct = useAppSelector((state) => selectDirectById(state, dataCall.channel_id)) || {};
	const navigate = useNavigate();

	const handleJoinCall = async () => {
		await dispatch(
			directActions.joinDirectMessage({
				directMessageId: direct.id,
				channelName: '',
				type: direct.type
			})
		);

		navigate(`/chat/direct/message/${direct.channel_id}/${direct.type}`);
	};

	const handleCloseCall = async () => {
		await mezon.socketRef.current?.forwardWebrtcSignaling(dataCall?.caller_id, 4, '', dataCall.channel_id ?? '', userId ?? '');
		dispatch(DMCallActions.setIsInCall(false));
		dispatch(audioCallActions.setIsRingTone(false));
		dispatch(DMCallActions.removeAll());
	};

	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
			<div className="bg-black p-6 rounded-lg shadow-xl flex flex-col gap-6 items-center justify-center w-[232px]">
				<div className="w-16 h-16">
					<AvatarImage
						className="w-16 h-16"
						alt="user avatar"
						userName={user?.clan_nick || user?.user?.display_name || user?.user?.username}
						srcImgProxy={createImgproxyUrl((user?.clan_avatar || user?.user?.avatar_url) ?? '', {
							width: 300,
							height: 300,
							resizeType: 'fit'
						})}
						src={user?.clan_avatar || user?.user?.avatar_url}
					/>
				</div>

				<div className="text-center">
					<p className="font-semibold text-xl">{user?.user?.username}</p>
					<p className="text-gray-600">Incoming Call...</p>
				</div>

				<div className="flex gap-4 items-center">
					<div
						onClick={handleCloseCall}
						className={`h-[56px] w-[56px] rounded-full bg-red-500 hover:bg-red-700 flex items-center justify-center cursor-pointer`}
					>
						<Icons.CloseButton className={`w-[20px]`} />
					</div>
					<NavLink to="#" onClick={handleJoinCall}>
						<div
							className={`h-[56px] w-[56px] rounded-full bg-green-500 hover:bg-green-700 flex items-center justify-center cursor-pointer`}
							onClick={handleJoinCall}
						>
							<Icons.IconPhoneDM />
						</div>
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default ModalCall;
