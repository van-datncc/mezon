import { selectCurrentChannelId } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { Tooltip } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { usePushToTalk } from '../../../PushToTalk/PushToTalkContext';
import { useWebRTC } from '../../../WebRTC/WebRTCContext';

export interface IPushToTalkBtnProps {
	isLightMode: boolean;
}

export interface IPushToTalkBtnProps {
	isLightMode: boolean;
}

export const PushToTalkBtn: React.FC<IPushToTalkBtnProps> = ({ isLightMode }) => {
	const channelId = useSelector(selectCurrentChannelId);

	const { setChannelId } = useWebRTC();
	const { isJoined, startJoinPTT, quitPTT } = usePushToTalk();

	return (
		<div className="relative flex gap-[15px] leading-5 h-5">
			<Tooltip
				className={`w-[140px] flex justify-center items-center`}
				content={isJoined ? 'Stop talking' : 'Push to talk'}
				trigger="hover"
				animation="duration-500"
				style={isLightMode ? 'light' : 'dark'}
			>
				<button
					onClick={
						!isJoined
							? () => {
									setChannelId(channelId || '');
									startJoinPTT();
								}
							: quitPTT
					}
					className="focus-visible:outline-none"
					onContextMenu={(e) => e.preventDefault()}
				>
					{isJoined ? (
						<div className="size-6 flex items-center justify-center">
							<Icons.JoinedPTT className="size-4 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
						</div>
					) : (
						<Icons.NotJoinedPTT className="size-6 dark:hover:text-white hover:text-black dark:text-[#B5BAC1] text-colorTextLightMode" />
					)}
				</button>
			</Tooltip>
		</div>
	);
};
